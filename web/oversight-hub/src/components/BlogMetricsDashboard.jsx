import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TaskPreviewModal from './TaskPreviewModal';
import './BlogMetricsDashboard.css';

const BlogMetricsDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [metrics, setMetrics] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    completed: 0,
    failed: 0,
    totalWords: 0,
    averageTime: 0,
  });
  const [selectedTask, setSelectedTask] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch tasks and calculate metrics
  useEffect(() => {
    const loadTasks = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:8000/api/tasks', {
          timeout: 5000,
        });

        const allTasks = Array.isArray(response.data)
          ? response.data
          : response.data.tasks || [];
        setTasks(allTasks);
        calculateMetrics(allTasks);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch tasks:', err);
        setError('Failed to fetch task data');
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
    const interval = setInterval(loadTasks, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const calculateMetrics = (taskList) => {
    const stats = {
      total: taskList.length,
      pending: 0,
      processing: 0,
      completed: 0,
      failed: 0,
      totalWords: 0,
      completedTasks: 0,
      totalTime: 0,
    };

    taskList.forEach((task) => {
      const status = task.status?.toLowerCase() || 'pending';

      if (status === 'pending') stats.pending++;
      else if (status === 'processing' || status === 'in_progress')
        stats.processing++;
      else if (status === 'completed') {
        stats.completed++;
        stats.completedTasks++;
        // Extract word count from result if available
        if (task.result?.content) {
          stats.totalWords += task.result.content.split(/\s+/).length || 0;
        }
        // Calculate time taken
        if (task.created_at && task.updated_at) {
          const created = new Date(task.created_at);
          const updated = new Date(task.updated_at);
          stats.totalTime += (updated - created) / 1000; // Convert to seconds
        }
      } else if (status === 'failed' || status === 'error') stats.failed++;
    });

    stats.averageTime =
      stats.completedTasks > 0
        ? Math.round(stats.totalTime / stats.completedTasks)
        : 0;

    setMetrics(stats);
  };

  const getStatusColor = (status) => {
    const lower = status?.toLowerCase() || 'pending';
    switch (lower) {
      case 'completed':
        return '#4caf50';
      case 'processing':
      case 'in_progress':
        return '#2196f3';
      case 'pending':
        return '#ff9800';
      case 'failed':
      case 'error':
        return '#f44336';
      default:
        return '#9e9e9e';
    }
  };

  const formatStatus = (status) => {
    return (
      (status || 'pending').charAt(0).toUpperCase() +
      (status || 'pending').slice(1)
    );
  };

  const formatTime = (seconds) => {
    if (seconds < 60) return `${Math.round(seconds)}s`;
    if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
    return `${Math.round(seconds / 3600)}h`;
  };

  return (
    <div className="blog-metrics-dashboard">
      <h2>Blog Generation Metrics</h2>

      {error && <div className="error-banner">{error}</div>}

      {/* Metrics Summary */}
      <div className="metrics-summary">
        <div className="metric-card total">
          <div className="metric-value">{metrics.total}</div>
          <div className="metric-label">Total Tasks</div>
        </div>
        <div className="metric-card processing">
          <div className="metric-value">{metrics.processing}</div>
          <div className="metric-label">Processing</div>
        </div>
        <div className="metric-card pending">
          <div className="metric-value">{metrics.pending}</div>
          <div className="metric-label">Pending</div>
        </div>
        <div className="metric-card completed">
          <div className="metric-value">{metrics.completed}</div>
          <div className="metric-label">Completed</div>
        </div>
        <div className="metric-card failed">
          <div className="metric-value">{metrics.failed}</div>
          <div className="metric-label">Failed</div>
        </div>
        <div className="metric-card average">
          <div className="metric-value">{formatTime(metrics.averageTime)}</div>
          <div className="metric-label">Avg Time</div>
        </div>
        <div className="metric-card words">
          <div className="metric-value">{metrics.totalWords}</div>
          <div className="metric-label">Total Words</div>
        </div>
      </div>

      {/* Create New Blog Post Button */}
      <div className="create-task-section">
        <button
          className="create-blog-btn"
          onClick={() => (window.location.href = '#/blog-creator')}
        >
          ➕ Create New Blog Post
        </button>
      </div>

      {/* Tasks Table */}
      <div className="tasks-table-section">
        <h3>Active Tasks</h3>
        {loading && <div className="loading">Loading tasks...</div>}
        {!loading && tasks.length === 0 && (
          <div className="empty-state">
            No blog tasks yet. Click "Create New Blog Post" to get started!
          </div>
        )}
        {!loading && tasks.length > 0 && (
          <table className="tasks-table">
            <thead>
              <tr>
                <th>Topic</th>
                <th>Status</th>
                <th>Progress</th>
                <th>Style</th>
                <th>Created</th>
                <th>Words</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr
                  key={task.id}
                  className={`task-row status-${task.status?.toLowerCase()}`}
                >
                  <td className="topic">{task.topic || 'Untitled'}</td>
                  <td>
                    <span
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(task.status) }}
                    >
                      {formatStatus(task.status)}
                    </span>
                  </td>
                  <td>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${task.progress || 0}%` }}
                      >
                        {task.progress ? `${task.progress}%` : ''}
                      </div>
                    </div>
                  </td>
                  <td>{task.style || 'technical'}</td>
                  <td className="timestamp">
                    {new Date(task.created_at).toLocaleString()}
                  </td>
                  <td className="word-count">
                    {task.result?.content
                      ? task.result.content.split(/\s+/).length
                      : '—'}
                  </td>
                  <td className="actions">
                    <button
                      className="preview-btn"
                      onClick={() => {
                        setSelectedTask(task);
                        setShowPreview(true);
                      }}
                      title="Preview content"
                    >
                      👁️ View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Task Preview Modal */}
      {showPreview && selectedTask && (
        <TaskPreviewModal
          task={selectedTask}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
};

export default BlogMetricsDashboard;
