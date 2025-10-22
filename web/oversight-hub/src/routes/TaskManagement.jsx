import React, { useState } from 'react';
import useStore from '../store/useStore';
import './TaskManagement.css';

function TaskManagement() {
  const { tasks } = useStore();
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('dueDate');

  const getFilteredTasks = () => {
    let filtered = tasks || [];
    if (filterStatus !== 'all') {
      filtered = filtered.filter((t) => t.status?.toLowerCase() === filterStatus);
    }
    return filtered.sort((a, b) => {
      if (sortBy === 'dueDate') {
        return new Date(a.dueDate) - new Date(b.dueDate);
      } else if (sortBy === 'priority') {
        const priorityOrder = { High: 0, Medium: 1, Low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return 0;
    });
  };

  const filteredTasks = getFilteredTasks();

  return (
    <div className="task-management-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Task Management</h1>
        <p className="dashboard-subtitle">Organize and track all your tasks</p>
      </div>

      {/* Task Statistics */}
      <div className="task-stats">
        <div className="stat">
          <span className="stat-icon">📋</span>
          <div className="stat-info">
            <span className="stat-number">{tasks?.length || 0}</span>
            <span className="stat-text">Total Tasks</span>
          </div>
        </div>
        <div className="stat">
          <span className="stat-icon">✅</span>
          <div className="stat-info">
            <span className="stat-number">
              {tasks?.filter((t) => t.status === 'Completed').length || 0}
            </span>
            <span className="stat-text">Completed</span>
          </div>
        </div>
        <div className="stat">
          <span className="stat-icon">⏳</span>
          <div className="stat-info">
            <span className="stat-number">
              {tasks?.filter((t) => t.status === 'In Progress').length || 0}
            </span>
            <span className="stat-text">In Progress</span>
          </div>
        </div>
        <div className="stat">
          <span className="stat-icon">⚠️</span>
          <div className="stat-info">
            <span className="stat-number">
              {tasks?.filter((t) => t.priority === 'High').length || 0}
            </span>
            <span className="stat-text">High Priority</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="task-filters">
        <div className="filter-group">
          <label htmlFor="status-filter">Status:</label>
          <select
            id="status-filter"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Tasks</option>
            <option value="pending">Pending</option>
            <option value="in progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="sort-by">Sort by:</label>
          <select
            id="sort-by"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
          </select>
        </div>

        <button className="btn-primary">➕ Create Task</button>
      </div>

      {/* Tasks List */}
      <div className="tasks-list">
        {filteredTasks && filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <div key={task.id} className="task-item">
              <div className="task-checkbox">
                <input type="checkbox" />
              </div>
              <div className="task-content">
                <h3 className="task-title">{task.title}</h3>
                {task.description && (
                  <p className="task-description">{task.description}</p>
                )}
                <div className="task-meta">
                  <span className="task-date">📅 {task.dueDate}</span>
                  <span
                    className={`task-priority priority-${task.priority?.toLowerCase()}`}
                  >
                    {task.priority}
                  </span>
                  <span className={`task-status status-${task.status?.toLowerCase()}`}>
                    {task.status}
                  </span>
                </div>
              </div>
              <div className="task-actions">
                <button className="action-btn" title="Edit">
                  ✏️
                </button>
                <button className="action-btn" title="Delete">
                  🗑️
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <p>No tasks found. Create your first task to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default TaskManagement;
