import React from 'react';
import './TaskList.css';

const formatTimestamp = (timestamp) => {
  if (!timestamp) return 'N/A';
  if (typeof timestamp === 'string') return timestamp.split('T')[0];
  if (timestamp.seconds)
    return new Date(timestamp.seconds * 1000).toLocaleString();
  return 'N/A';
};

const getStatusIcon = (status) => {
  switch (status?.toLowerCase()) {
    case 'completed':
      return '✓';
    case 'pending':
      return '⧗';
    case 'running':
      return '⟳';
    case 'failed':
      return '✗';
    default:
      return '○';
  }
};

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'completed':
      return 'status-completed';
    case 'pending':
      return 'status-pending';
    case 'running':
      return 'status-running';
    case 'failed':
      return 'status-failed';
    default:
      return 'status-default';
  }
};

const TaskList = ({ tasks, onTaskClick }) => {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="task-list-empty">
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>∅</div>
        <div>No tasks yet. Create one to begin.</div>
      </div>
    );
  }

  return (
    <div className="task-list-container">
      <div className="task-list-grid">
        {tasks.map((task) => (
          <div
            key={task.id || task.task_id}
            className="task-card"
            onClick={() => onTaskClick(task)}
          >
            {/* Status Badge */}
            <div className={`status-badge ${getStatusColor(task.status)}`}>
              <span className="status-icon">{getStatusIcon(task.status)}</span>
              <span className="status-text">{task.status?.toUpperCase()}</span>
            </div>

            {/* Task Title */}
            <h3 className="task-title">
              {task.task_name || task.topic || 'Untitled Task'}
            </h3>

            {/* Task Info Grid */}
            <div className="task-info">
              {task.topic && (
                <div className="info-item">
                  <span className="label">Topic</span>
                  <span className="value">
                    {task.topic.substring(0, 50)}...
                  </span>
                </div>
              )}

              {task.primary_keyword && (
                <div className="info-item">
                  <span className="label">Keyword</span>
                  <span className="value">{task.primary_keyword}</span>
                </div>
              )}

              {task.category && (
                <div className="info-item">
                  <span className="label">Category</span>
                  <span className="value">{task.category}</span>
                </div>
              )}

              {task.created_at && (
                <div className="info-item">
                  <span className="label">Created</span>
                  <span className="value">
                    {formatTimestamp(task.created_at)}
                  </span>
                </div>
              )}
            </div>

            {/* Progress Bar */}
            {task.status === 'running' && (
              <div className="progress-bar">
                <div className="progress-fill" />
              </div>
            )}

            {/* Click Hint */}
            <div className="task-hint">Click for details →</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskList;
