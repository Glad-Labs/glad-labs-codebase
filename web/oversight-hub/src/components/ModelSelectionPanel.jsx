import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Alert,
  Divider,
  Chip,
  LinearProgress,
  Button,
  ButtonGroup,
  Tooltip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {
  Info as InfoIcon,
  DollarSign as CostIcon,
  TrendingDown as SaveIcon,
  Speed as FastIcon,
  Balance as BalanceIcon,
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

const QUALITY_PRESETS = {
  fast: {
    label: 'Fast (Cheapest)',
    icon: <FastIcon />,
    color: 'success',
    description:
      'Ollama for research/outline, GPT-3.5 for draft, GPT-4 for assess',
    avgCost: '$0.003 per post',
  },
  balanced: {
    label: 'Balanced',
    icon: <BalanceIcon />,
    color: 'warning',
    description: 'Mix of Ollama, GPT-3.5, and GPT-4 for best value',
    avgCost: '$0.015 per post',
  },
  quality: {
    label: 'Quality (Best)',
    icon: <QualityIcon />,
    color: 'info',
    description: 'GPT-4 and Claude for all critical phases',
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [phaseModels, setPhaseModels] = useState({});

  // Load available models on mount
  useEffect(() => {
    fetchAvailableModels();
  }, []);

  // Update cost estimates when selections change
  useEffect(() => {
    estimateCosts();
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
  }, [modelSelections, qualityPreference, totalCost]);

  const fetchAvailableModels = async () => {
    try {
      setLoading(true);
      // This would call your API endpoint
      // const response = await fetch('/api/models/available-models');
      // const data = await response.json();
      // setPhaseModels(data.models);

      // For now, use mock data matching your backend
      setPhaseModels({
        research: ['ollama', 'gpt-3.5-turbo', 'gpt-4'],
        outline: ['ollama', 'gpt-3.5-turbo', 'gpt-4'],
        draft: ['gpt-3.5-turbo', 'gpt-4', 'claude-3-opus'],
        assess: ['gpt-4', 'claude-3-opus'],
        refine: ['gpt-4', 'claude-3-opus'],
        finalize: ['gpt-4', 'claude-3-opus'],
      });

      setError(null);
    } catch (err) {
      console.error('Error fetching available models:', err);
      setError('Failed to load available models');
    } finally {
      setLoading(false);
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

      // For now, use mock cost calculation
      const mockCosts = {
        research: modelSelections.research === 'ollama' ? 0.0 : 0.001,
        outline: modelSelections.outline === 'ollama' ? 0.0 : 0.00075,
        draft: modelSelections.draft.includes('gpt-4') ? 0.003 : 0.0015,
        assess: modelSelections.assess.includes('gpt-4') ? 0.0015 : 0.001,
        refine: modelSelections.refine.includes('gpt-4') ? 0.0015 : 0.001,
        finalize: modelSelections.finalize.includes('gpt-4') ? 0.0015 : 0.001,
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
    // This would ideally call your backend API
    let newSelections;
    switch (preset) {
      case 'fast':
        newSelections = {
          research: 'ollama',
          outline: 'ollama',
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
          refine: 'gpt-4',
          finalize: 'gpt-4',
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

  const getModelLabel = (model) => {
    const labels = {
      ollama: 'Ollama (Free)',
      'gpt-3.5-turbo': 'GPT-3.5',
      'gpt-4': 'GPT-4',
      'claude-3-opus': 'Claude Opus',
      auto: 'Auto-Select',
    };
    return labels[model] || model;
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
                        <FormControl size="small" sx={{ minWidth: 150 }}>
                          <Select
                            value={modelSelections[phase]}
                            onChange={(e) =>
                              handlePhaseChange(phase, e.target.value)
                            }
                          >
                            <MenuItem value="auto">Auto-Select</MenuItem>
                            <Divider />
                            {phaseModels[phase].map((model) => (
                              <MenuItem key={model} value={model}>
                                {getModelLabel(model)}
                              </MenuItem>
                            ))}
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
        <CardHeader title="Model Information" />
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                  Ollama (Free)
                </Typography>
                <Typography variant="caption">
                  Local inference, no API costs. Good for brainstorming and
                  research.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                  GPT-3.5-Turbo
                </Typography>
                <Typography variant="caption">
                  Fast and affordable. Good balance for content generation.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                  GPT-4
                </Typography>
                <Typography variant="caption">
                  Most powerful. Recommended for quality assessment and
                  refinement.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                  Claude Opus
                </Typography>
                <Typography variant="caption">
                  Best for nuanced writing and complex assessments.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}

export default ModelSelectionPanel;
