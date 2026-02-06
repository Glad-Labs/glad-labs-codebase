/**
 * ExecutionMonitor.jsx
 *
 * Real-time display of orchestrator execution progress
 * Shows:
 * - Current phase (planning, execution, evaluation, refinement)
 * - Progress percentage
 * - Task status
 * - Original request
 * - Live updates
 */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

function ExecutionMonitor({ taskId, phase, progress, status, request }) {
  const [phaseHistory, setPhaseHistory] = useState([]);

  // Track phase changes
  useEffect(() => {
    if (phase && !phaseHistory.includes(phase)) {
      setPhaseHistory((prev) => [...prev, phase]);
    }
  }, [phase, phaseHistory]);

  const phases = [
    { id: 'planning', name: 'Planning', icon: '📋' },
    { id: 'execution', name: 'Execution', icon: '⚙️' },
    { id: 'evaluation', name: 'Evaluation', icon: '🔍' },
    { id: 'refinement', name: 'Refinement', icon: '✨' },
  ];

  const getPhaseStatus = (phaseId) => {
    const phaseIndex = phases.findIndex((p) => p.id === phaseId);
    const currentIndex = phases.findIndex((p) => p.id === phase);

    if (phaseIndex < currentIndex) return 'completed';
    if (phaseIndex === currentIndex) return 'active';
    return 'pending';
  };

  const statusIcons = {
    processing: '⏳',
    pending_approval: '⏸️',
    approved: '✅',
    publishing: '📤',
    completed: '🎉',
    failed: '❌',
  };

  return (
    <div className="execution-monitor">
      {/* Status Header */}
      <div className="monitor-header">
        <div className="status-badge">
          <span className="status-icon">{statusIcons[status] || '⏳'}</span>
          <span className="status-text">
            {status.replace('_', ' ').toUpperCase()}
          </span>
        </div>
        <div className="task-id">Task ID: {taskId}</div>
      </div>

      {/* Request Summary */}
      <div className="request-summary">
        <h3>📌 Request</h3>
        <p className="request-text">{request}</p>
      </div>

      {/* Progress Bar */}
      <div className="progress-section">
        <div className="progress-label">
          <span>Overall Progress</span>
          <span className="progress-percent">{Math.round(progress)}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Phase Timeline */}
      <div className="phases-timeline">
        <h3>📊 Execution Phases</h3>
        <div className="phases-list">
          {phases.map((p) => {
            const phaseStatus = getPhaseStatus(p.id);
            return (
              <div key={p.id} className={`phase-item phase-${phaseStatus}`}>
                <div className="phase-indicator">
                  <span className="phase-icon">{p.icon}</span>
                </div>
                <div className="phase-info">
                  <h4 className="phase-name">{p.name}</h4>
                  <p className="phase-status">
                    {phaseStatus === 'completed' && '✓ Completed'}
                    {phaseStatus === 'active' && '→ In Progress'}
                    {phaseStatus === 'pending' && '○ Waiting'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Execution Details */}
      <div className="execution-details">
        <h3>⚙️ Execution Details</h3>
        <div className="details-grid">
          <div className="detail-item">
            <span className="detail-label">Current Phase:</span>
            <span className="detail-value">{phase || 'Initializing'}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Status:</span>
            <span className="detail-value">{status.replace('_', ' ')}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Progress:</span>
            <span className="detail-value">{Math.round(progress)}%</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Started:</span>
            <span className="detail-value">
              {new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>

      {/* Live Log */}
      <div className="live-log">
        <h3>📜 Live Log</h3>
        <div className="log-entries">
          <div className="log-entry">
            <span className="log-time">{new Date().toLocaleTimeString()}</span>
            <span className="log-text">Task started - {taskId}</span>
          </div>
          <div className="log-entry">
            <span className="log-time">{new Date().toLocaleTimeString()}</span>
            <span className="log-text">Currently executing phase: {phase}</span>
          </div>
          <div className="log-entry">
            <span className="log-time">{new Date().toLocaleTimeString()}</span>
            <span className="log-text">
              Progress: {Math.round(progress)}% complete
            </span>
          </div>
          {status === 'pending_approval' && (
            <div className="log-entry">
              <span className="log-time">
                {new Date().toLocaleTimeString()}
              </span>
              <span className="log-text">Waiting for approval...</span>
            </div>
          )}
        </div>
      </div>

      {/* Status Message */}
      <div className="status-message">
        {status === 'processing' && (
          <p>
            🔄 The AI orchestrator is working on your request. This typically
            takes 2-10 minutes.
          </p>
        )}
        {status === 'pending_approval' && (
          <p>
            ✋ Execution complete! Review the results and approve before
            publishing.
          </p>
        )}
        {status === 'publishing' && (
          <p>📤 Publishing results to live systems...</p>
        )}
        {status === 'completed' && <p>✅ Task completed successfully!</p>}
        {status === 'failed' && (
          <p>❌ Task failed. Please check the error details and try again.</p>
        )}
      </div>
    </div>
  );
}

ExecutionMonitor.propTypes = {
  taskId: PropTypes.string.isRequired,
  phase: PropTypes.oneOf(['planning', 'execution', 'evaluation', 'refinement']),
  progress: PropTypes.number,
  status: PropTypes.oneOf([
    'processing',
    'pending_approval',
    'approved',
    'publishing',
    'completed',
    'failed',
  ]),
  request: PropTypes.string,
};

ExecutionMonitor.defaultProps = {
  phase: 'planning',
  progress: 0,
  status: 'processing',
  request: '',
};

export default ExecutionMonitor;
