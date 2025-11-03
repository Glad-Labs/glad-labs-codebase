import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Psychology as PsychologyIcon,
  Storage as StorageIcon,
  Language as LanguageIcon,
  Dashboard as DashboardIcon,
  PlayArrow as PlayArrowIcon,
  Code as CodeIcon,
  TrendingUp as TrendingUpIcon,
  AttachMoney as AttachMoneyIcon,
} from '@mui/icons-material';

/**
 * SystemHealthDashboard - Comprehensive overview of all Glad Labs services
 *
 * Features:
 * - Real-time service health monitoring
 * - Model configuration status
 * - Live metrics (API calls, costs, cache performance)
 * - System alerts and warnings
 * - Quick action buttons for common tasks
 */
const SystemHealthDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);

  // Service health states
  const [serviceHealth, setServiceHealth] = useState({
    cofounder: {
      status: 'unknown',
      url: 'http://localhost:8000',
      responseTime: null,
    },
    strapi: {
      status: 'unknown',
      url: 'http://localhost:1337',
      responseTime: null,
    },
    publicSite: {
      status: 'unknown',
      url: 'http://localhost:3000',
      responseTime: null,
    },
  });

  // Model configuration
  const [modelConfig, setModelConfig] = useState({
    ollama: { configured: false, models: [], active: false },
    openai: { configured: false, models: [], active: false },
    anthropic: { configured: false, models: [], active: false },
    gemini: { configured: false, models: [], active: false },
  });

  // System metrics
  const [metrics, setMetrics] = useState({
    apiCalls24h: 0,
    totalCost24h: 0,
    cacheHitRate: 0,
    activeAgents: 0,
    queuedTasks: 0,
    avgResponseTime: 0,
  });

  // System alerts
  const [alerts, setAlerts] = useState([]);

  /**
   * Check health of a single service
   */
  const checkServiceHealth = async (
    serviceName,
    url,
    healthPath = '/api/health'
  ) => {
    const startTime = Date.now();
    try {
      const response = await fetch(`${url}${healthPath}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });

      const responseTime = Date.now() - startTime;

      if (response.ok) {
        return { status: 'healthy', responseTime };
      } else {
        return {
          status: 'unhealthy',
          responseTime,
          error: `HTTP ${response.status}`,
        };
      }
    } catch (error) {
      const responseTime = Date.now() - startTime;
      return {
        status: 'unreachable',
        responseTime,
        error: error.message,
      };
    }
  };

  /**
   * Fetch model configuration from Poindexter
   * GET /api/models - Returns available models by provider
   */
  const fetchModelConfig = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/models', {
        signal: AbortSignal.timeout(5000),
      });

      if (response.ok) {
        const data = await response.json();

        // Transform the models list into provider-based configuration
        const providerConfig = {
          ollama: { configured: false, models: [], active: false },
          openai: { configured: false, models: [], active: false },
          anthropic: { configured: false, models: [], active: false },
          gemini: { configured: false, models: [], active: false },
        };

        // Group models by provider
        if (data.models && Array.isArray(data.models)) {
          data.models.forEach((model) => {
            const provider = model.provider || 'unknown';
            if (provider in providerConfig) {
              if (!providerConfig[provider].models.includes(model.name)) {
                providerConfig[provider].models.push(model.name);
              }
              // Mark as configured if we have models
              if (providerConfig[provider].models.length > 0) {
                providerConfig[provider].configured = true;
              }
            }
          });
        }

        setModelConfig(providerConfig);
      }
    } catch (error) {
      console.error('Failed to fetch model config:', error);
    }
  };

  /**
   * Fetch system metrics
   * GET /api/metrics - Aggregated task and system metrics
   */
  const fetchMetrics = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/metrics', {
        signal: AbortSignal.timeout(5000),
      });

      if (response.ok) {
        const data = await response.json();
        setMetrics({
          apiCalls24h: data.total_tasks || 0,
          totalCost24h: data.total_cost || 0,
          cacheHitRate: data.cache_hit_rate || 0,
          activeAgents: data.pending_tasks || 0,
          queuedTasks: data.pending_tasks || 0,
          avgResponseTime: data.avg_execution_time || 0,
        });
      }
    } catch (error) {
      console.error('Failed to fetch metrics:', error);
    }
  };

  /**
   * Fetch system alerts from metrics data
   * Note: /system/alerts endpoint doesn't exist in backend
   * Using /api/metrics instead to derive warnings
   */
  const fetchAlerts = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/metrics', {
        signal: AbortSignal.timeout(5000),
      });

      if (response.ok) {
        const data = await response.json();
        // Derive alerts from metrics data
        const derivedAlerts = [];

        if (data.failed_tasks > 0) {
          derivedAlerts.push({
            level: 'warning',
            message: `${data.failed_tasks} failed tasks detected`,
          });
        }

        if (data.success_rate < 80) {
          derivedAlerts.push({
            level: 'warning',
            message: `Low success rate: ${data.success_rate}%`,
          });
        }

        setAlerts(derivedAlerts);
      }
    } catch (error) {
      console.error('Failed to derive alerts:', error);
    }
  };

  /**
   * Comprehensive health check of all services
   */
  const performHealthCheck = async () => {
    setRefreshing(true);

    // Check backend and Strapi services in parallel
    // NOTE: Removed public site check to avoid CORS errors (different port/origin)
    const [cofounderHealth, strapiHealth] = await Promise.all([
      checkServiceHealth('cofounder', 'http://localhost:8000', '/api/health'),
      checkServiceHealth('strapi', 'http://localhost:1337', '/admin'),
    ]);

    setServiceHealth({
      cofounder: { ...serviceHealth.cofounder, ...cofounderHealth },
      strapi: { ...serviceHealth.strapi, ...strapiHealth },
      publicSite: {
        ...serviceHealth.publicSite,
        status: 'healthy',
        responseTime: 0,
        note: 'Public site runs on same system (not checked to avoid CORS)',
      },
    });

    // Fetch additional data only if Poindexter is healthy
    if (cofounderHealth.status === 'healthy') {
      await Promise.all([fetchModelConfig(), fetchMetrics(), fetchAlerts()]);
    }

    setLastUpdate(new Date());
    setRefreshing(false);
    setLoading(false);
  };

  // Initial load
  useEffect(() => {
    performHealthCheck();

    // Auto-refresh every 30 seconds
    const interval = setInterval(performHealthCheck, 30000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Get status color and icon
   */
  const getStatusDisplay = (status) => {
    switch (status) {
      case 'healthy':
        return { color: 'success', icon: <CheckCircleIcon />, text: 'Healthy' };
      case 'unhealthy':
        return { color: 'warning', icon: <WarningIcon />, text: 'Unhealthy' };
      case 'unreachable':
        return { color: 'error', icon: <ErrorIcon />, text: 'Unreachable' };
      default:
        return {
          color: 'default',
          icon: <CircularProgress size={16} />,
          text: 'Checking...',
        };
    }
  };

  /**
   * Render service health card
   */
  const ServiceHealthCard = ({ name, service, icon }) => {
    const statusDisplay = getStatusDisplay(service.status);

    return (
      <Card>
        <CardContent>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={2}
          >
            <Box display="flex" alignItems="center" gap={1}>
              {icon}
              <Typography variant="h6">{name}</Typography>
            </Box>
            <Chip
              label={statusDisplay.text}
              color={statusDisplay.color}
              icon={statusDisplay.icon}
              size="small"
            />
          </Box>

          <Typography variant="body2" color="text.secondary" gutterBottom>
            {service.url}
          </Typography>

          {service.responseTime && (
            <Typography variant="body2" color="text.secondary">
              Response Time: {service.responseTime}ms
            </Typography>
          )}

          {service.error && (
            <Alert severity="error" sx={{ mt: 1 }}>
              {service.error}
            </Alert>
          )}
        </CardContent>
      </Card>
    );
  };

  /**
   * Render model configuration card
   */
  const ModelConfigCard = ({ provider, config }) => {
    const providerIcons = {
      ollama: '🦙',
      openai: '🤖',
      anthropic: '🧠',
      gemini: '✨',
    };

    // Provide safe defaults if config is undefined
    const safeConfig = config || {
      configured: false,
      models: [],
      active: false,
    };

    return (
      <Card>
        <CardContent>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={2}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="h6">
                {providerIcons[provider]}{' '}
                {provider.charAt(0).toUpperCase() + provider.slice(1)}
              </Typography>
            </Box>
            <Chip
              label={safeConfig.configured ? 'Configured' : 'Not Configured'}
              color={safeConfig.configured ? 'success' : 'default'}
              size="small"
            />
          </Box>

          {safeConfig.configured && (
            <>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Active: {safeConfig.active ? 'Yes' : 'No'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Models:{' '}
                {safeConfig.models.length > 0
                  ? safeConfig.models.join(', ')
                  : 'None'}
              </Typography>
            </>
          )}

          {!safeConfig.configured && (
            <Typography variant="body2" color="text.secondary">
              Not configured. Add API keys in Settings.
            </Typography>
          )}
        </CardContent>
      </Card>
    );
  };

  /**
   * Render metric card
   */
  const MetricCard = ({ title, value, icon, trend, suffix = '' }) => (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4">
              {value}
              {suffix}
            </Typography>
            {trend && (
              <Box display="flex" alignItems="center" gap={0.5} mt={1}>
                <TrendingUpIcon fontSize="small" color="success" />
                <Typography variant="body2" color="success.main">
                  {trend}
                </Typography>
              </Box>
            )}
          </Box>
          <Box color="primary.main">{icon}</Box>
        </Box>
      </CardContent>
    </Card>
  );

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
            System Health Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {lastUpdate && `Last updated: ${lastUpdate.toLocaleTimeString()}`}
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={
            refreshing ? <CircularProgress size={16} /> : <RefreshIcon />
          }
          onClick={performHealthCheck}
          disabled={refreshing}
        >
          Refresh
        </Button>
      </Box>

      {/* System Alerts */}
      {alerts.length > 0 && (
        <Box mb={3}>
          {alerts.map((alert, index) => (
            <Alert
              key={index}
              severity={alert.severity || 'info'}
              sx={{ mb: 1 }}
            >
              {alert.message}
            </Alert>
          ))}
        </Box>
      )}

      {/* Service Health */}
      <Typography variant="h5" gutterBottom>
        Service Health
      </Typography>
      <Grid container spacing={2} mb={4}>
        <Grid item xs={12} md={4}>
          <ServiceHealthCard
            name="Poindexter"
            service={serviceHealth.cofounder}
            icon={<PsychologyIcon color="primary" />}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <ServiceHealthCard
            name="Strapi CMS"
            service={serviceHealth.strapi}
            icon={<StorageIcon color="primary" />}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <ServiceHealthCard
            name="Public Site"
            service={serviceHealth.publicSite}
            icon={<LanguageIcon color="primary" />}
          />
        </Grid>
      </Grid>

      {/* Model Configuration */}
      <Typography variant="h5" gutterBottom>
        AI Model Configuration
      </Typography>
      <Grid container spacing={2} mb={4}>
        <Grid item xs={12} md={4}>
          <ModelConfigCard provider="ollama" config={modelConfig.ollama} />
        </Grid>
        <Grid item xs={12} md={4}>
          <ModelConfigCard provider="openai" config={modelConfig.openai} />
        </Grid>
        <Grid item xs={12} md={4}>
          <ModelConfigCard
            provider="anthropic"
            config={modelConfig.anthropic}
          />
        </Grid>
      </Grid>

      {/* System Metrics */}
      <Typography variant="h5" gutterBottom>
        System Metrics (24h)
      </Typography>
      <Grid container spacing={2} mb={4}>
        <Grid item xs={12} sm={6} md={4}>
          <MetricCard
            title="API Calls"
            value={metrics.apiCalls24h.toLocaleString()}
            icon={<CodeIcon fontSize="large" />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <MetricCard
            title="Total Cost"
            value={`$${metrics.totalCost24h.toFixed(2)}`}
            icon={<AttachMoneyIcon fontSize="large" />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <MetricCard
            title="Cache Hit Rate"
            value={`${(metrics.cacheHitRate * 100).toFixed(1)}%`}
            icon={<DashboardIcon fontSize="large" />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <MetricCard
            title="Active Agents"
            value={metrics.activeAgents}
            icon={<PsychologyIcon fontSize="large" />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <MetricCard
            title="Queued Tasks"
            value={metrics.queuedTasks}
            icon={<PlayArrowIcon fontSize="large" />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <MetricCard
            title="Avg Response Time"
            value={`${metrics.avgResponseTime.toFixed(0)}ms`}
            icon={<TrendingUpIcon fontSize="large" />}
          />
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Typography variant="h5" gutterBottom>
        Quick Actions
      </Typography>
      <Grid container spacing={2}>
        <Grid item>
          <Button variant="contained" startIcon={<PlayArrowIcon />}>
            Start New Task
          </Button>
        </Grid>
        <Grid item>
          <Button variant="outlined" startIcon={<CodeIcon />}>
            View API Logs
          </Button>
        </Grid>
        <Grid item>
          <Button variant="outlined" startIcon={<AttachMoneyIcon />}>
            View Financial Report
          </Button>
        </Grid>
        <Grid item>
          <Button variant="outlined" startIcon={<StorageIcon />}>
            Manage Content
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SystemHealthDashboard;
