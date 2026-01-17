/**
 * Unified Status Service
 *
 * Single point of entry for all status operations across the application.
 * Abstracts approval workflow, validates transitions, handles errors,
 * and maintains backward compatibility with legacy status system.
 *
 * Usage:
 *   await unifiedStatusService.approve(taskId, feedback);
 *   await unifiedStatusService.reject(taskId, reason);
 *   const history = await unifiedStatusService.getHistory(taskId);
 */

import { cofounderAgentClient } from './cofounderAgentClient';
import {
  STATUS_ENUM,
  STATUS_MAP_NEW_TO_LEGACY,
} from '../Constants/statusEnums';

/**
 * Get current user ID from localStorage or auth context
 */
const getCurrentUserId = () => {
  try {
    const user = localStorage.getItem('currentUser');
    if (user) {
      const parsed = JSON.parse(user);
      return parsed.id || parsed.email || 'anonymous';
    }
  } catch (e) {
    console.warn('Could not parse current user:', e);
  }
  return 'anonymous';
};

/**
 * Unified Status Service
 */
export const unifiedStatusService = {
  /**
   * Update task status with backend validation
   * @param {string} taskId - Task ID to update
   * @param {string} newStatus - New status value
   * @param {Object} options - Additional options
   * @param {string} options.reason - Reason for status change
   * @param {string} options.feedback - Feedback/notes for the change
   * @param {string} options.userId - User making the change (auto-fetched if not provided)
   * @param {Object} options.metadata - Additional metadata
   * @returns {Promise<Object>} - Result with status, history, and validation details
   * @throws {Error} - On validation failure or API error
   */
  async updateStatus(taskId, newStatus, options = {}) {
    const {
      reason = '',
      feedback = '',
      userId = null,
      metadata = {},
    } = options;

    try {
      const payload = {
        new_status: newStatus,
        reason,
        feedback,
        user_id: userId || getCurrentUserId(),
        metadata: {
          ...metadata,
          timestamp: new Date().toISOString(),
          updated_from_ui: true,
        },
      };

      // Try new endpoint first (Phase 5+)
      try {
        const response = await cofounderAgentClient.makeRequest(
          `/api/tasks/${taskId}/status/validated`,
          'PUT',
          payload
        );
        return response;
      } catch (newError) {
        // Fall back to legacy endpoint if new endpoint not available
        if (newError.status === 404) {
          console.warn(
            'New status endpoint not found, falling back to legacy endpoint'
          );
          return await this._updateStatusLegacy(taskId, newStatus, payload);
        }
        throw newError;
      }
    } catch (error) {
      console.error('Status update error:', error);
      throw new Error(
        error.message || 'Failed to update task status. Please try again.'
      );
    }
  },

  /**
   * Legacy endpoint fallback (for existing /orchestrator/executions endpoint)
   * @private
   */
  async _updateStatusLegacy(taskId, newStatus, payload) {
    // Map new status to legacy format if needed
    const legacyStatus = STATUS_MAP_NEW_TO_LEGACY[newStatus] || newStatus;

    try {
      const response = await cofounderAgentClient.makeRequest(
        `/api/orchestrator/executions/${taskId}/approve`,
        'POST',
        {
          status: legacyStatus,
          feedback: payload.feedback,
          metadata: payload.metadata,
        }
      );
      return response;
    } catch (error) {
      throw new Error('Legacy endpoint call failed: ' + error.message);
    }
  },

  /**
   * Approve a task
   * @param {string} taskId - Task ID to approve
   * @param {string} feedback - Optional approval feedback/notes
   * @param {string} userId - Optional user ID (auto-fetched if not provided)
   * @returns {Promise<Object>} - Result object
   */
  async approve(taskId, feedback = '', userId = null) {
    if (!taskId) {
      throw new Error('Task ID is required');
    }

    return this.updateStatus(taskId, STATUS_ENUM.APPROVED, {
      reason: 'Task approved',
      feedback,
      userId,
      metadata: {
        action: 'approve',
        approval_feedback: feedback,
      },
    });
  },

  /**
   * Reject a task
   * @param {string} taskId - Task ID to reject
   * @param {string} reason - Reason for rejection (required)
   * @param {string} userId - Optional user ID (auto-fetched if not provided)
   * @returns {Promise<Object>} - Result object
   * @throws {Error} - If reason is not provided
   */
  async reject(taskId, reason = '', userId = null) {
    if (!taskId) {
      throw new Error('Task ID is required');
    }
    if (!reason || !reason.trim()) {
      throw new Error('Rejection reason is required');
    }

    return this.updateStatus(taskId, STATUS_ENUM.REJECTED, {
      reason,
      userId,
      metadata: {
        action: 'reject',
        rejection_reason: reason,
      },
    });
  },

  /**
   * Hold a task (put on hold)
   * @param {string} taskId - Task ID to hold
   * @param {string} reason - Reason for holding
   * @param {string} userId - Optional user ID
   * @returns {Promise<Object>} - Result object
   */
  async hold(taskId, reason = '', userId = null) {
    if (!taskId) {
      throw new Error('Task ID is required');
    }

    return this.updateStatus(taskId, STATUS_ENUM.ON_HOLD, {
      reason,
      userId,
      metadata: {
        action: 'hold',
        hold_reason: reason,
      },
    });
  },

  /**
   * Resume a task that was on hold
   * @param {string} taskId - Task ID to resume
   * @param {string} reason - Reason for resuming
   * @param {string} userId - Optional user ID
   * @returns {Promise<Object>} - Result object
   */
  async resume(taskId, reason = '', userId = null) {
    if (!taskId) {
      throw new Error('Task ID is required');
    }

    return this.updateStatus(taskId, STATUS_ENUM.PENDING, {
      reason: reason || 'Resumed from on-hold',
      userId,
      metadata: {
        action: 'resume',
      },
    });
  },

  /**
   * Cancel a task
   * @param {string} taskId - Task ID to cancel
   * @param {string} reason - Reason for cancellation
   * @param {string} userId - Optional user ID
   * @returns {Promise<Object>} - Result object
   */
  async cancel(taskId, reason = '', userId = null) {
    if (!taskId) {
      throw new Error('Task ID is required');
    }

    return this.updateStatus(taskId, STATUS_ENUM.CANCELLED, {
      reason,
      userId,
      metadata: {
        action: 'cancel',
        cancellation_reason: reason,
      },
    });
  },

  /**
   * Get task status history
   * @param {string} taskId - Task ID
   * @param {number} limit - Maximum number of history entries to return
   * @returns {Promise<Object>} - History object with entries array
   */
  async getHistory(taskId, limit = 50) {
    if (!taskId) {
      throw new Error('Task ID is required');
    }

    try {
      // Try new endpoint first
      try {
        const response = await cofounderAgentClient.makeRequest(
          `/api/tasks/${taskId}/status-history?limit=${limit}`,
          'GET'
        );
        return response;
      } catch (newError) {
        if (newError.status === 404) {
          console.warn('New history endpoint not found');
          // Return empty history if endpoint not available
          return {
            task_id: taskId,
            history: [],
            total: 0,
            message: 'History endpoint not available in this version',
          };
        }
        throw newError;
      }
    } catch (error) {
      console.error('Failed to get status history:', error);
      return {
        task_id: taskId,
        history: [],
        total: 0,
        error: error.message,
      };
    }
  },

  /**
   * Get validation failures for a task
   * @param {string} taskId - Task ID
   * @param {number} limit - Maximum number of failures to return
   * @returns {Promise<Object>} - Failures object with entries array
   */
  async getFailures(taskId, limit = 50) {
    if (!taskId) {
      throw new Error('Task ID is required');
    }

    try {
      // Try new endpoint first
      try {
        const response = await cofounderAgentClient.makeRequest(
          `/api/tasks/${taskId}/status-history/failures?limit=${limit}`,
          'GET'
        );
        return response;
      } catch (newError) {
        if (newError.status === 404) {
          console.warn('New failures endpoint not found');
          // Return empty failures if endpoint not available
          return {
            task_id: taskId,
            failures: [],
            total: 0,
            message: 'Failures endpoint not available in this version',
          };
        }
        throw newError;
      }
    } catch (error) {
      console.error('Failed to get validation failures:', error);
      return {
        task_id: taskId,
        failures: [],
        total: 0,
        error: error.message,
      };
    }
  },

  /**
   * Get task status metrics/dashboard data
   * @param {Object} options - Query options
   * @param {string} options.timeRange - Time range (e.g., '7d', '30d', '90d')
   * @param {string} options.status - Filter by status
   * @returns {Promise<Object>} - Metrics data
   */
  async getMetrics(options = {}) {
    const { timeRange = '7d', status = null } = options;

    try {
      const query = new URLSearchParams();
      query.append('time_range', timeRange);
      if (status) {
        query.append('status', status);
      }

      try {
        const response = await cofounderAgentClient.makeRequest(
          `/api/tasks/metrics?${query.toString()}`,
          'GET'
        );
        return response;
      } catch (newError) {
        if (newError.status === 404) {
          return {
            metrics: {},
            message: 'Metrics endpoint not available in this version',
          };
        }
        throw newError;
      }
    } catch (error) {
      console.error('Failed to get metrics:', error);
      return {
        metrics: {},
        error: error.message,
      };
    }
  },

  /**
   * Retry a failed task
   * @param {string} taskId - Task ID to retry
   * @param {string} reason - Reason for retry
   * @param {string} userId - Optional user ID
   * @returns {Promise<Object>} - Result object
   */
  async retry(taskId, reason = 'Manual retry', userId = null) {
    if (!taskId) {
      throw new Error('Task ID is required');
    }

    return this.updateStatus(taskId, STATUS_ENUM.PENDING, {
      reason,
      userId,
      metadata: {
        action: 'retry',
        retried_at: new Date().toISOString(),
      },
    });
  },

  /**
   * Batch approve multiple tasks
   * @param {string[]} taskIds - Array of task IDs
   * @param {string} feedback - Shared feedback for all tasks
   * @returns {Promise<Object[]>} - Array of result objects
   */
  async batchApprove(taskIds, feedback = '') {
    if (!Array.isArray(taskIds) || taskIds.length === 0) {
      throw new Error('At least one task ID is required');
    }

    return Promise.all(taskIds.map((id) => this.approve(id, feedback))).catch(
      (error) => {
        console.error('Batch approve failed:', error);
        throw new Error(
          'One or more approvals failed. Check console for details.'
        );
      }
    );
  },

  /**
   * Batch reject multiple tasks
   * @param {string[]} taskIds - Array of task IDs
   * @param {string} reason - Shared reason for rejection
   * @returns {Promise<Object[]>} - Array of result objects
   */
  async batchReject(taskIds, reason) {
    if (!Array.isArray(taskIds) || taskIds.length === 0) {
      throw new Error('At least one task ID is required');
    }
    if (!reason || !reason.trim()) {
      throw new Error('Rejection reason is required');
    }

    return Promise.all(taskIds.map((id) => this.reject(id, reason))).catch(
      (error) => {
        console.error('Batch reject failed:', error);
        throw new Error(
          'One or more rejections failed. Check console for details.'
        );
      }
    );
  },
};

export default unifiedStatusService;
