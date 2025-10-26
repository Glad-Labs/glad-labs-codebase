/**
 * MetricsDisplay.jsx
 *
 * Component for displaying aggregated task execution metrics
 * - Total tasks, completed, failed counts
 * - Success rate percentage
 * - Average execution time
 * - Total cost tracking
 * - Auto-refresh every 30 seconds
 *
 * @component
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Typography,
  CircularProgress,
  Alert,
  Tooltip,
  LinearProgress,
  Paper,
  IconButton,
  Chip,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Schedule as ScheduleIcon,
  TrendingUp as TrendingUpIcon,
  AttachMoney as AttachMoneyIcon,
} from '@mui/icons-material';
import useStore from '../store/useStore';
import { getMetrics } from '../services/cofounderAgentClient';

/**
 * MetricCard Component
 * Reusable card for displaying individual metrics
 */
function MetricCard({
  title,
  value,
  icon: Icon,
  unit = '',
  color = 'primary',
}) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box>
            <Typography color="textSecondary" gutterBottom variant="caption">
              {title}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {typeof value === 'number' && value !== Math.floor(value)
                  ? value.toFixed(1)
                  : value}
              </Typography>
              {unit && (
                <Typography color="textSecondary" variant="body2">
                  {unit}
                </Typography>
              )}
            </Box>
          </Box>
          <Icon
            sx={{
              fontSize: 48,
              color: `${color}.main`,
              opacity: 0.3,
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
}

/**
 * MetricsDisplay Component
 * @param {Object} props
 * @param {number} props.refreshInterval - Refresh interval in milliseconds (default: 30000)
 */
export default function MetricsDisplay({ refreshInterval = 30000 }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(null);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);

  // Get state and methods from Zustand
  const metrics = useStore((state) => state.metrics);
  const setMetrics = useStore((state) => state.setMetrics);
  const isAuthenticated = useStore((state) => state.isAuthenticated);

  /**
   * Fetch metrics from backend
   */
  const fetchMetrics = useCallback(async () => {
    if (!isAuthenticated) {
      setError('You must be logged in to view metrics');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await getMetrics();

      // Update Zustand store with new metrics
      setMetrics({
        totalTasks: response.totalTasks || 0,
        completedTasks: response.completedTasks || 0,
        failedTasks: response.failedTasks || 0,
        successRate: response.successRate || 0,
        avgExecutionTime: response.avgExecutionTime || 0,
        totalCost: response.totalCost || 0,
      });

      setLastRefresh(new Date());
    } catch (err) {
      console.error('Failed to fetch metrics:', err);
      setError(err.message || 'Failed to fetch metrics');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, setMetrics]);

  /**
   * Set up auto-refresh interval
   */
  useEffect(() => {
    if (!isAuthenticated) return;

    // Fetch immediately on mount
    fetchMetrics();

    // Set up interval for auto-refresh
    let interval;
    if (autoRefreshEnabled) {
      interval = setInterval(fetchMetrics, refreshInterval);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isAuthenticated, autoRefreshEnabled, refreshInterval, fetchMetrics]);

  if (!isAuthenticated) {
    return (
      <Alert severity="warning">You must be logged in to view metrics</Alert>
    );
  }

  if (error) {
    return (
      <Alert severity="error" action={<RefreshIcon onClick={fetchMetrics} />}>
        {error}
      </Alert>
    );
  }

  // Calculate percentages and derived metrics
  const successPercentage =
    metrics.totalTasks > 0
      ? Math.round((metrics.completedTasks / metrics.totalTasks) * 100)
      : 0;
  const failurePercentage =
    metrics.totalTasks > 0
      ? Math.round((metrics.failedTasks / metrics.totalTasks) * 100)
      : 0;
  const pendingTasks =
    metrics.totalTasks - metrics.completedTasks - metrics.failedTasks;

  return (
    <Box sx={{ width: '100%' }}>
      {/* Header with refresh controls */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            Metrics Dashboard
          </Typography>
          {lastRefresh && (
            <Typography variant="caption" color="textSecondary">
              Last refreshed: {lastRefresh.toLocaleTimeString()}
            </Typography>
          )}
        </Box>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Tooltip
            title={
              autoRefreshEnabled
                ? 'Auto-refresh enabled'
                : 'Auto-refresh disabled'
            }
          >
            <Chip
              label={
                autoRefreshEnabled ? 'Auto-refresh: ON' : 'Auto-refresh: OFF'
              }
              onClick={() => setAutoRefreshEnabled(!autoRefreshEnabled)}
              color={autoRefreshEnabled ? 'success' : 'default'}
              variant="outlined"
              size="small"
            />
          </Tooltip>
          <Tooltip title="Refresh metrics">
            <span>
              <IconButton
                onClick={fetchMetrics}
                disabled={loading}
                size="small"
              >
                <RefreshIcon
                  sx={{
                    animation: loading ? 'spin 1s linear infinite' : 'none',
                  }}
                />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      </Box>

      {/* Main metrics grid */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Tasks"
            value={metrics.totalTasks}
            icon={ScheduleIcon}
            color="info"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Completed"
            value={metrics.completedTasks}
            icon={CheckCircleIcon}
            color="success"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Failed"
            value={metrics.failedTasks}
            icon={ErrorIcon}
            color="error"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Success Rate"
            value={successPercentage}
            unit="%"
            icon={TrendingUpIcon}
            color="success"
          />
        </Grid>
      </Grid>

      {/* Secondary metrics */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <MetricCard
            title="Average Execution Time"
            value={metrics.avgExecutionTime}
            unit="seconds"
            icon={ScheduleIcon}
            color="info"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <MetricCard
            title="Total Cost"
            value={metrics.totalCost}
            unit="$"
            icon={AttachMoneyIcon}
            color="warning"
          />
        </Grid>
      </Grid>

      {/* Task breakdown chart */}
      <Card sx={{ mb: 3 }}>
        <CardHeader title="Task Status Breakdown" />
        <CardContent>
          <Box sx={{ mb: 2 }}>
            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}
            >
              <Typography variant="body2">Completed</Typography>
              <Typography variant="body2" color="success.main">
                {successPercentage}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={successPercentage}
              sx={{ height: 8, borderRadius: 4, bgcolor: 'action.hover' }}
              color="success"
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}
            >
              <Typography variant="body2">Failed</Typography>
              <Typography variant="body2" color="error.main">
                {failurePercentage}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={failurePercentage}
              sx={{ height: 8, borderRadius: 4, bgcolor: 'action.hover' }}
              color="error"
            />
          </Box>

          <Box>
            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}
            >
              <Typography variant="body2">Pending</Typography>
              <Typography variant="body2" color="info.main">
                {metrics.totalTasks > 0
                  ? Math.round((pendingTasks / metrics.totalTasks) * 100)
                  : 0}
                %
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={
                metrics.totalTasks > 0
                  ? (pendingTasks / metrics.totalTasks) * 100
                  : 0
              }
              sx={{ height: 8, borderRadius: 4, bgcolor: 'action.hover' }}
              color="info"
            />
          </Box>
        </CardContent>
      </Card>

      {/* Summary stats */}
      <Paper sx={{ p: 2, bgcolor: 'action.hover' }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Typography variant="caption" color="textSecondary">
              Pending Tasks
            </Typography>
            <Typography variant="h6">{pendingTasks}</Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="caption" color="textSecondary">
              Total Cost
            </Typography>
            <Typography variant="h6">
              ${metrics.totalCost.toFixed(2)}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="caption" color="textSecondary">
              Avg Time per Task
            </Typography>
            <Typography variant="h6">
              {metrics.avgExecutionTime.toFixed(1)}s
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Loading indicator */}
      {loading && (
        <Box sx={{ position: 'relative', minHeight: 100 }}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <CircularProgress size={40} />
          </Box>
        </Box>
      )}
    </Box>
  );
}
