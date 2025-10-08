import React from 'react';
import StatusBadge from '../common/StatusBadge';
import ErrorMessage from '../common/ErrorMessage';
import RunHistory from './RunHistory';
import { useRuns } from '../../features/tasks/useRuns';

const TaskDetailModal = ({ task, onClose }) => {
  const { runs, loading } = useRuns(task?.id);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>
        <h2>Task Details: {task.topic}</h2>
        <div className="task-details">
          <p>
            <strong>Status:</strong> <StatusBadge status={task.status} />
          </p>
          <p>
            <strong>ID:</strong> {task.id}
          </p>
          <p>
            <strong>Category:</strong> {task.category}
          </p>
          <p>
            <strong>Target Audience:</strong> {task.target_audience}
          </p>
          {task.publishedUrl && (
            <p>
              <strong>Published URL:</strong>{' '}
              <a
                href={task.publishedUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {task.publishedUrl}
              </a>
            </p>
          )}
          {task.error && <ErrorMessage message={task.error} />}
        </div>
        {loading ? <p>Loading run history...</p> : <RunHistory runs={runs} />}
      </div>
    </div>
  );
};

export default TaskDetailModal;
