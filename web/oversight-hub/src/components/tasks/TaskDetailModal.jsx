import React from 'react';
import useStore from '../../store/useStore';
import useRuns from '../../hooks/useRuns';

const formatTimestamp = (timestamp) => {
  if (!timestamp) return 'N/A';
  return new Date(timestamp.seconds * 1000).toLocaleString();
};

const renderStatus = (status) => (
  <span
    className={`status-badge status-${status
      ?.toLowerCase()
      .replace(' ', '-')}`}
  >
    {status || 'Unknown'}
  </span>
);

const ErrorMessage = ({ message }) => (
  <div className="error-message">
    <p>⚠️ {message}</p>
  </div>
);

import RunHistory from './RunHistory';

const TaskDetailModal = ({ onClose }) => {
  const { selectedTask } = useStore();
  const { runs, loading } = useRuns(selectedTask?.id);

  if (!selectedTask) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>
        <h2>Task Details: {selectedTask.topic}</h2>
        <div className="task-details">
          <p>
            <strong>Status:</strong> {renderStatus(selectedTask.status)}
          </p>
          <p>
            <strong>ID:</strong> {selectedTask.id}
          </p>
          <p>
            <strong>Category:</strong> {selectedTask.category}
          </p>
          <p>
            <strong>Target Audience:</strong> {selectedTask.target_audience}
          </p>
          {selectedTask.publishedUrl && (
            <p>
              <strong>Published URL:</strong>{' '}
              <a
                href={selectedTask.publishedUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {selectedTask.publishedUrl}
              </a>
            </p>
          )}
          {selectedTask.error && <ErrorMessage message={selectedTask.error} />}
        </div>
        <RunHistory runs={runs} />
      </div>
    </div>
  );
};

export default TaskDetailModal;