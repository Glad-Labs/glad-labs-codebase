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
 * UPDATED October 26, 2025 (Phase 5)
 * STATUS: Already using REST API (no Firestore dependencies found)
 * NOTE: The "firestore_hits" field in ai_cache is a legacy metric name
 *       from when Google Cloud was being used. Will be renamed in future
 *       backend updates to "db_cache_hits" for clarity.
 *
 * Displays real-time cost analytics including:
 * - Monthly budget usage and remaining balance ($100/month)
 * - AI cache performance and savings
 * - Model router efficiency
 * - Intervention alerts
 * - Total cost optimization impact
 *
 * Fetches from: GET /api/metrics/costs with 30-second polling
 */

interface CostMetrics {
  timestamp: string;
  budget: {
    monthly_limit: number;
    current_spent: number;
    remaining: number;
    alerts: string[];
  };
  ai_cache: {
    total_requests: number;
    cache_hits: number;
    cache_misses: number;
    hit_rate_percentage: number;
    memory_hits: number;
    firestore_hits: number;
    memory_entries: number;
    estimated_savings_usd: number;
  } | null;
  model_router: {
    total_requests: number;
    budget_model_uses: number;
    budget_model_percentage: number;
    premium_model_uses: number;
    estimated_cost_actual_usd: number;
    estimated_cost_baseline_usd: number;
    estimated_savings_usd: number;
    savings_percentage: number;
  } | null;
  interventions: {
    pending_count: number;
    pending_task_ids: string[];
    budget_threshold_usd: number;
  } | null;
  summary: {
    total_estimated_savings_usd: number;
    optimization_status: string;
  };
}

const CostMetricsDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<CostMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

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
          Cost Optimization Dashboard
        </Typography>
        <Box>
          <Tooltip title="Refresh metrics">
            <IconButton onClick={fetchMetrics} disabled={loading}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Last Updated */}
      {lastUpdated && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mb: 2, display: 'block' }}
        >
          Last updated: {lastUpdated.toLocaleTimeString()}
        </Typography>
      )}

      {/* Budget Alerts */}
      {metrics.budget.alerts.length > 0 && (
        <Alert severity="warning" icon={<WarningIcon />} sx={{ mb: 3 }}>
          {metrics.budget.alerts.map((alert, idx) => (
            <Typography key={idx}>{alert}</Typography>
          ))}
        </Alert>
      )}

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Total Savings Card */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SavingsIcon color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">Total Estimated Savings</Typography>
              </Box>
              <Typography variant="h3" color="success.main">
                ${metrics.summary.total_estimated_savings_usd.toFixed(2)}
              </Typography>
              <Chip
                label={metrics.summary.optimization_status}
                color={
                  metrics.summary.optimization_status === 'active'
                    ? 'success'
                    : 'default'
                }
                size="small"
                sx={{ mt: 1 }}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Budget Usage Card */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Monthly Budget Status
              </Typography>
              <Box
                sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}
              >
                <Typography variant="body2">
                  ${metrics.budget.current_spent.toFixed(2)} / $
                  {metrics.budget.monthly_limit.toFixed(2)}
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  {budgetUsagePercent.toFixed(1)}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={Math.min(budgetUsagePercent, 100)}
                color={getBudgetStatusColor()}
                sx={{ height: 10, borderRadius: 5 }}
              />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Remaining: ${metrics.budget.remaining.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Detailed Metrics */}
      <Grid container spacing={3}>
        {/* AI Cache Performance */}
        {metrics.ai_cache && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  AI Response Cache
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Total Requests
                    </Typography>
                    <Typography variant="h6">
                      {metrics.ai_cache.total_requests.toLocaleString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Hit Rate
                    </Typography>
                    <Typography variant="h6" color="success.main">
                      {metrics.ai_cache.hit_rate_percentage.toFixed(1)}%
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Cache Hits
                    </Typography>
                    <Typography variant="body1">
                      {metrics.ai_cache.cache_hits.toLocaleString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Cache Misses
                    </Typography>
                    <Typography variant="body1">
                      {metrics.ai_cache.cache_misses.toLocaleString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Box
                      sx={{
                        bgcolor: 'success.light',
                        p: 2,
                        borderRadius: 1,
                        mt: 1,
                      }}
                    >
                      <Typography variant="body2" color="success.dark">
                        Estimated Savings
                      </Typography>
                      <Typography variant="h5" color="success.dark">
                        ${metrics.ai_cache.estimated_savings_usd.toFixed(2)}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Model Router Performance */}
        {metrics.model_router && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Smart Model Router
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Total Requests
                    </Typography>
                    <Typography variant="h6">
                      {metrics.model_router.total_requests.toLocaleString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Budget Model Usage
                    </Typography>
                    <Typography variant="h6" color="success.main">
                      {metrics.model_router.budget_model_percentage.toFixed(1)}%
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Actual Cost
                    </Typography>
                    <Typography variant="body1">
                      $
                      {metrics.model_router.estimated_cost_actual_usd.toFixed(
                        2
                      )}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Baseline Cost
                    </Typography>
                    <Typography variant="body1">
                      $
                      {metrics.model_router.estimated_cost_baseline_usd.toFixed(
                        2
                      )}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Box
                      sx={{
                        bgcolor: 'success.light',
                        p: 2,
                        borderRadius: 1,
                        mt: 1,
                      }}
                    >
                      <Typography variant="body2" color="success.dark">
                        Estimated Savings (
                        {metrics.model_router.savings_percentage.toFixed(1)}%)
                      </Typography>
                      <Typography variant="h5" color="success.dark">
                        ${metrics.model_router.estimated_savings_usd.toFixed(2)}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Intervention Alerts */}
        {metrics.interventions && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Intervention Monitor
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  {metrics.interventions.pending_count > 0 ? (
                    <>
                      <ErrorIcon color="warning" />
                      <Typography>
                        {metrics.interventions.pending_count} task(s) pending
                        intervention
                      </Typography>
                    </>
                  ) : (
                    <>
                      <CheckCircleIcon color="success" />
                      <Typography>No pending interventions</Typography>
                    </>
                  )}
                </Box>
                {metrics.interventions.pending_count > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Pending Task IDs:
                    </Typography>
                    {metrics.interventions.pending_task_ids.map((taskId) => (
                      <Chip
                        key={taskId}
                        label={taskId}
                        size="small"
                        sx={{ mr: 1, mb: 1 }}
                      />
                    ))}
                  </Box>
                )}
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 2, display: 'block' }}
                >
                  Budget threshold: $
                  {metrics.interventions.budget_threshold_usd.toFixed(2)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default CostMetricsDashboard;
