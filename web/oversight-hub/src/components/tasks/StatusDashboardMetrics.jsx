import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './StatusDashboardMetrics.css';
import './StatusDashboardMetrics.css';

/**
 * StatusDashboardMetrics Component
 *
 * Displays KPI cards showing task status distribution, success rates,
 * and performance metrics. Useful for dashboard and analytics views.
 *
 * Features:
 * - Task status count cards
 * - Success/failure rate calculations
 * - Average time in each state
 * - Trend indicators (up/down)
 * - Responsive grid layout
 * - Optional time range filtering
 */

const STATUS_CARDS = [
  {
    status: 'pending',
    label: 'Pending',
    icon: '⧗',
    color: '#ffc107',
    type: 'queue',
  },
  {
    status: 'in_progress',
    label: 'In Progress',
    icon: '⟳',
    color: '#2196f3',
    type: 'processing',
  },
  {
    status: 'awaiting_approval',
    label: 'Awaiting Approval',
    icon: '⏳',
    color: '#ff9800',
    type: 'waiting',
  },
  {
    status: 'approved',
    label: 'Approved',
    icon: '✓',
    color: '#4caf50',
    type: 'success',
  },
  {
    status: 'published',
    label: 'Published',
    icon: '✔',
    color: '#388e3c',
    type: 'complete',
  },
  {
    status: 'failed',
    label: 'Failed',
    icon: '✕',
    color: '#f44336',
    type: 'failed',
  },
  {
    status: 'on_hold',
    label: 'On Hold',
    icon: '⏸',
    color: '#9c27b0',
    type: 'blocked',
  },
  {
    status: 'rejected',
    label: 'Rejected',
    icon: '✗',
    color: '#d32f2f',
    type: 'failed',
  },
  {
    status: 'cancelled',
    label: 'Cancelled',
    icon: '⊘',
    color: '#757575',
    type: 'cancelled',
  },
];

const StatusDashboardMetrics = ({ statusHistory = [] }) => {
  const [metrics, setMetrics] = useState({
    counts: {},
    successRate: 0,
    failureRate: 0,
    averageDurations: {},
    totalTasks: 0,
    mostCommonStatus: null,
    timeRange: 'all',
  });
  const [timeRange, setTimeRange] = useState('all'); // all, 24h, 7d, 30d

  useEffect(() => {
    calculateMetrics();
  }, [statusHistory, timeRange]);

  const calculateMetrics = () => {
    if (!statusHistory || statusHistory.length === 0) {
      setMetrics({
        counts: {},
        successRate: 0,
        failureRate: 0,
        averageDurations: {},
        totalTasks: 0,
        mostCommonStatus: null,
        timeRange,
      });
      return;
    }

    // Filter by time range
    const now = new Date();
    let filteredHistory = statusHistory;

    if (timeRange !== 'all') {
      const ranges = {
        '24h': 24 * 60 * 60 * 1000,
        '7d': 7 * 24 * 60 * 60 * 1000,
        '30d': 30 * 24 * 60 * 60 * 1000,
      };

      const cutoffTime = now - ranges[timeRange];
      filteredHistory = statusHistory.filter((item) => {
        return new Date(item.timestamp) >= cutoffTime;
      });
    }

    // Count occurrences
    const counts = {};
    let successCount = 0;
    let failureCount = 0;

    filteredHistory.forEach((item) => {
      const status = item.new_status;
      counts[status] = (counts[status] || 0) + 1;

      if (['approved', 'published'].includes(status)) {
        successCount += 1;
      } else if (['failed', 'rejected', 'cancelled'].includes(status)) {
        failureCount += 1;
      }
    });

    // Calculate durations
    const averageDurations = {};
    const durationMap = {};

    for (let i = 0; i < filteredHistory.length - 1; i++) {
      const current = filteredHistory[i];
      const next = filteredHistory[i + 1];

      const currentTime = new Date(current.timestamp).getTime();
      const nextTime = new Date(next.timestamp).getTime();
      const durationMs = nextTime - currentTime;

      const status = current.new_status;
      if (!durationMap[status]) {
        durationMap[status] = [];
      }
      durationMap[status].push(durationMs);
    }

    Object.keys(durationMap).forEach((status) => {
      const durations = durationMap[status];
      const avgMs = durations.reduce((a, b) => a + b, 0) / durations.length;
      averageDurations[status] = formatDuration(avgMs);
    });

    // Find most common status
    let mostCommonStatus = null;
    let maxCount = 0;
    Object.entries(counts).forEach(([status, count]) => {
      if (count > maxCount) {
        maxCount = count;
        mostCommonStatus = status;
      }
    });

    const totalTasks = filteredHistory.length;
    const successRate =
      totalTasks > 0 ? Math.round((successCount / totalTasks) * 100) : 0;
    const failureRate =
      totalTasks > 0 ? Math.round((failureCount / totalTasks) * 100) : 0;

    setMetrics({
      counts,
      successRate,
      failureRate,
      averageDurations,
      totalTasks,
      mostCommonStatus,
      timeRange,
    });
  };

  const formatDuration = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d`;
    if (hours > 0) return `${hours}h`;
    if (minutes > 0) return `${minutes}m`;
    return `${seconds}s`;
  };

  const getStatusInfo = (status) => {
    return STATUS_CARDS.find((c) => c.status === status) || {};
  };

  return (
    <div className="status-dashboard-metrics">
      <div className="metrics-header">
        <h2>Task Status Metrics</h2>
        <div className="time-range-selector">
          {['all', '24h', '7d', '30d'].map((range) => (
            <button
              key={range}
              className={`range-btn ${timeRange === range ? 'active' : ''}`}
              onClick={() => setTimeRange(range)}
            >
              {range === 'all' ? 'All Time' : range}
            </button>
          ))}
        </div>
      </div>

      <div className="metrics-summary">
        <div className="summary-card total">
          <div className="summary-icon">📊</div>
          <div className="summary-content">
            <div className="summary-label">Total Tasks</div>
            <div className="summary-value">{metrics.totalTasks}</div>
          </div>
        </div>

        <div className="summary-card success">
          <div className="summary-icon">✓</div>
          <div className="summary-content">
            <div className="summary-label">Success Rate</div>
            <div className="summary-value">{metrics.successRate}%</div>
          </div>
        </div>

        <div className="summary-card failure">
          <div className="summary-icon">✕</div>
          <div className="summary-content">
            <div className="summary-label">Failure Rate</div>
            <div className="summary-value">{metrics.failureRate}%</div>
          </div>
        </div>

        {metrics.mostCommonStatus && (
          <div className="summary-card common">
            <div
              className="summary-icon"
              style={{ color: getStatusInfo(metrics.mostCommonStatus).color }}
            >
              {getStatusInfo(metrics.mostCommonStatus).icon}
            </div>
            <div className="summary-content">
              <div className="summary-label">Most Common</div>
              <div className="summary-value">
                {getStatusInfo(metrics.mostCommonStatus).label}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="metrics-grid">
        {STATUS_CARDS.map((card) => {
          const count = metrics.counts[card.status] || 0;
          const avgDuration = metrics.averageDurations[card.status];

          return (
            <div
              key={card.status}
              className="metric-card"
              style={{ borderTopColor: card.color }}
            >
              <div className="card-header">
                <div
                  className="card-icon"
                  style={{ backgroundColor: card.color }}
                >
                  {card.icon}
                </div>
                <div className="card-title">{card.label}</div>
              </div>

              <div className="card-content">
                <div className="metric-item">
                  <span className="metric-label">Count:</span>
                  <span className="metric-value">{count}</span>
                </div>

                {avgDuration && (
                  <div className="metric-item">
                    <span className="metric-label">Avg Duration:</span>
                    <span className="metric-value">{avgDuration}</span>
                  </div>
                )}

                <div className="metric-item">
                  <span className="metric-label">Type:</span>
                  <span
                    className="metric-badge"
                    style={{ backgroundColor: `${card.color}22` }}
                  >
                    {card.type}
                  </span>
                </div>
              </div>

              <div className="card-footer">
                {count > 0 && (
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${Math.min((count / Math.max(...Object.values(metrics.counts), 1)) * 100, 100)}%`,
                        backgroundColor: card.color,
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {statusHistory.length === 0 && (
        <div className="metrics-empty">
          <div className="empty-icon">📈</div>
          <div className="empty-text">No status history data available</div>
          <div className="empty-subtext">
            Metrics will appear once tasks start transitioning between states
          </div>
        </div>
      )}
    </div>
  );
};

StatusDashboardMetrics.propTypes = {
  statusHistory: PropTypes.arrayOf(
    PropTypes.shape({
      new_status: PropTypes.string,
      timestamp: PropTypes.string,
    })
  ),
};

StatusDashboardMetrics.defaultProps = {
  statusHistory: [],
};

export default StatusDashboardMetrics;
