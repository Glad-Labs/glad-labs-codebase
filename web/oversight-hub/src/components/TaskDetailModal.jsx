import React from 'react';
import { formatTimestamp, renderStatus } from '../utils/helpers';
import './Modal.css';

const TaskDetailModal = ({ task, runs, onClose }) => (
  <div className="modal-backdrop" onClick={onClose}>
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <button className="close-btn" onClick={onClose}>
        &times;
      </button>
      <h2>Task Details: {task.topic}</h2>
      <div className="task-details">
        <p>
          <strong>Status:</strong> {renderStatus(task.status)}
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
        {task.error && <div className="error-message">Error: {task.error}</div>}
      </div>
      <RunHistory runs={runs} />
    </div>
  </div>
);

const RunHistory = ({ runs }) => (
  <div className="run-history">
    <h3>Run History</h3>
    {runs.length === 0 ? (
      <p>No runs found for this task.</p>
    ) : (
      <ul>
        {runs.map((run) => (
          <li key={run.id}>
            <strong>{formatTimestamp(run.startTime)}:</strong> {run.status}
            {run.error && <p className="run-error">Error: {run.error}</p>}
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default TaskDetailModal;
