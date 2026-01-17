import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './ValidationFailureUI.css';
import './ValidationFailureUI.css';

/**
 * ValidationFailureUI Component
 *
 * Displays validation errors from failed status transitions. Shows detailed
 * error information including context, timestamps, and recommendations.
 *
 * Features:
 * - Fetches from GET /api/tasks/{taskId}/status-history/failures
 * - Error grouping by type/category
 * - Expandable error details
 * - Retry suggestions
 * - Timeline of failures
 * - Severity indicators
 */

const ValidationFailureUI = ({ taskId, limit = 50 }) => {
  const [failures, setFailures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedFailure, setExpandedFailure] = useState(null);
  const [filter, setFilter] = useState('all'); // all, validation, permission, constraint

  useEffect(() => {
    fetchFailures();
  }, [taskId, limit]);

  const fetchFailures = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('authToken');
      const response = await fetch(
        `/api/tasks/${taskId}/status-history/failures?limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setFailures(data.failures || []);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch validation failures:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 30) return `${diffDays}d ago`;

    return date.toLocaleDateString();
  };

  const getFailureType = (failure) => {
    const reason = (failure.reason || '').toLowerCase();
    if (reason.includes('permission') || reason.includes('unauthorized'))
      return 'permission';
    if (reason.includes('constraint') || reason.includes('rule'))
      return 'constraint';
    if (reason.includes('validation') || reason.includes('invalid'))
      return 'validation';
    return 'other';
  };

  const getSeverity = (failure) => {
    const reason = (failure.reason || '').toLowerCase();
    if (reason.includes('critical') || reason.includes('fatal'))
      return 'critical';
    if (reason.includes('error') || reason.includes('failed')) return 'error';
    if (reason.includes('warning') || reason.includes('caution'))
      return 'warning';
    return 'info';
  };

  const getSeverityColor = (severity) => {
    const colors = {
      critical: '#d32f2f',
      error: '#f44336',
      warning: '#ff9800',
      info: '#2196f3',
    };
    return colors[severity] || '#999';
  };

  const getSeverityIcon = (severity) => {
    const icons = {
      critical: '⚠️',
      error: '✕',
      warning: '⚡',
      info: 'ℹ️',
    };
    return icons[severity] || '•';
  };

  const getRecommendation = (failure) => {
    const reason = (failure.reason || '').toLowerCase();
    if (reason.includes('permission'))
      return 'Check user permissions or request escalation';
    if (reason.includes('constraint'))
      return 'Review business rules or adjust task parameters';
    if (reason.includes('validation'))
      return 'Verify input data meets requirements';
    return 'Review failure details for more information';
  };

  const filteredFailures = failures.filter((f) => {
    if (filter === 'all') return true;
    return getFailureType(f) === filter;
  });

  if (loading) {
    return (
      <div className="validation-failure-ui loading">
        <div className="spinner">⟳ Loading failures...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="validation-failure-ui error">
        <div className="error-container">
          <div className="error-message">
            ⚠️ Failed to load validation failures
          </div>
          <div className="error-details">{error}</div>
          <button className="retry-btn" onClick={fetchFailures}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (failures.length === 0) {
    return (
      <div className="validation-failure-ui empty">
        <div className="empty-state">
          <div className="empty-icon">✓</div>
          <div className="empty-text">No validation failures</div>
          <div className="empty-subtext">
            All status transitions have been successful
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="validation-failure-ui">
      <div className="failure-header">
        <h3>Validation Failures</h3>
        <span className="failure-count">{filteredFailures.length}</span>
      </div>

      <div className="filter-tabs">
        {['all', 'validation', 'permission', 'constraint'].map((tab) => (
          <button
            key={tab}
            className={`filter-tab ${filter === tab ? 'active' : ''}`}
            onClick={() => setFilter(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="failures-list">
        {filteredFailures.map((failure, index) => {
          const severity = getSeverity(failure);
          const failureType = getFailureType(failure);
          const isExpanded = expandedFailure === index;
          const recommendation = getRecommendation(failure);

          return (
            <div
              key={index}
              className={`failure-item ${severity} ${isExpanded ? 'expanded' : ''}`}
              style={{ borderLeftColor: getSeverityColor(severity) }}
            >
              <div
                className="failure-header-row"
                onClick={() => setExpandedFailure(isExpanded ? null : index)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setExpandedFailure(isExpanded ? null : index);
                  }
                }}
              >
                <div className="failure-summary">
                  <span className="severity-icon">
                    {getSeverityIcon(severity)}
                  </span>
                  <div className="summary-content">
                    <div className="summary-title">
                      {failure.old_status || 'Unknown'} →{' '}
                      {failure.new_status || 'Unknown'}
                    </div>
                    <div className="summary-reason">{failure.reason}</div>
                  </div>
                </div>

                <div className="failure-meta">
                  <span className="failure-type">{failureType}</span>
                  <span className="failure-time">
                    {formatTimestamp(failure.timestamp)}
                  </span>
                  <span className="expand-icon">{isExpanded ? '▼' : '▶'}</span>
                </div>
              </div>

              {isExpanded && (
                <div className="failure-details">
                  <div className="details-grid">
                    <div className="detail-item">
                      <span className="detail-label">Severity:</span>
                      <span
                        className="detail-value"
                        style={{ color: getSeverityColor(severity) }}
                      >
                        {severity.toUpperCase()}
                      </span>
                    </div>

                    <div className="detail-item">
                      <span className="detail-label">Type:</span>
                      <span className="detail-value">{failureType}</span>
                    </div>

                    <div className="detail-item">
                      <span className="detail-label">Timestamp:</span>
                      <span className="detail-value">
                        {new Date(failure.timestamp).toLocaleString()}
                      </span>
                    </div>

                    <div className="detail-item">
                      <span className="detail-label">
                        Attempted Transition:
                      </span>
                      <span className="detail-value">
                        {failure.old_status} → {failure.new_status}
                      </span>
                    </div>
                  </div>

                  <div className="failure-metadata">
                    <div className="metadata-header">Error Details:</div>
                    {failure.metadata &&
                    typeof failure.metadata === 'object' ? (
                      <pre className="metadata-content">
                        {JSON.stringify(failure.metadata, null, 2)}
                      </pre>
                    ) : (
                      <div className="metadata-content">
                        {failure.metadata || 'No additional details'}
                      </div>
                    )}
                  </div>

                  <div className="recommendation-box">
                    <div className="recommendation-header">
                      💡 Recommendation:
                    </div>
                    <div className="recommendation-text">{recommendation}</div>
                  </div>

                  <div className="action-buttons">
                    <button
                      className="action-btn secondary"
                      onClick={() => setExpandedFailure(null)}
                    >
                      Close
                    </button>
                    <button
                      className="action-btn primary"
                      onClick={fetchFailures}
                    >
                      Refresh
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="failure-footer">
        <button className="refresh-btn" onClick={fetchFailures}>
          🔄 Refresh Failures
        </button>
      </div>
    </div>
  );
};

ValidationFailureUI.propTypes = {
  taskId: PropTypes.string.isRequired,
  limit: PropTypes.number,
};

ValidationFailureUI.defaultProps = {
  limit: 50,
};

export default ValidationFailureUI;
