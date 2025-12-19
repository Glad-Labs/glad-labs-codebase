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
  const [totalCost, setTotalCost] = useState(0);
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
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modelSelections, qualityPreference, totalCost]);

  const fetchAvailableModels = async () => {
    try {
      // This would call your API endpoint
      // const response = await fetch('/api/models/available-models');
      // const data = await response.json();
      // setPhaseModels(data.models);

      // Build phaseModels from AVAILABLE_MODELS - all providers available for all phases
      const modelsForAllPhases = {
        research: AVAILABLE_MODELS,
        outline: AVAILABLE_MODELS,
        draft: AVAILABLE_MODELS,
        assess: AVAILABLE_MODELS,
        refine: AVAILABLE_MODELS,
        finalize: AVAILABLE_MODELS,
      };

      setPhaseModels(modelsForAllPhases);
      setError(null);
    } catch (err) {
      console.error('Error fetching available models:', err);
      setError('Failed to load available models');
    }
  };

  const estimateCosts = async () => {
    try {
      // This would call your API endpoint
      // const response = await fetch('/api/models/estimate-full-task', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     models_by_phase: modelSelections,
      //     quality_preference: qualityPreference,
      //   }),
      // });
      // const data = await response.json();
      // setCostEstimates(data);
      // setTotalCost(data.total);

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

      const mockCosts = {
        research: getModelCost(modelSelections.research),
        outline: getModelCost(modelSelections.outline),
        draft: getModelCost(modelSelections.draft),
        assess: getModelCost(modelSelections.assess),
        refine: getModelCost(modelSelections.refine),
        finalize: getModelCost(modelSelections.finalize),
      };

      let total = 0;
      Object.values(mockCosts).forEach((cost) => {
        total += cost;
      });

      setCostEstimates(mockCosts);
      setTotalCost(parseFloat(total.toFixed(4)));
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
        newSelections = {
          research: 'ollama:mistral',
          outline: 'ollama:mistral',
          draft: 'gpt-3.5-turbo',
          assess: 'gpt-4',
          refine: 'gpt-4',
          finalize: 'gpt-4',
        };
        break;
      case 'balanced':
        newSelections = {
          research: 'gpt-3.5-turbo',
          outline: 'gpt-3.5-turbo',
          draft: 'gpt-4',
          assess: 'gpt-4',
          refine: 'claude-3-sonnet',
          finalize: 'claude-3-sonnet',
        };
        break;
      case 'quality':
      default:
        newSelections = {
          research: 'gpt-4',
          outline: 'gpt-4',
          draft: 'gpt-4',
          assess: 'claude-3-opus',
          refine: 'claude-3-opus',
          finalize: 'claude-3-opus',
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
                    Estimated Cost
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
                        icon={<CostIcon />}
                        label={`$${(costEstimates[phase] || 0).toFixed(4)}`}
                        size="small"
                        variant="outlined"
                        color={
                          (costEstimates[phase] || 0) === 0
                            ? 'success'
                            : (costEstimates[phase] || 0) > 0.002
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
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Total Estimated Cost Per Post
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Based on current selections and typical token usage
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
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
              <Typography variant="caption" color="textSecondary">
                Per 1,000 token average
              </Typography>
            </Box>
          </Box>

          {/* Cost Breakdown */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
              Cost Breakdown
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {PHASES.map((phase) => (
                <Chip
                  key={phase}
                  label={`${PHASE_NAMES[phase]}: $${(costEstimates[phase] || 0).toFixed(4)}`}
                  size="small"
                  variant="outlined"
                />
              ))}
            </Box>
          </Box>

          {/* Savings Information */}
          {totalCost > 0 && (
            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography
                variant="body2"
                sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <SaveIcon fontSize="small" />
                Using Ollama for research/outline saves ~$0.005 per post. Total
                monthly savings: ~$0.15 for 30 posts.
              </Typography>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Information Card */}
      <Card>
        <CardHeader title="Available AI Models" />
        <CardContent>
          <Grid container spacing={2}>
            {Object.entries(AVAILABLE_MODELS).map(([key, provider]) => (
              <Grid item xs={12} sm={6} md={4} key={key}>
                <Box sx={{ p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
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
    </Box>
  );
}

export default ModelSelectionPanel;
