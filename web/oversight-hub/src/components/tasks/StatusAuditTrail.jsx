import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './StatusAuditTrail.css';
import './StatusAuditTrail.css';

/**
 * StatusAuditTrail Component
 *
 * Displays complete audit trail of status changes for a task
 * - Shows timeline of all status transitions
 * - Displays reason, user, and timestamp for each change
 * - Includes metadata context
 * - Filterable and searchable
 */
const StatusAuditTrail = ({ taskId, limit = 50 }) => {
  const [auditTrail, setAuditTrail] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState({});
  const [filter, setFilter] = useState('all'); // all, validated, rejected, approved

  useEffect(() => {
    if (taskId) {
      fetchAuditTrail();
    }
  }, [taskId, limit]);

  const fetchAuditTrail = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(
        `/api/tasks/${taskId}/status-history?limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch audit trail: ${response.statusText}`);
      }

      const data = await response.json();
      setAuditTrail(data.history || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching audit trail:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#ffc107',
      in_progress: '#2196f3',
      awaiting_approval: '#ff9800',
      approved: '#9c27b0',
      published: '#4caf50',
      failed: '#f44336',
      on_hold: '#9e9e9e',
      rejected: '#ff5722',
      cancelled: '#616161',
    };
    return colors[status] || '#999999';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: '⧗',
      in_progress: '⟳',
      awaiting_approval: '⚠️',
      approved: '✓',
      published: '✓✓',
      failed: '✗',
      on_hold: '⊥',
      rejected: '✗',
      cancelled: '⊙',
    };
    return icons[status] || '○';
  };

  const toggleExpanded = (id) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const getRelativeTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const filteredTrail =
    filter === 'all'
      ? auditTrail
      : auditTrail.filter((entry) => entry.new_status === filter);

  if (loading) {
    return (
      <div className="status-audit-trail loading">
        <div className="spinner">Loading audit trail...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="status-audit-trail error">
        <div className="error-message">⚠️ {error}</div>
        <button onClick={fetchAuditTrail} className="retry-btn">
          Retry
        </button>
      </div>
    );
  }

  if (!auditTrail.length) {
    return (
      <div className="status-audit-trail empty">
        <div className="empty-state">No status changes yet</div>
      </div>
    );
  }

  return (
    <div className="status-audit-trail">
      <div className="audit-header">
        <h3>Status Change History</h3>
        <span className="count">{filteredTrail.length} entries</span>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        <button
          className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({auditTrail.length})
        </button>
        <button
          className={`filter-tab ${filter === 'awaiting_approval' ? 'active' : ''}`}
          onClick={() => setFilter('awaiting_approval')}
        >
          Awaiting Approval
        </button>
        <button
          className={`filter-tab ${filter === 'approved' ? 'active' : ''}`}
          onClick={() => setFilter('approved')}
        >
          Approved
        </button>
        <button
          className={`filter-tab ${filter === 'rejected' ? 'active' : ''}`}
          onClick={() => setFilter('rejected')}
        >
          Rejected
        </button>
      </div>

      {/* Timeline */}
      <div className="timeline">
        {filteredTrail.map((entry, index) => (
          <div key={entry.id} className="timeline-item">
            {/* Timeline Connector */}
            {index < filteredTrail.length - 1 && (
              <div className="timeline-connector" />
            )}

            {/* Timeline Node */}
            <div className="timeline-node">
              <div
                className="node-dot"
                style={{ backgroundColor: getStatusColor(entry.new_status) }}
                title={entry.new_status}
              >
                {getStatusIcon(entry.new_status)}
              </div>
            </div>

            {/* Entry Content */}
            <div className="entry-content">
              {/* Header */}
              <div className="entry-header">
                <div className="status-transition">
                  <span className="old-status">{entry.old_status}</span>
                  <span className="arrow">→</span>
                  <span
                    className="new-status"
                    style={{ color: getStatusColor(entry.new_status) }}
                  >
                    {entry.new_status}
                  </span>
                </div>
                <span className="relative-time">
                  {getRelativeTime(entry.timestamp)}
                </span>
              </div>

              {/* Reason */}
              {entry.reason && (
                <div className="entry-reason">
                  <strong>Reason:</strong> {entry.reason}
                </div>
              )}

              {/* Metadata */}
              {entry.metadata && Object.keys(entry.metadata).length > 0 && (
                <div className="entry-metadata">
                  <button
                    className="expand-btn"
                    onClick={() => toggleExpanded(entry.id)}
                  >
                    {expanded[entry.id] ? '▼' : '▶'} Metadata
                  </button>
                  {expanded[entry.id] && (
                    <div className="metadata-details">
                      <pre>{JSON.stringify(entry.metadata, null, 2)}</pre>
                    </div>
                  )}
                </div>
              )}

              {/* Timestamp */}
              <div className="entry-timestamp">
                {formatTimestamp(entry.timestamp)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Refresh Button */}
      <div className="audit-footer">
        <button onClick={fetchAuditTrail} className="refresh-btn">
          ↻ Refresh
        </button>
      </div>
    </div>
  );
};

StatusAuditTrail.propTypes = {
  taskId: PropTypes.string.isRequired,
  limit: PropTypes.number,
};

export default StatusAuditTrail;
