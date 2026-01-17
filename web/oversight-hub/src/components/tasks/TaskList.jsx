import React from 'react';
import './TaskList.css';

const formatTimestamp = (timestamp) => {
  if (!timestamp) return 'N/A';
  if (typeof timestamp === 'string') return timestamp.split('T')[0];
  if (timestamp.seconds)
    return new Date(timestamp.seconds * 1000).toLocaleString();
  return 'N/A';
};

/**
 * Get icon character for status badge.
 * Enterprise-level status display with comprehensive icon mapping.
 *
 * DISTINCTIONS:
 * - completed (✓) = single task finished
 * - approved (✓) = human approved, waiting to publish
 * - published (✓✓) = live on CMS
 */
const getStatusIcon = (status) => {
  const statusLower = status?.toLowerCase();
  const iconMap = {
    pending: '⧗', // Hourglass - waiting
    in_progress: '⟳', // Refresh - processing
    running: '⟳', // Refresh - processing (legacy)
    awaiting_approval: '⚠', // Warning - needs review
    approved: '✓', // Check - approved by human
    published: '✓✓', // Double check - live on CMS
    completed: '✓', // Check - task completed
    failed: '✗', // X - error
    on_hold: '⊥', // Pause - paused
    rejected: '✗', // X - rejected
    cancelled: '⊙', // Circle - cancelled
  };
  return iconMap[statusLower] || '○';
};

/**
 * Get CSS class name for status badge styling.
 * Maps status values to enterprise-level CSS classes.
 *
 * STATE HIERARCHY:
 * - Approval Workflow: awaiting_approval → approved → published
 * - Direct Completion: completed (non-approval tasks)
 * - Error: failed
 * - Management: rejected, cancelled, on_hold
 */
const getStatusColor = (status) => {
  const statusLower = status?.toLowerCase();
  const statusMap = {
    // Main workflow statuses
    pending: 'status-pending',
    in_progress: 'status-in-progress',
    running: 'status-in-progress', // Map legacy to new
    awaiting_approval: 'status-awaiting-approval',

    // Approval workflow: human decision → published (live)
    approved: 'status-approved',
    published: 'status-published',

    // Task completion (non-approval workflow)
    completed: 'status-completed', // Task finished without approval

    // Error and management statuses
    failed: 'status-failed',
    on_hold: 'status-on-hold',
    rejected: 'status-rejected',
    cancelled: 'status-cancelled',
  };
  return statusMap[statusLower] || 'status-default';
};

const TaskList = ({
  tasks,
  onTaskClick,
  page = 1,
  totalPages = 1,
  total = 0,
  limit = 10,
  onPageChange = () => {},
}) => {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="task-list-empty">
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>∅</div>
        <div>No tasks yet. Create one to begin.</div>
      </div>
    );
  }

  const startIndex = (page - 1) * limit + 1;
  const endIndex = Math.min(page * limit, total);

  return (
    <div className="task-list-container">
      <div className="task-list-grid">
        {tasks.map((task) => (
          <div
            key={task.id || task.task_id}
            className="task-card"
            onClick={() => onTaskClick(task)}
          >
            {/* Status Badge */}
            <div className={`status-badge ${getStatusColor(task.status)}`}>
              <span className="status-icon">{getStatusIcon(task.status)}</span>
              <span className="status-text">{task.status?.toUpperCase()}</span>
            </div>

            {/* Task Title */}
            <h3 className="task-title">
              {task.task_name || task.topic || 'Untitled Task'}
            </h3>

            {/* Task Info Grid */}
            <div className="task-info">
              {task.topic && (
                <div className="info-item">
                  <span className="label">Topic</span>
                  <span className="value">
                    {task.topic.substring(0, 50)}...
                  </span>
                </div>
              )}

              {task.primary_keyword && (
                <div className="info-item">
                  <span className="label">Keyword</span>
                  <span className="value">{task.primary_keyword}</span>
                </div>
              )}

              {task.category && (
                <div className="info-item">
                  <span className="label">Category</span>
                  <span className="value">{task.category}</span>
                </div>
              )}

              {task.created_at && (
                <div className="info-item">
                  <span className="label">Created</span>
                  <span className="value">
                    {formatTimestamp(task.created_at)}
                  </span>
                </div>
              )}
            </div>

            {/* Progress Bar */}
            {task.status === 'running' && (
              <div className="progress-bar">
                <div className="progress-fill" />
              </div>
            )}

            {/* Click Hint */}
            <div className="task-hint">Click for details →</div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pagination-container">
          <div className="pagination-info">
            Showing {startIndex}-{endIndex} of {total} tasks
          </div>

          <div className="pagination-controls">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page === 1}
              className="pagination-btn"
              title="Previous page"
            >
              ← Previous
            </button>

            <div className="pagination-pages">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
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
                    onClick={() => onPageChange(pageNum)}
                    className={`page-btn ${page === pageNum ? 'active' : ''}`}
                    title={`Go to page ${pageNum}`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              {totalPages > 5 && page < totalPages - 2 && (
                <span className="pagination-dots">...</span>
              )}
            </div>

            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page === totalPages}
              className="pagination-btn"
              title="Next page"
            >
              Next →
            </button>
          </div>

          <div className="pagination-page-info">
            Page {page} of {totalPages}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;
