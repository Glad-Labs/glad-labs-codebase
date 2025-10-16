import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  LinearProgress,
  Chip,
  Alert,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  TrendingDown as SavingsIcon,
  Warning as WarningIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';

/**
 * Cost Metrics Dashboard Component
 *
 * Displays real-time cost analytics including:
 * - Monthly budget usage and remaining balance ($100/month)
 * - AI cache performance and savings
 * - Model router efficiency
 * - Intervention alerts
 * - Total cost optimization impact
 */

const CostMetricsDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Fetch cost metrics from API
  const fetchMetrics = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('http://localhost:8000/metrics/costs');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setMetrics(data.costs);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch metrics');
      console.error('Error fetching cost metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch on mount and set up auto-refresh every 30 seconds
  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  // Calculate budget usage percentage
  const budgetUsagePercent = metrics
    ? (metrics.budget.current_spent / metrics.budget.monthly_limit) * 100
    : 0;

  // Determine budget status color
  const getBudgetStatusColor = () => {
    if (budgetUsagePercent >= 90) return 'error';
    if (budgetUsagePercent >= 75) return 'warning';
    return 'success';
  };

  if (loading && !metrics) {
    return (
      <Box sx={{ p: 3 }}>
        <LinearProgress />
        <Typography sx={{ mt: 2 }}>Loading cost metrics...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 3 }}>
        {error}
      </Alert>
    );
  }

  if (!metrics) {
    return (
      <Alert severity="info" sx={{ m: 3 }}>
        No cost metrics available
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1">
          💰 Cost Metrics Dashboard
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {lastUpdated && (
            <Typography variant="caption" color="text.secondary">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </Typography>
          )}
          <Tooltip title="Refresh metrics">
            <IconButton onClick={fetchMetrics} disabled={loading}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Budget Overview */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            📊 Monthly Budget Status
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                Budget Used
              </Typography>
              <Typography variant="h5">
                ${metrics.budget.current_spent.toFixed(2)} / $
                {metrics.budget.monthly_limit.toFixed(2)}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                Remaining
              </Typography>
              <Typography variant="h5" color={getBudgetStatusColor()}>
                ${metrics.budget.remaining.toFixed(2)}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={budgetUsagePercent}
                  color={getBudgetStatusColor()}
                  sx={{ flexGrow: 1, height: 10, borderRadius: 5 }}
                />
                <Typography variant="body2">
                  {budgetUsagePercent.toFixed(1)}%
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {/* Budget Alerts */}
          {metrics.budget.alerts && metrics.budget.alerts.length > 0 && (
            <Box sx={{ mt: 2 }}>
              {metrics.budget.alerts.map((alert, index) => (
                <Alert
                  key={index}
                  severity={
                    alert.includes('CRITICAL')
                      ? 'error'
                      : alert.includes('WARNING')
                        ? 'warning'
                        : 'info'
                  }
                  icon={<WarningIcon />}
                  sx={{ mb: 1 }}
                >
                  {alert}
                </Alert>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>

      {/* AI Cache Performance */}
      {metrics.ai_cache && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              🚀 AI Cache Performance
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Hit Rate
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="h5">
                    {metrics.ai_cache.hit_rate_percentage.toFixed(1)}%
                  </Typography>
                  {metrics.ai_cache.hit_rate_percentage >= 50 ? (
                    <CheckCircleIcon color="success" />
                  ) : (
                    <ErrorIcon color="warning" />
                  )}
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Cache Hits
                </Typography>
                <Typography variant="h5">
                  {metrics.ai_cache.cache_hits.toLocaleString()}
                </Typography>
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Memory Entries
                </Typography>
                <Typography variant="h5">
                  {metrics.ai_cache.memory_entries.toLocaleString()}
                </Typography>
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Estimated Savings
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="h5" color="success.main">
                    ${metrics.ai_cache.estimated_savings_usd.toFixed(2)}
                  </Typography>
                  <SavingsIcon color="success" />
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Model Router Performance */}
      {metrics.model_router && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              🎯 Model Router Efficiency
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Typography variant="body2" color="text.secondary">
                  Budget Model Usage
                </Typography>
                <Typography variant="h5">
                  {metrics.model_router.budget_model_percentage.toFixed(1)}%
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {metrics.model_router.budget_model_uses.toLocaleString()} /{' '}
                  {metrics.model_router.total_requests.toLocaleString()}{' '}
                  requests
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="body2" color="text.secondary">
                  Cost Savings
                </Typography>
                <Typography variant="h5" color="success.main">
                  ${metrics.model_router.estimated_savings_usd.toFixed(2)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {metrics.model_router.savings_percentage.toFixed(1)}%
                  reduction
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="body2" color="text.secondary">
                  Optimization Status
                </Typography>
                <Chip
                  label={metrics.summary.optimization_status}
                  color={
                    metrics.summary.optimization_status === 'Excellent'
                      ? 'success'
                      : metrics.summary.optimization_status === 'Good'
                        ? 'primary'
                        : 'warning'
                  }
                  icon={<CheckCircleIcon />}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Intervention Alerts */}
      {metrics.interventions && metrics.interventions.pending_count > 0 && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              ⚠️ Pending Interventions
            </Typography>
            <Alert severity="warning" icon={<WarningIcon />}>
              <Typography variant="body2">
                <strong>{metrics.interventions.pending_count}</strong> tasks are
                pending budget approval (threshold: $
                {metrics.interventions.budget_threshold_usd.toFixed(2)})
              </Typography>
              {metrics.interventions.pending_task_ids.length > 0 && (
                <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
                  Task IDs: {metrics.interventions.pending_task_ids.join(', ')}
                </Typography>
              )}
            </Alert>
          </CardContent>
        </Card>
      )}

      {/* Summary Card */}
      <Card
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
        }}
      >
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
            💡 Total Optimization Impact
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography
                variant="body2"
                sx={{ color: 'rgba(255,255,255,0.8)' }}
              >
                Total Estimated Savings
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="h4" sx={{ color: 'white' }}>
                  ${metrics.summary.total_estimated_savings_usd.toFixed(2)}
                </Typography>
                <SavingsIcon sx={{ fontSize: 32 }} />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography
                variant="body2"
                sx={{ color: 'rgba(255,255,255,0.8)' }}
              >
                Optimization Status
              </Typography>
              <Typography variant="h4" sx={{ color: 'white' }}>
                {metrics.summary.optimization_status}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: 'rgba(255,255,255,0.8)' }}
              >
                {metrics.ai_cache &&
                  `Cache hit rate: ${metrics.ai_cache.hit_rate_percentage.toFixed(
                    1
                  )}%`}
                {metrics.model_router &&
                  `, Router efficiency: ${metrics.model_router.savings_percentage.toFixed(
                    1
                  )}%`}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Metrics Timestamp */}
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: 'block', mt: 2, textAlign: 'center' }}
      >
        Metrics generated: {new Date(metrics.timestamp).toLocaleString()}
      </Typography>
    </Box>
  );
};

export default CostMetricsDashboard;
