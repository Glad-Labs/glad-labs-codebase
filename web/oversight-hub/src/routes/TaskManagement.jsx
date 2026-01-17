import React, { useState, useEffect } from 'react';
import useStore from '../store/useStore';
import { getTasks } from '../services/cofounderAgentClient';
import CreateTaskModal from '../components/tasks/CreateTaskModal';
import { StatusDashboardMetrics } from '../components/tasks/StatusComponents';
import './TaskManagement.css';

function TaskManagement() {
  const { setTasks } = useStore();
  const [localTasks, setLocalTasks] = useState([]);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);

  // Fetch tasks from API
  useEffect(() => {
    const fetchTasksWrapper = async () => {
      try {
        setLoading(true);
        console.log('🔵 TaskManagement: Fetching tasks from API...');
        const offset = (page - 1) * limit;
        const response = await getTasks(limit, offset);
        console.log('🟢 TaskManagement: API Response received:', response);
        console.log('🟢 TaskManagement: Response type:', typeof response);
        console.log('🟢 TaskManagement: Response.tasks:', response?.tasks);
        console.log(
          '🟢 TaskManagement: Array.isArray(response.tasks):',
          Array.isArray(response?.tasks)
        );

        if (response && response.tasks && Array.isArray(response.tasks)) {
          console.log(
            '✅ TaskManagement: Setting tasks to state:',
            response.tasks.length,
            'tasks'
          );
          setLocalTasks(response.tasks);
          // Extract total from response or calculate it
          if (response.total) {
            setTotal(response.total);
          } else {
            // Fallback: if we got results, assume this is the total (for legacy APIs)
            setTotal(response.tasks.length);
          }
          setTasks(response.tasks);
        } else {
          console.warn('❌ Unexpected response format:', response);
          console.warn('❌ response:', response);
          console.warn('❌ response.tasks:', response?.tasks);
          console.warn(
            '❌ Array.isArray(response.tasks):',
            Array.isArray(response?.tasks)
          );
          setLocalTasks([]);
          setTotal(0);
        }
      } catch (error) {
        console.error('❌ Error fetching tasks:', error);
        console.error('❌ Error message:', error?.message);
        console.error('❌ Error stack:', error?.stack);
        setLocalTasks([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    fetchTasksWrapper();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchTasksWrapper, 30000);
    return () => clearInterval(interval);
  }, [setTasks, page, limit]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const offset = (page - 1) * limit;
      const response = await getTasks(limit, offset);
      if (response && response.tasks) {
        setLocalTasks(response.tasks);
        if (response.total) {
          setTotal(response.total);
        } else {
          setTotal(response.tasks.length);
        }
        setTasks(response.tasks);
      } else {
        console.warn('Unexpected response format:', response);
        setLocalTasks([]);
        setTotal(0);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setLocalTasks([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredTasks = () => {
    // Return ALL tasks regardless of status, use local state
    let allTasks = localTasks || [];
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
          <span className="stat-count">{filteredTasks?.length || 0}</span>
          <span className="stat-label">Total Tasks</span>
        </div>
        <div className="stat-box">
          <span className="stat-count">
            {filteredTasks?.filter(
              (t) => t.status?.toLowerCase() === 'completed'
            ).length || 0}
          </span>
          <span className="stat-label">Completed</span>
        </div>
        <div className="stat-box">
          <span className="stat-count">
            {filteredTasks?.filter((t) => t.status?.toLowerCase() === 'running')
              .length || 0}
          </span>
          <span className="stat-label">Running</span>
        </div>
        <div className="stat-box">
          <span className="stat-count">
            {filteredTasks?.filter((t) => t.status?.toLowerCase() === 'failed')
              .length || 0}
          </span>
          <span className="stat-label">Failed</span>
        </div>
      </div>

      {/* Metrics Dashboard */}
      <div className="metrics-section" style={{ marginBottom: '30px' }}>
        <StatusDashboardMetrics
          statusHistory={filteredTasks.flatMap((t) => t.statusHistory || [])}
          compact={true}
        />
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
          <>
            <table className="tasks-table">
              <thead>
                <tr>
                  <th
                    onClick={() => handleSort('task_name')}
                    className={`sortable ${sortBy === 'task_name' ? 'active-sort' : ''}`}
                  >
                    Task{' '}
                    {sortBy === 'task_name' &&
                      (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    onClick={() => handleSort('topic')}
                    className={`sortable ${sortBy === 'topic' ? 'active-sort' : ''}`}
                  >
                    Agent{' '}
                    {sortBy === 'topic' &&
                      (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    onClick={() => handleSort('status')}
                    className={`sortable ${sortBy === 'status' ? 'active-sort' : ''}`}
                  >
                    Status{' '}
                    {sortBy === 'status' &&
                      (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th>Priority</th>
                  <th
                    onClick={() => handleSort('created_at')}
                    className={`sortable ${sortBy === 'created_at' ? 'active-sort' : ''}`}
                  >
                    Created{' '}
                    {sortBy === 'created_at' &&
                      (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map((task) => (
                  <tr
                    key={task.id}
                    className={`status-${task.status?.toLowerCase()}`}
                  >
                    <td className="task-name">
                      {task.task_name || task.topic || 'Untitled'}
                    </td>
                    <td className="agent">
                      <span className="agent-badge">
                        {task.agent_id
                          ? task.agent_id
                              .replace(/-/g, ' ')
                              .split(' ')
                              .map(
                                (word) =>
                                  word.charAt(0).toUpperCase() + word.slice(1)
                              )
                              .join(' ')
                          : 'Content Generator'}
                      </span>
                    </td>
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
                    <td className="priority">
                      <span className="priority-badge priority-normal">
                        Normal
                      </span>
                    </td>
                    <td className="task-date">
                      {task.created_at
                        ? new Date(task.created_at).toLocaleDateString(
                            'en-US',
                            {
                              month: '2-digit',
                              day: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            }
                          )
                        : '-'}
                    </td>
                    <td>
                      <button className="action-btn" title="View Details">
                        ✏️
                      </button>
                      <button className="action-btn delete" title="Delete">
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination Controls */}
            {total > limit && (
              <div className="pagination-container">
                <div className="pagination-info">
                  Showing {Math.min((page - 1) * limit + 1, total)}-
                  {Math.min(page * limit, total)} of {total} tasks
                </div>

                <div className="pagination-controls">
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    className="pagination-btn"
                    title="Previous page"
                  >
                    ← Previous
                  </button>

                  <div className="pagination-pages">
                    {Array.from(
                      { length: Math.min(Math.ceil(total / limit), 5) },
                      (_, i) => {
                        const totalPages = Math.ceil(total / limit);
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (page <= 3) {
                          pageNum = i + 1;
                        } else if (page > totalPages - 3) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = page - 2 + i;
                        }

                        return (
                          <button
                            key={pageNum}
                            onClick={() => setPage(pageNum)}
                            className={`page-btn ${
                              page === pageNum ? 'active' : ''
                            }`}
                            title={`Go to page ${pageNum}`}
                          >
                            {pageNum}
                          </button>
                        );
                      }
                    )}
                    {Math.ceil(total / limit) > 5 &&
                      page < Math.ceil(total / limit) - 2 && (
                        <span className="pagination-dots">...</span>
                      )}
                  </div>

                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={page === Math.ceil(total / limit)}
                    className="pagination-btn"
                    title="Next page"
                  >
                    Next →
                  </button>
                </div>

                <div className="pagination-page-info">
                  Page {page} of {Math.ceil(total / limit)}
                </div>
              </div>
            )}
          </>
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
          onTaskCreated={() => {
            setShowCreateModal(false);
            fetchTasks();
          }}
        />
      )}
    </div>
  );
}

export default TaskManagement;
