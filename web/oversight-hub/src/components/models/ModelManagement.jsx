import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Switch,
  FormControlLabel,
  IconButton,
  Alert,
  CircularProgress,
  Divider,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Tooltip,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  PlayArrow as PlayIcon,
  Settings as SettingsIcon,
  AttachMoney as AttachMoneyIcon,
  Speed as SpeedIcon,
} from '@mui/icons-material';

/**
 * ModelManagement - Comprehensive AI model configuration and monitoring
 *
 * Features:
 * - List all configured models
 * - Toggle model availability
 * - Test model connectivity
 * - View usage statistics
 * - Configure model parameters
 * - Set default model
 */
const ModelManagement = () => {
  const [loading, setLoading] = useState(true);
  const [testing, setTesting] = useState({});
  const [testDialogOpen, setTestDialogOpen] = useState(false);
  const [testModelId, setTestModelId] = useState(null);
  const [testPrompt, setTestPrompt] = useState('Hello, how are you?');
  const [testResult, setTestResult] = useState(null);

  // Model providers and their models
  const [providers, setProviders] = useState({
    ollama: {
      name: 'Ollama (Local)',
      configured: false,
      active: false,
      models: [],
      icon: '🦙',
      cost: '$0.00/request',
    },
    openai: {
      name: 'OpenAI',
      configured: false,
      active: false,
      models: [],
      icon: '🤖',
      cost: 'Variable',
    },
    anthropic: {
      name: 'Anthropic',
      configured: false,
      active: false,
      models: [],
      icon: '🧠',
      cost: 'Variable',
    },
    gemini: {
      name: 'Google Gemini',
      configured: false,
      active: false,
      models: [],
      icon: '✨',
      cost: 'Low Cost',
    },
  });

  // Usage statistics
  const [usageStats, setUsageStats] = useState({});

  /**
   * Fetch model configuration from backend
   */
  const fetchModels = async () => {
    try {
      const response = await fetch('http://localhost:8000/models/status', {
        signal: AbortSignal.timeout(5000),
      });

      if (response.ok) {
        const data = await response.json();
        setProviders((prev) => ({
          ollama: { ...prev.ollama, ...data.ollama },
          openai: { ...prev.openai, ...data.openai },
          anthropic: { ...prev.anthropic, ...data.anthropic },
          gemini: { ...prev.gemini, ...data.gemini },
        }));
      }
    } catch (error) {
      console.error('Failed to fetch models:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch usage statistics
   */
  const fetchUsageStats = async () => {
    try {
      const response = await fetch('http://localhost:8000/models/usage', {
        signal: AbortSignal.timeout(5000),
      });

      if (response.ok) {
        const data = await response.json();
        setUsageStats(data.usage || {});
      }
    } catch (error) {
      console.error('Failed to fetch usage stats:', error);
    }
  };

  /**
   * Toggle model provider
   */
  const handleToggleProvider = async (provider) => {
    try {
      const response = await fetch(
        `http://localhost:8000/models/${provider}/toggle`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (response.ok) {
        fetchModels();
      }
    } catch (error) {
      console.error('Failed to toggle provider:', error);
    }
  };

  /**
   * Test model connectivity
   */
  const handleTestModel = async (provider, modelName) => {
    const testId = `${provider}-${modelName}`;
    setTesting((prev) => ({ ...prev, [testId]: true }));
    setTestResult(null);

    try {
      const response = await fetch('http://localhost:8000/models/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider,
          model: modelName,
          prompt: testPrompt,
        }),
        signal: AbortSignal.timeout(30000), // 30 second timeout for generation
      });

      if (response.ok) {
        const data = await response.json();
        setTestResult({
          success: true,
          response: data.response,
          responseTime: data.response_time,
          tokenCount: data.token_count,
          cost: data.cost,
        });
      } else {
        setTestResult({
          success: false,
          error: `HTTP ${response.status}: ${await response.text()}`,
        });
      }
    } catch (error) {
      setTestResult({
        success: false,
        error: error.message,
      });
    } finally {
      setTesting((prev) => ({ ...prev, [testId]: false }));
    }
  };

  /**
   * Set default model
   */
  const handleSetDefault = async (provider, modelName) => {
    try {
      const response = await fetch('http://localhost:8000/models/default', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider,
          model: modelName,
        }),
      });

      if (response.ok) {
        fetchModels();
      }
    } catch (error) {
      console.error('Failed to set default model:', error);
    }
  };

  useEffect(() => {
    fetchModels();
    fetchUsageStats();

    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchModels();
      fetchUsageStats();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  /**
   * Render provider card
   */
  const ProviderCard = ({ providerId, provider }) => {
    const isConfigured = provider.configured;
    const isActive = provider.active;

    return (
      <Card>
        <CardContent>
          {/* Header */}
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={2}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="h6">
                {provider.icon} {provider.name}
              </Typography>
              {isConfigured && (
                <Chip
                  label="Configured"
                  size="small"
                  color="success"
                  icon={<CheckCircleIcon />}
                />
              )}
            </Box>
            <FormControlLabel
              control={
                <Switch
                  checked={isActive}
                  onChange={() => handleToggleProvider(providerId)}
                  disabled={!isConfigured}
                />
              }
              label="Active"
            />
          </Box>

          {!isConfigured && (
            <Alert severity="info" sx={{ mb: 2 }}>
              Not configured. Add API key in Settings to enable.
            </Alert>
          )}

          {/* Models */}
          {isConfigured && provider.models.length > 0 && (
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Available Models ({provider.models.length})
              </Typography>
              <List dense>
                {provider.models.map((model) => {
                  const testId = `${providerId}-${model.name}`;
                  const isTesting = testing[testId];
                  const modelStats = usageStats[`${providerId}:${model.name}`];

                  return (
                    <ListItem key={model.name} divider>
                      <ListItemText
                        primary={
                          <Box display="flex" alignItems="center" gap={1}>
                            <Typography variant="body2" fontWeight="medium">
                              {model.name}
                            </Typography>
                            {model.is_default && (
                              <Chip
                                label="Default"
                                size="small"
                                color="primary"
                              />
                            )}
                          </Box>
                        }
                        secondary={
                          modelStats ? (
                            <Box>
                              <Typography variant="caption" display="block">
                                Requests: {modelStats.request_count} • Cost: $
                                {modelStats.total_cost.toFixed(4)} • Avg Time:{' '}
                                {modelStats.avg_response_time.toFixed(0)}ms
                              </Typography>
                            </Box>
                          ) : (
                            'No usage data yet'
                          )
                        }
                      />
                      <ListItemSecondaryAction>
                        <Tooltip title="Test Model">
                          <IconButton
                            size="small"
                            onClick={() => {
                              setTestModelId({
                                provider: providerId,
                                model: model.name,
                              });
                              setTestDialogOpen(true);
                            }}
                            disabled={isTesting}
                          >
                            {isTesting ? (
                              <CircularProgress size={20} />
                            ) : (
                              <PlayIcon />
                            )}
                          </IconButton>
                        </Tooltip>
                        {!model.is_default && (
                          <Tooltip title="Set as Default">
                            <IconButton
                              size="small"
                              onClick={() =>
                                handleSetDefault(providerId, model.name)
                              }
                            >
                              <SettingsIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                      </ListItemSecondaryAction>
                    </ListItem>
                  );
                })}
              </List>
            </Box>
          )}

          {/* Cost indicator */}
          <Box mt={2}>
            <Typography variant="caption" color="text.secondary">
              Cost per request: {provider.cost}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  };

  /**
   * Render usage statistics card
   */
  const UsageStatsCard = () => {
    const totalRequests = Object.values(usageStats).reduce(
      (sum, stat) => sum + (stat.request_count || 0),
      0
    );
    const totalCost = Object.values(usageStats).reduce(
      (sum, stat) => sum + (stat.total_cost || 0),
      0
    );

    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Usage Statistics (24h)
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Box textAlign="center">
                <Typography variant="h4" color="primary">
                  {totalRequests}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Requests
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box textAlign="center">
                <Typography variant="h4" color="success.main">
                  ${totalCost.toFixed(4)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Cost
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box textAlign="center">
                <Typography variant="h4" color="info.main">
                  {totalRequests > 0
                    ? ((totalCost / totalRequests) * 1000).toFixed(2)
                    : '0.00'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Cost per 1K Requests
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Box>
          <Typography variant="h4" gutterBottom>
            Model Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Configure and monitor AI model providers
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={() => {
            fetchModels();
            fetchUsageStats();
          }}
        >
          Refresh
        </Button>
      </Box>

      {/* Usage Statistics */}
      <Box mb={4}>
        <UsageStatsCard />
      </Box>

      {/* Model Providers */}
      <Typography variant="h5" gutterBottom>
        Model Providers
      </Typography>
      <Grid container spacing={3}>
        {Object.entries(providers).map(([providerId, provider]) => (
          <Grid item xs={12} md={4} key={providerId}>
            <ProviderCard providerId={providerId} provider={provider} />
          </Grid>
        ))}
      </Grid>

      {/* Test Model Dialog */}
      <Dialog
        open={testDialogOpen}
        onClose={() => {
          setTestDialogOpen(false);
          setTestResult(null);
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Test Model: {testModelId?.model}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Test Prompt"
              value={testPrompt}
              onChange={(e) => setTestPrompt(e.target.value)}
              fullWidth
              multiline
              rows={3}
            />

            {testResult && (
              <Box>
                <Divider sx={{ my: 2 }} />
                {testResult.success ? (
                  <Alert severity="success" icon={<CheckCircleIcon />}>
                    <Typography variant="subtitle2" gutterBottom>
                      Test Successful!
                    </Typography>
                    <Box display="flex" gap={2} mb={2}>
                      <Chip
                        icon={<SpeedIcon />}
                        label={`${testResult.responseTime}ms`}
                        size="small"
                      />
                      {testResult.tokenCount && (
                        <Chip
                          label={`${testResult.tokenCount} tokens`}
                          size="small"
                        />
                      )}
                      <Chip
                        icon={<AttachMoneyIcon />}
                        label={`$${testResult.cost?.toFixed(6) || '0.000000'}`}
                        size="small"
                      />
                    </Box>
                    <Typography
                      variant="body2"
                      component="pre"
                      sx={{
                        whiteSpace: 'pre-wrap',
                        backgroundColor: 'background.paper',
                        p: 2,
                        borderRadius: 1,
                      }}
                    >
                      {testResult.response}
                    </Typography>
                  </Alert>
                ) : (
                  <Alert severity="error" icon={<ErrorIcon />}>
                    <Typography variant="subtitle2" gutterBottom>
                      Test Failed
                    </Typography>
                    <Typography variant="body2">{testResult.error}</Typography>
                  </Alert>
                )}
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setTestDialogOpen(false);
              setTestResult(null);
            }}
          >
            Close
          </Button>
          <Button
            variant="contained"
            onClick={() =>
              handleTestModel(testModelId?.provider, testModelId?.model)
            }
            disabled={
              !testPrompt ||
              testing[`${testModelId?.provider}-${testModelId?.model}`]
            }
          >
            {testing[`${testModelId?.provider}-${testModelId?.model}`] ? (
              <>
                <CircularProgress size={16} sx={{ mr: 1 }} />
                Testing...
              </>
            ) : (
              'Test Model'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ModelManagement;
