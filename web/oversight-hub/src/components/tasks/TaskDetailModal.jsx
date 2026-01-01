import React from 'react';
import useStore from '../../store/useStore';
import ErrorDetailPanel from './ErrorDetailPanel';
import ConstraintComplianceDisplay from './ConstraintComplianceDisplay';

const renderStatus = (status) => (
  <span
    className={`status-badge status-${status?.toLowerCase().replace(' ', '-')}`}
  >
    {status || 'Unknown'}
  </span>
);

const ErrorMessage = ({ message }) => (
  <div className="error-message">
    <p>⚠️ {message}</p>
  </div>
);

const TaskDetailModal = ({ onClose }) => {
  const { selectedTask } = useStore();

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
          <p>
            <strong>Style:</strong>{' '}
            {selectedTask.style || selectedTask.metadata?.style || 'N/A'}
          </p>
          <p>
            <strong>Tone:</strong>{' '}
            {selectedTask.tone || selectedTask.metadata?.tone || 'N/A'}
          </p>
          <p>
            <strong>Target Length:</strong>{' '}
            {selectedTask.target_length ||
              selectedTask.metadata?.word_count ||
              'N/A'}{' '}
            words
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
          {selectedTask.constraint_compliance && (
            <div className="mt-4 border-t pt-4">
              <ConstraintComplianceDisplay
                compliance={selectedTask.constraint_compliance}
                phaseBreakdown={selectedTask.task_metadata?.phase_compliance}
              />
            </div>
          )}
          {selectedTask.status === 'failed' && (
            <div className="mt-4">
              <ErrorDetailPanel task={selectedTask} />
            </div>
          )}
          {selectedTask.error && !['failed'].includes(selectedTask.status) && (
            <ErrorMessage message={selectedTask.error} />
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;
