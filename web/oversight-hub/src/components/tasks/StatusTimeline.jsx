import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './StatusTimeline.css';

/**
 * StatusTimeline Component
 *
 * Displays a visual representation of task status progression with all possible
 * transitions. Shows current state, completed states, and available next states.
 *
 * Features:
 * - Horizontal status flow visualization
 * - Color-coded status indicators
 * - Duration tracking between state transitions
 * - Interactive state details on click
 * - Responsive design for mobile/tablet
 */

const STATUS_FLOW = [
  { id: 1, status: 'pending', label: 'Pending', icon: '⧗', color: '#ffc107' },
  {
    id: 2,
    status: 'in_progress',
    label: 'In Progress',
    icon: '⟳',
    color: '#2196f3',
  },
  {
    id: 3,
    status: 'awaiting_approval',
    label: 'Awaiting Approval',
    icon: '⏳',
    color: '#ff9800',
  },
  { id: 4, status: 'approved', label: 'Approved', icon: '✓', color: '#4caf50' },
  {
    id: 5,
    status: 'published',
    label: 'Published',
    icon: '✔',
    color: '#388e3c',
  },
  { id: 6, status: 'failed', label: 'Failed', icon: '✕', color: '#f44336' },
  { id: 7, status: 'on_hold', label: 'On Hold', icon: '⏸', color: '#9c27b0' },
  { id: 8, status: 'rejected', label: 'Rejected', icon: '✗', color: '#d32f2f' },
  {
    id: 9,
    status: 'cancelled',
    label: 'Cancelled',
    icon: '⊘',
    color: '#757575',
  },
];

const StatusTimeline = ({ currentStatus, statusHistory = [] }) => {
  const [selectedState, setSelectedState] = useState(null);
  const [durations, setDurations] = useState({});

  useEffect(() => {
    // Calculate duration in each state
    const calculateDurations = () => {
      const durationMap = {};

      for (let i = 0; i < statusHistory.length - 1; i++) {
        const current = statusHistory[i];
        const next = statusHistory[i + 1];

        const currentTime = new Date(current.timestamp).getTime();
        const nextTime = new Date(next.timestamp).getTime();
        const durationMs = nextTime - currentTime;

        durationMap[current.new_status] = formatDuration(durationMs);
      }

      setDurations(durationMap);
    };

    calculateDurations();
  }, [statusHistory]);

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

  const getStateInfo = (statusKey) => {
    return STATUS_FLOW.find((s) => s.status === statusKey) || {};
  };

  const hasVisitedState = (statusKey) => {
    return statusHistory.some((h) => h.new_status === statusKey);
  };

  const isCurrentState = (statusKey) => {
    return statusKey === currentStatus;
  };

  return (
    <div className="status-timeline">
      <div className="timeline-header">
        <h4>Status Progression Timeline</h4>
        <span className="current-status-badge">
          {getStateInfo(currentStatus).label}
        </span>
      </div>

      <div className="timeline-container">
        <div className="timeline-track">
          {STATUS_FLOW.map((flow, index) => {
            const visited = hasVisitedState(flow.status);
            const current = isCurrentState(flow.status);
            const stateInfo = getStateInfo(flow.status);
            const duration = durations[flow.status];

            return (
              <React.Fragment key={flow.status}>
                <div
                  className={`timeline-node 
                    ${visited ? 'visited' : ''} 
                    ${current ? 'current' : ''}`}
                  style={{
                    borderColor: stateInfo.color,
                    backgroundColor: stateInfo.color,
                  }}
                  onClick={() => setSelectedState(flow.status)}
                  title={`${stateInfo.label}${duration ? ` - ${duration}` : ''}`}
                >
                  <div className="node-inner">
                    <span className="node-icon">{stateInfo.icon}</span>
                  </div>
                  {current && <div className="pulse" />}
                </div>

                {index < STATUS_FLOW.length - 1 && (
                  <div
                    className={`timeline-connector 
                      ${visited ? 'visited' : ''}`}
                    style={{
                      backgroundColor: visited ? stateInfo.color : '#e0e0e0',
                    }}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>

        <div className="timeline-labels">
          {STATUS_FLOW.map((flow) => {
            const visited = hasVisitedState(flow.status);
            const current = isCurrentState(flow.status);

            return (
              <div
                key={flow.status}
                className={`timeline-label 
                  ${visited ? 'visited' : ''} 
                  ${current ? 'current' : ''}`}
              >
                <div className="label-text">{flow.label}</div>
                {durations[flow.status] && (
                  <div className="label-duration">{durations[flow.status]}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {selectedState && (
        <div className="timeline-details">
          <div className="details-card">
            <div className="details-header">
              <h5>{getStateInfo(selectedState).label}</h5>
              <button
                className="close-btn"
                onClick={() => setSelectedState(null)}
                aria-label="Close details"
              >
                ✕
              </button>
            </div>

            <div className="details-body">
              <div className="detail-item">
                <span className="detail-label">Status Code:</span>
                <span className="detail-value">{selectedState}</span>
              </div>

              <div className="detail-item">
                <span className="detail-label">Visited:</span>
                <span className="detail-value">
                  {hasVisitedState(selectedState) ? 'Yes' : 'No'}
                </span>
              </div>

              <div className="detail-item">
                <span className="detail-label">Current:</span>
                <span className="detail-value">
                  {isCurrentState(selectedState) ? 'Yes' : 'No'}
                </span>
              </div>

              {durations[selectedState] && (
                <div className="detail-item">
                  <span className="detail-label">Duration:</span>
                  <span className="detail-value">
                    {durations[selectedState]}
                  </span>
                </div>
              )}

              {statusHistory.length > 0 && (
                <div className="detail-item">
                  <span className="detail-label">History Entries:</span>
                  <span className="detail-value">{statusHistory.length}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {statusHistory.length === 0 && (
        <div className="timeline-empty">
          <p>No status history available yet</p>
        </div>
      )}
    </div>
  );
};

StatusTimeline.propTypes = {
  currentStatus: PropTypes.string.isRequired,
  statusHistory: PropTypes.arrayOf(
    PropTypes.shape({
      old_status: PropTypes.string,
      new_status: PropTypes.string,
      timestamp: PropTypes.string,
    })
  ),
};

StatusTimeline.defaultProps = {
  statusHistory: [],
};

export default StatusTimeline;
