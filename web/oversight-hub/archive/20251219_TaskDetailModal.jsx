import React, { useState, useEffect } from 'react';
import { apiConfig, getToken } from '../firebaseConfig';
import { formatTimestamp, renderStatus } from '../utils/helpers';
import './Modal.css';

/**
 * Updated October 26, 2025 (Phase 5)
 * MIGRATED: From Firestore real-time subscriptions to PostgreSQL REST API with polling
 *
 * Changes:
 * - Replaced onSnapshot with fetch polling (every 5 seconds)
 * - Replaced updateDoc with REST API PUT
 * - Fetch runs from /api/tasks/{id}/runs endpoint
 * - Fetch logs from /api/tasks/{id}/runs/{runId}/logs endpoint
 * - Added proper cleanup for polling intervals
 */

const TaskDetailModal = ({ task, onClose }) => {
  const [runs, setRuns] = useState([]);
  const [logs, setLogs] = useState({});

  // Fetch runs from API (with polling)
  useEffect(() => {
    if (!task?.id) return;

    const fetchRuns = async () => {
      try {
        const token = getToken();
        const response = await fetch(
          `${apiConfig.baseURL}/tasks/${task.id}/runs`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setRuns(
            Array.isArray(data)
              ? data.sort(
                  (a, b) => new Date(b.startTime) - new Date(a.startTime)
                )
              : []
          );
        }
      } catch (err) {
        console.error('Failed to fetch runs:', err);
      }
    };

    fetchRuns();
    const interval = setInterval(fetchRuns, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, [task?.id]);

  // Fetch logs for latest run (with polling)
  useEffect(() => {
    if (runs.length === 0 || !task?.id) return;

    const latestRunId = runs[0].id;
    const fetchLogs = async () => {
      try {
        const token = getToken();
        const response = await fetch(
          `${apiConfig.baseURL}/tasks/${task.id}/runs/${latestRunId}/logs`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.ok) {
          const data = await response.json();
          setLogs((prev) => ({
            ...prev,
            [latestRunId]: Array.isArray(data) ? data : [],
          }));
        }
      } catch (err) {
        console.error('Failed to fetch logs:', err);
      }
    };

    fetchLogs();
    const interval = setInterval(fetchLogs, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, [runs, task?.id]);

  const handleUpdateStatus = async (newStatus) => {
    if (!task?.id) return;
    try {
      const token = getToken();
      const response = await fetch(`${apiConfig.baseURL}/tasks/${task.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.detail || `Failed to update task (${response.status})`
        );
      }

      onClose();
    } catch (err) {
      console.error('Task update error:', err);
      alert(`Failed to update task: ${err.message}`);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>
        <h2>Task Details: {task.topic}</h2>
        <div className="task-actions">
          <button
            onClick={() => handleUpdateStatus('Cancelled')}
            className="action-btn cancel-btn"
          >
            Cancel Task
          </button>
          <button
            onClick={() => handleUpdateStatus('Ready')}
            className="action-btn rerun-btn"
          >
            Re-run Task
          </button>
        </div>
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
          {task.error && (
            <div className="error-message">Error: {task.error}</div>
          )}
        </div>
        <RunHistory runs={runs} logs={logs} />
      </div>
    </div>
  );
};

const RunHistory = ({ runs, logs }) => (
  <div className="run-history">
    <h3>Run History</h3>
    {runs.length === 0 ? (
      <p>No runs found for this task.</p>
    ) : (
      runs.map((run) => (
        <div key={run.id} className="run-item">
          <h4>
            Run at {formatTimestamp(run.startTime)} - Status: {run.status}
          </h4>
          <LogViewer logs={logs[run.id] || []} />
        </div>
      ))
    )}
  </div>
);

const LogViewer = ({ logs }) => (
  <div className="log-viewer">
    {logs.length === 0 ? (
      <p>No logs for this run.</p>
    ) : (
      <pre>
        {logs.map(
          (log) =>
            `[${formatTimestamp(log.timestamp)}] ${log.level}: ${
              log.message
            }\\n`
        )}
      </pre>
    )}
  </div>
);

export default TaskDetailModal;
