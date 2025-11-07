import React, { useState, useEffect } from 'react';
import useStore from '../store/useStore';
import { getTasks } from '../services/cofounderAgentClient';
import './TaskManagement.css';

function TaskManagement() {
  const { setTasks, tasks: storeTasks } = useStore();
  const [tasks, setLocalTasks] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [loading, setLoading] = useState(false);

  // Fetch tasks from API
  useEffect(() => {
    fetchTasks();
    // Auto-refresh every 10 seconds
    const interval = setInterval(fetchTasks, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await getTasks({ limit: 100 });
      if (response && response.tasks) {
        setLocalTasks(response.tasks);
        setTasks(response.tasks);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredTasks = () => {
    // Return ALL tasks regardless of status
    let allTasks = tasks || [];
    return allTasks.sort((a, b) => {
      // Sort by newest first
      return new Date(b.created_at || 0) - new Date(a.created_at || 0);
    });
  };

  const filteredTasks = getFilteredTasks();

  return (
    <div className="task-management-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Task Management</h1>
        <p className="dashboard-subtitle">Organize and track all your tasks</p>
      </div>

      {/* Summary Stats */}
      <div className="summary-stats">
        <div className="stat-box">
          <span className="stat-count">{tasks?.length || 0}</span>
          <span className="stat-label">Total Tasks</span>
        </div>
        <div className="stat-box">
          <span className="stat-count">
            {tasks?.filter((t) => t.status?.toLowerCase() === 'completed')
              .length || 0}
          </span>
          <span className="stat-label">Completed</span>
        </div>
        <div className="stat-box">
          <span className="stat-count">
            {tasks?.filter((t) => t.status?.toLowerCase() === 'running')
              .length || 0}
          </span>
          <span className="stat-label">Running</span>
        </div>
        <div className="stat-box">
          <span className="stat-count">
            {tasks?.filter((t) => t.status?.toLowerCase() === 'failed')
              .length || 0}
          </span>
          <span className="stat-label">Failed</span>
        </div>
      </div>

      {/* Unified Table - All Tasks */}
      <div className="table-controls">
        <button className="btn-refresh" onClick={fetchTasks} disabled={loading}>
          {loading ? '🔄 Refreshing...' : '🔄 Refresh Now'}
        </button>
        <span className="refresh-info">
          {loading ? 'Loading tasks...' : 'Auto-refreshing every 10 seconds'}
        </span>
      </div>

      {/* Unified Tasks Table */}
      <div className="tasks-table-container">
        {loading && <div className="loading">Loading tasks...</div>}
        {!loading && filteredTasks.length === 0 ? (
          <div className="empty-state">
            <p>No tasks found. Create your first blog post to get started!</p>
          </div>
        ) : (
          <table className="tasks-table">
            <thead>
              <tr>
                <th>Task Name</th>
                <th>Topic</th>
                <th>Status</th>
                <th>Category</th>
                <th>Created</th>
                <th>Quality Score</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task) => (
                <tr
                  key={task.id}
                  className={`status-${task.status?.toLowerCase()}`}
                >
                  <td className="task-name">{task.task_name || 'Untitled'}</td>
                  <td className="task-topic">{task.topic || '-'}</td>
                  <td>
                    <span
                      className={`status-badge status-${task.status?.toLowerCase()}`}
                    >
                      {task.status
                        ? task.status.charAt(0).toUpperCase() +
                          task.status.slice(1)
                        : 'Unknown'}
                    </span>
                  </td>
                  <td>{task.category || '-'}</td>
                  <td className="task-date">
                    {task.created_at
                      ? new Date(task.created_at).toLocaleDateString()
                      : '-'}
                  </td>
                  <td>
                    {task.result?.quality_score ? (
                      <span className="quality-score">
                        {task.result.quality_score}/100
                      </span>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td>
                    <button className="action-btn" title="View Details">
                      �️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default TaskManagement;
