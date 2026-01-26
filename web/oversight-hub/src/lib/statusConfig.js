/**
 * Status Configuration - Centralized status definitions
 *
 * Single source of truth for status colors, labels, icons, and styling.
 * Used by: TaskTable, StatusDashboardMetrics, TaskDetailModal, TaskFilters, etc.
 *
 * Prevents duplication and ensures consistent UI across all components.
 */

export const STATUS_CONFIG = {
  pending: {
    color: 'warning',
    label: 'Pending',
    description: 'Task created, waiting to be processed',
    icon: '⏳',
    backgroundColor: '#fef3c7',
    borderColor: '#fcd34d',
    textColor: '#78350f',
  },
  in_progress: {
    color: 'info',
    label: 'In Progress',
    description: 'Content generation pipeline running',
    icon: '🔄',
    backgroundColor: '#dbeafe',
    borderColor: '#93c5fd',
    textColor: '#1e40af',
  },
  awaiting_approval: {
    color: 'warning',
    label: 'Awaiting Approval',
    description: 'Content generated, needs human review & approval',
    icon: '👁️',
    backgroundColor: '#fef3c7',
    borderColor: '#fcd34d',
    textColor: '#78350f',
  },
  approved: {
    color: 'success',
    label: 'Approved',
    description: 'Content approved, ready to publish',
    icon: '✅',
    backgroundColor: '#dcfce7',
    borderColor: '#86efac',
    textColor: '#15803d',
  },
  published: {
    color: 'success',
    label: 'Published',
    description: 'Content published and live',
    icon: '📤',
    backgroundColor: '#dcfce7',
    borderColor: '#86efac',
    textColor: '#15803d',
  },
  failed: {
    color: 'error',
    label: 'Failed (Review Needed)',
    description: 'Generation pipeline error - content preserved for review',
    icon: '⚠️',
    backgroundColor: '#fee2e2',
    borderColor: '#fca5a5',
    textColor: '#7f1d1d',
  },
  rejected: {
    color: 'error',
    label: 'Rejected',
    description: 'Task rejected during review',
    icon: '❌',
    backgroundColor: '#fee2e2',
    borderColor: '#fca5a5',
    textColor: '#7f1d1d',
  },
  on_hold: {
    color: 'warning',
    label: 'On Hold',
    description: 'Task paused pending review',
    icon: '⏸️',
    backgroundColor: '#fef3c7',
    borderColor: '#fcd34d',
    textColor: '#78350f',
  },
  cancelled: {
    color: 'default',
    label: 'Cancelled',
    description: 'Task cancelled by user',
    icon: '⛔',
    backgroundColor: '#f3f4f6',
    borderColor: '#d1d5db',
    textColor: '#374151',
  },
  completed: {
    color: 'success',
    label: 'Completed',
    description: 'Task completed successfully',
    icon: '✓',
    backgroundColor: '#dcfce7',
    borderColor: '#86efac',
    textColor: '#15803d',
  },
};

/**
 * Get status configuration by status key
 * @param {string} status - Status key (e.g., 'pending', 'approved', 'published')
 * @returns {object} Status configuration object
 */
export const getStatusConfig = (status) => {
  return STATUS_CONFIG[status] || STATUS_CONFIG.pending;
};

/**
 * Get Material-UI color variant for status chip
 * @param {string} status - Status key
 * @returns {string} Color variant ('success', 'error', 'warning', 'info', 'default')
 */
export const getStatusColor = (status) => {
  return getStatusConfig(status).color;
};

/**
 * Get human-readable label for status
 * @param {string} status - Status key
 * @returns {string} Display label
 */
export const getStatusLabel = (status) => {
  return getStatusConfig(status).label;
};

/**
 * Get icon for status
 * @param {string} status - Status key
 * @returns {string} Icon emoji/unicode
 */
export const getStatusIcon = (status) => {
  return getStatusConfig(status).icon;
};

/**
 * Get background color for status box
 * @param {string} status - Status key
 * @returns {string} CSS color value
 */
export const getStatusBackgroundColor = (status) => {
  return getStatusConfig(status).backgroundColor;
};

/**
 * Get border color for status box
 * @param {string} status - Status key
 * @returns {string} CSS color value
 */
export const getStatusBorderColor = (status) => {
  return getStatusConfig(status).borderColor;
};

/**
 * Get all statuses
 * @returns {array} Array of status keys
 */
export const getAllStatuses = () => {
  return Object.keys(STATUS_CONFIG);
};

/**
 * Get statuses by category
 * @param {string} category - Category ('pending', 'active', 'complete', 'error')
 * @returns {array} Array of status keys in category
 */
export const getStatusesByCategory = (category) => {
  const categories = {
    pending: ['pending', 'on_hold'],
    active: ['in_progress', 'awaiting_approval', 'approved'],
    complete: ['published', 'completed'],
    error: ['failed', 'rejected', 'cancelled'],
  };
  return categories[category] || [];
};
