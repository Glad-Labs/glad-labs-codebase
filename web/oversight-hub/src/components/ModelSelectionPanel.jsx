import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  FormControl,
  Select,
  MenuItem,
  Typography,
  Alert,
  Divider,
  Chip,
  Button,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {
  AttachMoney as CostIcon,
  TrendingDown as SaveIcon,
  Speed as FastIcon,
  SyncAlt as BalanceIcon,
  Star as QualityIcon,
} from '@mui/icons-material';

const PHASES = ['research', 'outline', 'draft', 'assess', 'refine', 'finalize'];
const PHASE_NAMES = {
  research: 'Research',
  outline: 'Outline',
  draft: 'Draft',
  assess: 'Assess',
  refine: 'Refine',
  finalize: 'Finalize',
};

// Electricity cost tracking for Ollama models
// Power consumption estimates (watts) for different model sizes
// Based on typical GPU/CPU usage patterns for local LLM inference
const MODEL_POWER_CONSUMPTION = {
  // Small models (7B parameters) - ~30W average
  'mistral:latest': 30,
  'neural-chat:latest': 30,
  'llama2:latest': 30,
  'qwen2:7b': 30,
  'gemma3:12b': 40,
  
  // Medium models (14B parameters) - ~50W average
  'qwen2.5:14b': 50,
  'qwen3:14b': 50,
  
  // Large models (30B+ parameters) - ~80W+ average
  'qwen3-coder:30b': 80,
  'qwen3-vl:30b': 80,
  'mixtral:latest': 90, // 8x7B - higher power due to MoE
  'deepseek-coder:33b': 85,
  
  // Very Large models (70B parameters) - ~120W+ average
  'llama3:70b-instruct': 120,
  'gpt-oss:120b': 150,
  
  // Default for unknown models
  'default': 50,
};

// Average US electricity price: $0.12 per kWh
// Calculated per token: typical inference processes ~5 tokens/second
const ELECTRICITY_COST_CONFIG = {
  pricePerKwh: 0.12, // dollars per kilowatt-hour
  avgTokensPerSecond: 5, // typical inference throughput
  secondsPerPost: 600, // ~10 minutes for full blog post processing (6 phases)
};

// Default model definitions - will be updated with actual Ollama models
const AVAILABLE_MODELS = {
  ollama: {
    name: 'Ollama (Local)',
    models: [], // Will be populated from Ollama API
  },
  gpt: {
    name: 'OpenAI',
    models: [
      { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', cost: 0.0005 },
      { id: 'gpt-4', name: 'GPT-4', cost: 0.003 },
      { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', cost: 0.001 },
      { id: 'gpt-4o', name: 'GPT-4o', cost: 0.0015 },
    ],
  },
  claude: {
    name: 'Anthropic',
    models: [
      { id: 'claude-3-haiku', name: 'Claude 3 Haiku', cost: 0.00025 },
      { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet', cost: 0.003 },
      { id: 'claude-3-opus', name: 'Claude 3 Opus', cost: 0.015 },
    ],
  },
};

// Recommended Ollama models for content generation (for reference/documentation)
const RECOMMENDED_OLLAMA_MODELS = {
  'mistral:latest': 'Mistral 7B - Fast, good for general tasks',
  'neural-chat:latest': 'Neural Chat - Optimized for conversations',
  'qwen2:7b': 'Qwen 2 7B - Multilingual support',
  'qwen2.5:14b': 'Qwen 2.5 14B - Better reasoning',
  'llama2:latest': 'Llama 2 7B - Strong general model',
  'mixtral:latest': 'Mixtral 8x7B - MoE architecture, better quality',
  'deepseek-coder:33b': 'DeepSeek Coder 33B - Code generation',
  'qwen3-coder:30b': 'Qwen 3 Coder 30B - Advanced code generation',
  'llama3:70b-instruct': 'Llama 3 70B - High-quality long-form content',
  'gemma3:12b': 'Gemma 3 12B - Lightweight but capable',
  'gemma3:27b': 'Gemma 3 27B - Better quality outputs',
};

const QUALITY_PRESETS = {
  fast: {
    label: 'Fast (Cheapest)',
    icon: <FastIcon />,
    color: 'success',
    description:
      'Ollama for research/outline, GPT-3.5 for draft/assess, GPT-4 for refine/finalize',
    avgCost: '$0.003 per post',
  },
  balanced: {
    label: 'Balanced',
    icon: <BalanceIcon />,
    color: 'warning',
    description: 'Mix of GPT-3.5, GPT-4, and Claude Sonnet for best value',
    avgCost: '$0.015 per post',
  },
  quality: {
    label: 'Quality (Best)',
    icon: <QualityIcon />,
    color: 'info',
    description: 'GPT-4 and Claude Opus for all phases',
    avgCost: '$0.040 per post',
  },
};

/**
 * ModelSelectionPanel Component
 *
 * Allows users to:
 * 1. Quickly select quality preference (Fast/Balanced/Quality)
 * 2. Manually override individual phase selections
 * 3. See cost estimates in real-time
 * 4. Save preferences for future tasks
 *
 * Integration: Use in TaskCreationModal or as standalone dashboard
 */
export function ModelSelectionPanel({
  onSelectionChange,
  initialQuality = 'balanced',
  availableModels = null,
}) {
  // State
  const [qualityPreference, setQualityPreference] = useState(initialQuality);
  const [modelSelections, setModelSelections] = useState({
    research: 'auto',
    outline: 'auto',
    draft: 'auto',
    assess: 'auto',
    refine: 'auto',
    finalize: 'auto',
  });
  const [costEstimates, setCostEstimates] = useState({});
  const [electricityCosts, setElectricityCosts] = useState({});
  const [totalCost, setTotalCost] = useState(0);
  const [totalElectricityCost, setTotalElectricityCost] = useState(0);
  const [error, setError] = useState(null);
  const [phaseModels, setPhaseModels] = useState({});

  // Load available models on mount
  useEffect(() => {
    fetchAvailableModels();
  }, []);

  // Update cost estimates when selections change
  useEffect(() => {
    estimateCosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modelSelections, qualityPreference]);

  // Notify parent of changes
  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange({
        modelSelections,
        qualityPreference,
        estimatedCost: totalCost,
        electricityCost: totalElectricityCost,
        combinedCost: totalCost + totalElectricityCost,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modelSelections, qualityPreference, totalCost, totalElectricityCost]);

  const fetchAvailableModels = async () => {
    try {
      // Fetch actual Ollama models from the local Ollama instance
      const ollamaResponse = await fetch('http://localhost:11434/api/tags');

      if (!ollamaResponse.ok) {
        console.warn('Ollama API not available, using default models');
        setPhaseModels(getDefaultPhaseModels());
        return;
      }

      const ollamaData = await ollamaResponse.json();

      // Process Ollama models
      const ollamaModels = (ollamaData.models || []).map((model) => ({
        id: model.name, // Use the full model name including tag (e.g., "mistral:latest")
        name: formatOllamaModelName(model.name),
        cost: 0, // Ollama models running locally are free
      }));

      // Update AVAILABLE_MODELS with actual Ollama models
      const updatedModels = { ...AVAILABLE_MODELS };
      updatedModels.ollama.models = ollamaModels;

      // Build phaseModels from updated AVAILABLE_MODELS - all providers available for all phases
      const modelsForAllPhases = {
        research: updatedModels,
        outline: updatedModels,
        draft: updatedModels,
        assess: updatedModels,
        refine: updatedModels,
        finalize: updatedModels,
      };

      setPhaseModels(modelsForAllPhases);
      setError(null);

      console.log(
        '✅ Loaded Ollama models:',
        ollamaModels.map((m) => m.name)
      );
    } catch (err) {
      console.error('Error fetching Ollama models:', err);
      console.warn('Falling back to default models');

      // Fall back to default models if Ollama is not available
      setPhaseModels(getDefaultPhaseModels());
      setError('Ollama not available - using default model list');
    }
  };

  const getDefaultPhaseModels = () => {
    // Fallback models when Ollama API is not available
    const defaultOllamaModels = [
      { id: 'mistral:latest', name: 'Mistral 7B', cost: 0 },
      { id: 'neural-chat:latest', name: 'Neural Chat 7B', cost: 0 },
      { id: 'llama2:latest', name: 'Llama 2 7B', cost: 0 },
      { id: 'qwen2:7b', name: 'Qwen 2 7B', cost: 0 },
      { id: 'qwen2.5:14b', name: 'Qwen 2.5 14B', cost: 0 },
      { id: 'mixtral:latest', name: 'Mixtral 8x7B', cost: 0 },
      { id: 'gemma3:12b', name: 'Gemma 3 12B', cost: 0 },
    ];

    const defaultModels = { ...AVAILABLE_MODELS };
    defaultModels.ollama.models = defaultOllamaModels;

    return {
      research: defaultModels,
      outline: defaultModels,
      draft: defaultModels,
      assess: defaultModels,
      refine: defaultModels,
      finalize: defaultModels,
    };
  };

  const formatOllamaModelName = (modelId) => {
    // Convert "mistral:latest" to "Mistral" or "qwen2:7b" to "Qwen 2 7B"
    const name = modelId.split(':')[0]; // Get base name without tag

    // Create human-readable names
    const nameMap = {
      mistral: 'Mistral 7B',
      'neural-chat': 'Neural Chat 7B',
      llama2: 'Llama 2 7B',
      llama3: 'Llama 3',
      qwen2: 'Qwen 2 7B',
      'qwen2.5': 'Qwen 2.5 14B',
      qwen3: 'Qwen 3 14B',
      'qwen3-coder': 'Qwen 3 Coder 30B',
      'qwen3-vl': 'Qwen 3 Vision 30B',
      mixtral: 'Mixtral 8x7B',
      gemma3: 'Gemma 3',
      'deepseek-coder': 'DeepSeek Coder 33B',
      'deepseek-r1': 'DeepSeek R1',
      llava: 'LLaVA (Vision)',
      'gpt-oss': 'GPT-OSS',
      qwq: 'QwQ',
    };

    // Look up the display name
    let displayName = nameMap[name] || name;

    // Add parameter size info if available
    if (modelId.includes('70b')) displayName += ' 70B';
    else if (modelId.includes('32b')) displayName += ' 32B';
    else if (modelId.includes('30b')) displayName += ' 30B';
    else if (modelId.includes('27b')) displayName += ' 27B';
    else if (modelId.includes('14b')) displayName += ' 14B';
    else if (modelId.includes('13b')) displayName += ' 13B';
    else if (modelId.includes('12b')) displayName += ' 12B';

    // Add quantization info for clarity
    if (modelId.includes('fp16')) displayName += ' (FP16)';
    else if (modelId.includes('q5')) displayName += ' (Q5)';

    return displayName;
  };

  const estimateCosts = async () => {
    try {
      // Calculate costs based on model selections
      const getModelCost = (modelId) => {
        if (modelId === 'auto') return 0.002; // Default estimate for auto-select

        // Search through AVAILABLE_MODELS for the matching model
        for (const provider of Object.values(AVAILABLE_MODELS)) {
          const model = provider.models.find((m) => m.id === modelId);
          if (model) return model.cost;
        }
        return 0; // Default if not found
      };

      const phases = [
        'research',
        'outline',
        'draft',
        'assess',
        'refine',
        'finalize',
      ];
      const mockCosts = {};
      const mockElectricityCosts = {};
      let total = 0;
      let totalElectricity = 0;

      phases.forEach((phase, index) => {
        const modelId = modelSelections[phase];
        mockCosts[phase] = getModelCost(modelId);
        mockElectricityCosts[phase] = calculateElectricityCost(modelId, index);
        total += mockCosts[phase];
        totalElectricity += mockElectricityCosts[phase];
      });

      setCostEstimates(mockCosts);
      setElectricityCosts(mockElectricityCosts);
      setTotalCost(parseFloat(total.toFixed(4)));
      setTotalElectricityCost(parseFloat(totalElectricity.toFixed(4)));
    } catch (err) {
      console.error('Error estimating costs:', err);
      setError('Failed to estimate costs');
    }
  };

  const applyQualityPreset = async (preset) => {
    setQualityPreference(preset);

    // Auto-select models based on preset
    let newSelections;
    switch (preset) {
      case 'fast':
        // Fast: Use lightweight Ollama models
        newSelections = {
          research: 'mistral:latest',
          outline: 'mistral:latest',
          draft: 'neural-chat:latest',
          assess: 'qwen2.5:14b',
          refine: 'qwen2.5:14b',
          finalize: 'qwen2.5:14b',
        };
        break;
      case 'balanced':
        // Balanced: Mix of capable models
        newSelections = {
          research: 'qwen2.5:14b',
          outline: 'qwen2.5:14b',
          draft: 'qwen3:14b',
          assess: 'qwen3-coder:30b',
          refine: 'mixtral:latest',
          finalize: 'mixtral:latest',
        };
        break;
      case 'quality':
      default:
        // Quality: Use the best available models
        newSelections = {
          research: 'mixtral:latest',
          outline: 'mixtral:latest',
          draft: 'qwen3-coder:30b',
          assess: 'llama3:70b-instruct',
          refine: 'llama3:70b-instruct',
          finalize: 'llama3:70b-instruct',
        };
    }

    setModelSelections(newSelections);
  };

  const handlePhaseChange = (phase, model) => {
    setModelSelections({
      ...modelSelections,
      [phase]: model,
    });
  };

  const resetToAuto = () => {
    setModelSelections({
      research: 'auto',
      outline: 'auto',
      draft: 'auto',
      assess: 'auto',
      refine: 'auto',
      finalize: 'auto',
    });
  };

  const getModelLabel = (modelId) => {
    if (modelId === 'auto') return 'Auto-Select';

    // Search through AVAILABLE_MODELS to find the matching model label
    for (const provider of Object.values(AVAILABLE_MODELS)) {
      const model = provider.models.find((m) => m.id === modelId);
      if (model) return model.name;
    }
    return modelId; // Fallback to ID if not found
  };

  const getPhaseIcon = (phase) => {
    const icons = {
      research: '🔍',
      outline: '📋',
      draft: '✍️',
      assess: '⭐',
      refine: '✨',
      finalize: '🎯',
    };
    return icons[phase] || '•';
  };

  const getModelPowerConsumption = (modelId) => {
    // Return power consumption in watts for a model
    if (modelId === 'auto') {
      return MODEL_POWER_CONSUMPTION.default;
    }

    // Get exact match or find closest match
    if (MODEL_POWER_CONSUMPTION[modelId]) {
      return MODEL_POWER_CONSUMPTION[modelId];
    }

    // Try to match by base model name
    const baseModel = modelId.split(':')[0];
    for (const [key, power] of Object.entries(MODEL_POWER_CONSUMPTION)) {
      if (key.includes(baseModel)) {
        return power;
      }
    }

    // Return default for unknown models
    return MODEL_POWER_CONSUMPTION.default;
  };

  const calculateElectricityCost = (modelId, phaseIndex) => {
    // Only calculate electricity for Ollama models
    const isOllamaModel =
      !modelId.includes('gpt') && !modelId.includes('claude');
    if (!isOllamaModel) {
      return 0; // Cloud API models don't have local electricity costs
    }

    const powerWatts = getModelPowerConsumption(modelId);

    // Estimate processing time per phase (in seconds)
    // Research: 100s, Outline: 80s, Draft: 150s, Assess: 60s, Refine: 100s, Finalize: 50s
    const phaseProcessingTimes = {
      research: 100,
      outline: 80,
      draft: 150,
      assess: 60,
      refine: 100,
      finalize: 50,
    };

    const phases = [
      'research',
      'outline',
      'draft',
      'assess',
      'refine',
      'finalize',
    ];
    const processingSeconds = phaseProcessingTimes[phases[phaseIndex]] || 100;

    // Calculate energy consumption: (watts / 1000) * (seconds / 3600) = kWh
    const energyKwh = (powerWatts / 1000) * (processingSeconds / 3600);

    // Calculate cost: kWh * price per kWh
    const cost = energyKwh * ELECTRICITY_COST_CONFIG.pricePerKwh;

    return cost;
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Header */}
      <Card sx={{ mb: 3 }}>
        <CardHeader
          title="Model Selection & Cost Control"
          subheader="Choose which AI model to use for each pipeline step"
          avatar={<CostIcon sx={{ fontSize: 40 }} />}
        />
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Quality Preference Buttons */}
      <Card sx={{ mb: 3 }}>
        <CardHeader title="Quick Presets" />
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {Object.entries(QUALITY_PRESETS).map(([key, preset]) => (
              <Button
                key={key}
                variant={qualityPreference === key ? 'contained' : 'outlined'}
                color={preset.color}
                startIcon={preset.icon}
                onClick={() => applyQualityPreset(key)}
                sx={{
                  flex: 1,
                  minWidth: 200,
                  py: 2,
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  justifyContent: 'flex-start',
                  textAlign: 'left',
                }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                  {preset.label}
                </Typography>
                <Typography variant="caption" sx={{ mt: 0.5 }}>
                  {preset.description}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ mt: 0.5, fontWeight: 'bold' }}
                >
                  {preset.avgCost}
                </Typography>
              </Button>
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Per-Phase Selection */}
      <Card sx={{ mb: 3 }}>
        <CardHeader
          title="Fine-Tune Per Phase"
          action={
            <Tooltip title="Reset to Auto-Select">
              <Button size="small" onClick={resetToAuto}>
                Reset to Auto
              </Button>
            </Tooltip>
          }
        />
        <CardContent>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>Phase</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>
                    Selected Model
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }} align="right">
                    API Cost
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }} align="right">
                    ⚡ Electricity
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }} align="right">
                    Total
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {PHASES.map((phase) => (
                  <TableRow key={phase}>
                    <TableCell>
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                      >
                        <Typography sx={{ fontSize: 20 }}>
                          {getPhaseIcon(phase)}
                        </Typography>
                        <Typography sx={{ fontWeight: 500 }}>
                          {PHASE_NAMES[phase]}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {phaseModels[phase] && (
                        <FormControl size="small" sx={{ minWidth: 200 }}>
                          <Select
                            value={modelSelections[phase]}
                            onChange={(e) =>
                              handlePhaseChange(phase, e.target.value)
                            }
                          >
                            <MenuItem value="auto">Auto-Select</MenuItem>
                            <Divider />
                            {Object.entries(phaseModels[phase]).map(
                              ([providerKey, providerData]) => [
                                <MenuItem
                                  key={`header-${providerKey}`}
                                  disabled
                                  sx={{
                                    fontWeight: 'bold',
                                    backgroundColor: '#f5f5f5',
                                  }}
                                >
                                  {providerData.name}
                                </MenuItem>,
                                ...providerData.models.map((model) => (
                                  <MenuItem
                                    key={model.id}
                                    value={model.id}
                                    sx={{ pl: 4 }}
                                  >
                                    {model.name}
                                    {model.cost === 0 && (
                                      <Chip
                                        label="Free"
                                        size="small"
                                        color="success"
                                        variant="outlined"
                                        sx={{ ml: 1, height: 20 }}
                                      />
                                    )}
                                  </MenuItem>
                                )),
                              ]
                            )}
                          </Select>
                        </FormControl>
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <Chip
                        label={`$${(costEstimates[phase] || 0).toFixed(4)}`}
                        size="small"
                        variant="outlined"
                        color={
                          (costEstimates[phase] || 0) === 0
                            ? 'success'
                            : 'warning'
                        }
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip
                        title={`Power cost: ~${getModelPowerConsumption(modelSelections[phase])}W`}
                      >
                        <Chip
                          label={`$${(electricityCosts[phase] || 0).toFixed(4)}`}
                          size="small"
                          variant="outlined"
                          icon={
                            <Typography sx={{ fontSize: '0.8em' }}>
                              ⚡
                            </Typography>
                          }
                          color={
                            (electricityCosts[phase] || 0) === 0
                              ? 'default'
                              : 'info'
                          }
                        />
                      </Tooltip>
                    </TableCell>
                    <TableCell align="right">
                      <Chip
                        label={`$${((costEstimates[phase] || 0) + (electricityCosts[phase] || 0)).toFixed(4)}`}
                        size="small"
                        variant="filled"
                        color={
                          (costEstimates[phase] || 0) +
                            (electricityCosts[phase] || 0) ===
                          0
                            ? 'success'
                            : (costEstimates[phase] || 0) +
                                  (electricityCosts[phase] || 0) >
                                0.005
                              ? 'warning'
                              : 'default'
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Divider sx={{ my: 2 }} />

          {/* Total Cost Summary */}
          <Box sx={{ display: 'flex', gap: 3, mb: 3, flexWrap: 'wrap' }}>
            <Box sx={{ flex: 1, minWidth: 250 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                API Cost Per Post
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                Service provider fees (OpenAI, Anthropic, etc.)
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 'bold',
                  color:
                    totalCost === 0
                      ? '#4caf50'
                      : totalCost < 0.02
                        ? '#ff9800'
                        : '#f44336',
                }}
              >
                ${totalCost.toFixed(4)}
              </Typography>
            </Box>

            <Box sx={{ flex: 1, minWidth: 250 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                ⚡ Electricity Cost Per Post
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                Local power consumption (~${ELECTRICITY_COST_CONFIG.pricePerKwh}
                /kWh)
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 'bold',
                  color: totalElectricityCost === 0 ? '#666' : '#1976d2',
                }}
              >
                ${totalElectricityCost.toFixed(4)}
              </Typography>
            </Box>

            <Box sx={{ flex: 1, minWidth: 250 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Total Combined Cost
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                API + Electricity costs per post
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 'bold',
                  color:
                    totalCost + totalElectricityCost === 0
                      ? '#4caf50'
                      : totalCost + totalElectricityCost < 0.02
                        ? '#ff9800'
                        : '#f44336',
                }}
              >
                ${(totalCost + totalElectricityCost).toFixed(4)}
              </Typography>
            </Box>
          </Box>

          {/* Cost Breakdown */}
          <Box sx={{ mt: 3, mb: 3 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2 }}>
              Cost Breakdown by Phase
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {PHASES.map((phase) => (
                <Tooltip
                  key={phase}
                  title={`API: $${(costEstimates[phase] || 0).toFixed(4)} + Electricity: $${(electricityCosts[phase] || 0).toFixed(4)}`}
                >
                  <Chip
                    label={`${PHASE_NAMES[phase]}: $${((costEstimates[phase] || 0) + (electricityCosts[phase] || 0)).toFixed(4)}`}
                    size="small"
                    variant="outlined"
                  />
                </Tooltip>
              ))}
            </Box>
          </Box>

          {/* Savings Information */}
          {(totalCost > 0 || totalElectricityCost > 0) && (
            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <SaveIcon
                  sx={{ fontSize: 18, mr: 1, verticalAlign: 'middle' }}
                />
                <strong>Cost Impact Analysis:</strong>
              </Typography>
              {totalCost > 0 && (
                <Typography
                  variant="caption"
                  sx={{ display: 'block', ml: 3, mb: 0.5 }}
                >
                  • API costs: ${totalCost.toFixed(4)} per post
                </Typography>
              )}
              {totalElectricityCost > 0 && (
                <Typography
                  variant="caption"
                  sx={{ display: 'block', ml: 3, mb: 0.5 }}
                >
                  • Electricity costs: ${totalElectricityCost.toFixed(4)} per
                  post (local hardware)
                </Typography>
              )}
              <Typography
                variant="caption"
                sx={{ display: 'block', ml: 3, mb: 0.5 }}
              >
                • Monthly total (30 posts): $
                {((totalCost + totalElectricityCost) * 30).toFixed(2)}
              </Typography>
              {totalCost === 0 && totalElectricityCost > 0 && (
                <Typography
                  variant="caption"
                  sx={{ display: 'block', ml: 3, mt: 1, fontStyle: 'italic' }}
                >
                  Using local Ollama models saves on API costs, but requires
                  electricity to run on your hardware.
                </Typography>
              )}
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Information Card */}
      <Card sx={{ mb: 3 }}>
        <CardHeader title="Available AI Models" />
        <CardContent>
          <Grid container spacing={2}>
            {Object.entries(AVAILABLE_MODELS).map(([key, provider]) => (
              <Grid
                key={key}
                sx={{
                  display: 'flex',
                  width: { xs: '100%', sm: '50%', md: '33.333%' },
                  px: 1,
                  pb: 2,
                }}
              >
                <Box
                  sx={{
                    p: 2,
                    backgroundColor: '#f5f5f5',
                    borderRadius: 1,
                    width: '100%',
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 'bold', mb: 1 }}
                  >
                    {provider.name}
                  </Typography>
                  <Box
                    sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}
                  >
                    {provider.models.map((model) => (
                      <Typography key={model.id} variant="caption">
                        • {model.name}
                        {model.cost === 0 ? (
                          <Chip
                            label="Free"
                            size="small"
                            color="success"
                            variant="outlined"
                            sx={{ ml: 1, height: 18 }}
                          />
                        ) : (
                          ` - $${(model.cost * 1000).toFixed(2)}/1K tokens`
                        )}
                      </Typography>
                    ))}
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Electricity Cost Information Card */}
      <Card>
        <CardHeader title="⚡ Electricity Cost Tracking" />
        <CardContent>
          <Grid container spacing={2}>
            <Grid
              sx={{
                display: 'flex',
                width: { xs: '100%', sm: '50%' },
                px: 1,
                pb: 2,
              }}
            >
              <Box
                sx={{
                  p: 2,
                  backgroundColor: '#e3f2fd',
                  borderRadius: 1,
                  width: '100%',
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 'bold', mb: 1 }}
                >
                  How It Works
                </Typography>
                <Typography variant="caption" sx={{ display: 'block', mb: 1 }}>
                  <strong>Power Consumption:</strong> Each model consumes
                  different amounts of electricity based on its size:
                </Typography>
                <Box sx={{ ml: 2, mb: 2 }}>
                  <Typography variant="caption" sx={{ display: 'block' }}>
                    • Small (7B): ~30W
                  </Typography>
                  <Typography variant="caption" sx={{ display: 'block' }}>
                    • Medium (14B): ~50W
                  </Typography>
                  <Typography variant="caption" sx={{ display: 'block' }}>
                    • Large (30B+): ~80-150W
                  </Typography>
                </Box>
                <Typography variant="caption" sx={{ display: 'block', mb: 1 }}>
                  <strong>Electricity Rate:</strong> $
                  {ELECTRICITY_COST_CONFIG.pricePerKwh}/kWh (US average)
                </Typography>
                <Typography variant="caption" sx={{ display: 'block' }}>
                  <strong>Processing Time:</strong> ~
                  {ELECTRICITY_COST_CONFIG.secondsPerPost / 60} minutes per blog
                  post
                </Typography>
              </Box>
            </Grid>
            <Grid
              sx={{
                display: 'flex',
                width: { xs: '100%', sm: '50%' },
                px: 1,
                pb: 2,
              }}
            >
              <Box
                sx={{
                  p: 2,
                  backgroundColor: '#f3e5f5',
                  borderRadius: 1,
                  width: '100%',
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 'bold', mb: 1 }}
                >
                  Cost Examples
                </Typography>
                <Typography variant="caption" sx={{ display: 'block', mb: 1 }}>
                  <strong>Mistral 7B (30W):</strong> ~$0.0005 per post
                </Typography>
                <Typography variant="caption" sx={{ display: 'block', mb: 1 }}>
                  <strong>Qwen 2.5 14B (50W):</strong> ~$0.0008 per post
                </Typography>
                <Typography variant="caption" sx={{ display: 'block', mb: 1 }}>
                  <strong>Llama 3 70B (120W):</strong> ~$0.002 per post
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Typography
                  variant="caption"
                  sx={{ display: 'block', fontStyle: 'italic' }}
                >
                  <strong>30 posts/month:</strong> Electricity cost ranges from
                  $0.015 to $0.06
                </Typography>
              </Box>
            </Grid>
          </Grid>
          <Typography
            variant="caption"
            sx={{ display: 'block', mt: 2, color: 'textSecondary' }}
          >
            💡 <strong>Tip:</strong> Smaller models (7-14B) offer the best
            balance of cost and quality for content generation. Compare
            electricity costs with API service costs to find your optimal
            price-to-performance ratio.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

export default ModelSelectionPanel;
