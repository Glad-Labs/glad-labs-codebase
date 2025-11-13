import React, { useState, useEffect } from 'react';
import useStore from '../store/useStore';
import { getTasks } from '../services/cofounderAgentClient';
import CreateTaskModal from '../components/tasks/CreateTaskModal';
import './TaskManagement.css';

function TaskManagement() {
  const { setTasks } = useStore();
  const [tasks, setLocalTasks] = useState([]);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Fetch tasks from API
  useEffect(() => {
    const fetchTasksWrapper = async () => {
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

    fetchTasksWrapper();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchTasksWrapper, 30000);
    return () => clearInterval(interval);
  }, [setTasks]);

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
      let aVal = a[sortBy] || 0;
      let bVal = b[sortBy] || 0;

      if (sortBy === 'created_at') {
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
      }

      if (sortDirection === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };

  const filteredTasks = getFilteredTasks();

  return (
    <div className="task-management-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Task Management</h1>
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
        <button
          className="btn-create-task"
          onClick={() => setShowCreateModal(true)}
        >
          + Create Task
        </button>
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
                <th
                  onClick={() => handleSort('task_name')}
                  className={`sortable ${sortBy === 'task_name' ? 'active-sort' : ''}`}
                >
                  Task Name{' '}
                  {sortBy === 'task_name' &&
                    (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  onClick={() => handleSort('topic')}
                  className={`sortable ${sortBy === 'topic' ? 'active-sort' : ''}`}
                >
                  Topic{' '}
                  {sortBy === 'topic' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  onClick={() => handleSort('status')}
                  className={`sortable ${sortBy === 'status' ? 'active-sort' : ''}`}
                >
                  Status{' '}
                  {sortBy === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  onClick={() => handleSort('category')}
                  className={`sortable ${sortBy === 'category' ? 'active-sort' : ''}`}
                >
                  Category{' '}
                  {sortBy === 'category' &&
                    (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  onClick={() => handleSort('created_at')}
                  className={`sortable ${sortBy === 'created_at' ? 'active-sort' : ''}`}
                >
                  Created{' '}
                  {sortBy === 'created_at' &&
                    (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
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

      {/* Create Task Modal */}
      {showCreateModal && (
        <CreateTaskModal
          isOpen={showCreateModal}
          onClose={() => {
            setShowCreateModal(false);
            fetchTasks();
          }}
        />
      )}
    </div>
  );
}

export default TaskManagement;
