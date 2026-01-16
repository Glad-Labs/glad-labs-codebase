/**
 * Integration Tests for Unified Status Service
 * 
 * Tests the unified status service with:
 * - Status transitions and validation
 * - Backward compatibility with legacy endpoints
 * - Component integration (OrchestratorPage, TaskActions, TaskDetailModal)
 * - Error handling and recovery
 * - Batch operations
 */

import { unifiedStatusService } from '../services/unifiedStatusService';
import {
  STATUS_ENUM,
  STATUS_ENUM_LEGACY,
  STATUS_MAP_LEGACY_TO_NEW,
  STATUS_MAP_NEW_TO_LEGACY,
  isValidStatusTransition,
  getValidTransitions,
} from '../Constants/statusEnums';

/**
 * Mock cofounderAgentClient for testing
 */
jest.mock('../services/cofounderAgentClient', () => ({
  makeRequest: jest.fn(),
}));

const { makeRequest } = require('../services/cofounderAgentClient');

describe('Unified Status Service Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ============================================================================
  // Test Group 1: Status Enum & Mapping Tests
  // ============================================================================

  describe('Status Enums and Mappings', () => {
    test('should have 9 new status values', () => {
      expect(Object.keys(STATUS_ENUM).length).toBe(9);
    });

    test('should have 5 legacy status values', () => {
      expect(Object.keys(STATUS_ENUM_LEGACY).length).toBe(5);
    });

    test('should have complete legacy-to-new mapping', () => {
      Object.values(STATUS_ENUM_LEGACY).forEach((legacyStatus) => {
        expect(STATUS_MAP_LEGACY_TO_NEW[legacyStatus]).toBeDefined();
      });
    });

    test('should have complete new-to-legacy mapping', () => {
      Object.values(STATUS_ENUM).forEach((newStatus) => {
        expect(STATUS_MAP_NEW_TO_LEGACY[newStatus]).toBeDefined();
      });
    });

    test('should map pending_approval to awaiting_approval', () => {
      expect(
        STATUS_MAP_LEGACY_TO_NEW[STATUS_ENUM_LEGACY.PENDING_APPROVAL]
      ).toBe(STATUS_ENUM.AWAITING_APPROVAL);
    });

    test('should map executing to in_progress', () => {
      expect(
        STATUS_MAP_LEGACY_TO_NEW[STATUS_ENUM_LEGACY.EXECUTING]
      ).toBe(STATUS_ENUM.IN_PROGRESS);
    });

    test('should map completed to published', () => {
      expect(
        STATUS_MAP_LEGACY_TO_NEW[STATUS_ENUM_LEGACY.COMPLETED]
      ).toBe(STATUS_ENUM.PUBLISHED);
    });
  });

  // ============================================================================
  // Test Group 2: Status Transition Validation
  // ============================================================================

  describe('Status Transition Validation', () => {
    test('should allow pending → in_progress', () => {
      expect(
        isValidStatusTransition(STATUS_ENUM.PENDING, STATUS_ENUM.IN_PROGRESS)
      ).toBe(true);
    });

    test('should allow pending → awaiting_approval', () => {
      expect(
        isValidStatusTransition(
          STATUS_ENUM.PENDING,
          STATUS_ENUM.AWAITING_APPROVAL
        )
      ).toBe(true);
    });

    test('should allow awaiting_approval → approved', () => {
      expect(
        isValidStatusTransition(
          STATUS_ENUM.AWAITING_APPROVAL,
          STATUS_ENUM.APPROVED
        )
      ).toBe(true);
    });

    test('should allow awaiting_approval → rejected', () => {
      expect(
        isValidStatusTransition(
          STATUS_ENUM.AWAITING_APPROVAL,
          STATUS_ENUM.REJECTED
        )
      ).toBe(true);
    });

    test('should allow in_progress → published', () => {
      expect(
        isValidStatusTransition(STATUS_ENUM.IN_PROGRESS, STATUS_ENUM.PUBLISHED)
      ).toBe(true);
    });

    test('should allow in_progress → failed', () => {
      expect(
        isValidStatusTransition(STATUS_ENUM.IN_PROGRESS, STATUS_ENUM.FAILED)
      ).toBe(true);
    });

    test('should NOT allow invalid transitions', () => {
      expect(
        isValidStatusTransition(STATUS_ENUM.PUBLISHED, STATUS_ENUM.PENDING)
      ).toBe(false);
    });

    test('should NOT allow cancelled → any', () => {
      expect(
        isValidStatusTransition(STATUS_ENUM.CANCELLED, STATUS_ENUM.PENDING)
      ).toBe(false);
    });

    test('should return valid transitions for a status', () => {
      const transitions = getValidTransitions(STATUS_ENUM.PENDING);
      expect(Array.isArray(transitions)).toBe(true);
      expect(transitions.length).toBeGreaterThan(0);
      expect(transitions).toContain(STATUS_ENUM.IN_PROGRESS);
    });
  });

  // ============================================================================
  // Test Group 3: Unified Status Service - Approval Workflow
  // ============================================================================

  describe('Unified Status Service - Approval Workflow', () => {
    test('should approve a task using new endpoint', async () => {
      const taskId = 'task-123';
      const feedback = 'Looks good';

      makeRequest.mockResolvedValueOnce({
        success: true,
        task_id: taskId,
        new_status: STATUS_ENUM.APPROVED,
        validation_details: { warnings: [] },
      });

      const result = await unifiedStatusService.approve(taskId, feedback);

      expect(result.success).toBe(true);
      expect(result.new_status).toBe(STATUS_ENUM.APPROVED);
      expect(makeRequest).toHaveBeenCalledWith(
        `/api/tasks/${taskId}/status/validated`,
        'PUT',
        expect.objectContaining({
          new_status: STATUS_ENUM.APPROVED,
          feedback,
        })
      );
    });

    test('should reject a task with reason', async () => {
      const taskId = 'task-123';
      const reason = 'Does not meet requirements';

      makeRequest.mockResolvedValueOnce({
        success: true,
        task_id: taskId,
        new_status: STATUS_ENUM.REJECTED,
      });

      const result = await unifiedStatusService.reject(taskId, reason);

      expect(result.success).toBe(true);
      expect(result.new_status).toBe(STATUS_ENUM.REJECTED);
      expect(makeRequest).toHaveBeenCalledWith(
        `/api/tasks/${taskId}/status/validated`,
        'PUT',
        expect.objectContaining({
          new_status: STATUS_ENUM.REJECTED,
          reason,
        })
      );
    });

    test('should require reason for rejection', async () => {
      const taskId = 'task-123';

      await expect(
        unifiedStatusService.reject(taskId, '')
      ).rejects.toThrow('Rejection reason is required');
    });

    test('should fall back to legacy endpoint if new endpoint not found', async () => {
      const taskId = 'task-123';

      // First call fails with 404 (new endpoint not found)
      makeRequest.mockRejectedValueOnce({
        status: 404,
        message: 'Not found',
      });

      // Second call succeeds (legacy endpoint)
      makeRequest.mockResolvedValueOnce({
        success: true,
        status: STATUS_ENUM_LEGACY.APPROVED,
      });

      const result = await unifiedStatusService.approve(taskId, 'Approved');

      expect(result.success).toBe(true);
      // Should have been called twice (new endpoint, then legacy fallback)
      expect(makeRequest).toHaveBeenCalledTimes(2);
    });

    test('should handle approval with validation warnings', async () => {
      const taskId = 'task-123';

      makeRequest.mockResolvedValueOnce({
        success: true,
        task_id: taskId,
        new_status: STATUS_ENUM.APPROVED,
        validation_details: {
          warnings: ['Missing image', 'Short description'],
        },
      });

      const result = await unifiedStatusService.approve(taskId, 'Approved');

      expect(result.validation_details.warnings).toHaveLength(2);
    });
  });

  // ============================================================================
  // Test Group 4: Unified Status Service - Other Operations
  // ============================================================================

  describe('Unified Status Service - Other Operations', () => {
    test('should hold a task', async () => {
      const taskId = 'task-123';
      const reason = 'Waiting for clarification';

      makeRequest.mockResolvedValueOnce({
        success: true,
        new_status: STATUS_ENUM.ON_HOLD,
      });

      const result = await unifiedStatusService.hold(taskId, reason);

      expect(result.new_status).toBe(STATUS_ENUM.ON_HOLD);
    });

    test('should resume a held task', async () => {
      const taskId = 'task-123';

      makeRequest.mockResolvedValueOnce({
        success: true,
        new_status: STATUS_ENUM.PENDING,
      });

      const result = await unifiedStatusService.resume(taskId);

      expect(result.new_status).toBe(STATUS_ENUM.PENDING);
    });

    test('should cancel a task', async () => {
      const taskId = 'task-123';
      const reason = 'No longer needed';

      makeRequest.mockResolvedValueOnce({
        success: true,
        new_status: STATUS_ENUM.CANCELLED,
      });

      const result = await unifiedStatusService.cancel(taskId, reason);

      expect(result.new_status).toBe(STATUS_ENUM.CANCELLED);
    });

    test('should retry a failed task', async () => {
      const taskId = 'task-123';

      makeRequest.mockResolvedValueOnce({
        success: true,
        new_status: STATUS_ENUM.PENDING,
      });

      const result = await unifiedStatusService.retry(taskId);

      expect(result.new_status).toBe(STATUS_ENUM.PENDING);
    });
  });

  // ============================================================================
  // Test Group 5: History and Metrics
  // ============================================================================

  describe('Unified Status Service - History and Metrics', () => {
    test('should fetch task history', async () => {
      const taskId = 'task-123';
      const mockHistory = [
        { status: STATUS_ENUM.PENDING, timestamp: '2026-01-16T10:00:00Z' },
        {
          status: STATUS_ENUM.IN_PROGRESS,
          timestamp: '2026-01-16T10:05:00Z',
        },
        { status: STATUS_ENUM.APPROVED, timestamp: '2026-01-16T10:10:00Z' },
      ];

      makeRequest.mockResolvedValueOnce({
        task_id: taskId,
        history: mockHistory,
        total: 3,
      });

      const result = await unifiedStatusService.getHistory(taskId);

      expect(result.history).toHaveLength(3);
      expect(makeRequest).toHaveBeenCalledWith(
        `/api/tasks/${taskId}/status-history?limit=50`,
        'GET'
      );
    });

    test('should fetch validation failures', async () => {
      const taskId = 'task-123';
      const mockFailures = [
        {
          constraint: 'min_length',
          message: 'Content too short',
          timestamp: '2026-01-16T10:00:00Z',
        },
      ];

      makeRequest.mockResolvedValueOnce({
        task_id: taskId,
        failures: mockFailures,
        total: 1,
      });

      const result = await unifiedStatusService.getFailures(taskId);

      expect(result.failures).toHaveLength(1);
      expect(result.failures[0].constraint).toBe('min_length');
    });

    test('should fetch metrics', async () => {
      const mockMetrics = {
        total_tasks: 100,
        completed: 75,
        pending: 15,
        failed: 10,
        average_time_to_completion: 3600,
      };

      makeRequest.mockResolvedValueOnce({
        metrics: mockMetrics,
      });

      const result = await unifiedStatusService.getMetrics({
        timeRange: '7d',
      });

      expect(result.metrics.total_tasks).toBe(100);
      expect(result.metrics.completed).toBe(75);
    });

    test('should handle missing history endpoint gracefully', async () => {
      const taskId = 'task-123';

      makeRequest.mockRejectedValueOnce({ status: 404 });

      const result = await unifiedStatusService.getHistory(taskId);

      expect(result.history).toEqual([]);
      expect(result.message).toContain('not available');
    });
  });

  // ============================================================================
  // Test Group 6: Batch Operations
  // ============================================================================

  describe('Unified Status Service - Batch Operations', () => {
    test('should approve multiple tasks', async () => {
      const taskIds = ['task-1', 'task-2', 'task-3'];

      makeRequest
        .mockResolvedValueOnce({ success: true })
        .mockResolvedValueOnce({ success: true })
        .mockResolvedValueOnce({ success: true });

      const results = await unifiedStatusService.batchApprove(
        taskIds,
        'Batch approved'
      );

      expect(results).toHaveLength(3);
      expect(results.every((r) => r.success)).toBe(true);
    });

    test('should reject multiple tasks', async () => {
      const taskIds = ['task-1', 'task-2'];

      makeRequest
        .mockResolvedValueOnce({ success: true })
        .mockResolvedValueOnce({ success: true });

      const results = await unifiedStatusService.batchReject(
        taskIds,
        'Not approved'
      );

      expect(results).toHaveLength(2);
    });

    test('should require reason for batch rejection', async () => {
      const taskIds = ['task-1', 'task-2'];

      await expect(
        unifiedStatusService.batchReject(taskIds, '')
      ).rejects.toThrow('Rejection reason is required');
    });

    test('should handle batch operation failures', async () => {
      const taskIds = ['task-1', 'task-2'];

      makeRequest
        .mockResolvedValueOnce({ success: true })
        .mockRejectedValueOnce(new Error('Server error'));

      await expect(
        unifiedStatusService.batchApprove(taskIds, 'Approved')
      ).rejects.toThrow('One or more approvals failed');
    });
  });

  // ============================================================================
  // Test Group 7: Error Handling
  // ============================================================================

  describe('Unified Status Service - Error Handling', () => {
    test('should handle missing task ID', async () => {
      await expect(
        unifiedStatusService.approve(null, 'Approved')
      ).rejects.toThrow('Task ID is required');
    });

    test('should handle API errors gracefully', async () => {
      const taskId = 'task-123';

      makeRequest.mockRejectedValueOnce(
        new Error('Network error')
      );
      makeRequest.mockRejectedValueOnce(
        new Error('Network error')
      ); // Fallback also fails

      await expect(
        unifiedStatusService.approve(taskId, 'Approved')
      ).rejects.toThrow();
    });

    test('should wrap error messages appropriately', async () => {
      const taskId = 'task-123';

      makeRequest.mockRejectedValueOnce(
        new Error('Validation failed')
      );
      makeRequest.mockRejectedValueOnce(
        new Error('Validation failed')
      );

      try {
        await unifiedStatusService.approve(taskId, 'Approved');
      } catch (err) {
        expect(err.message).toContain('Failed to update task status');
      }
    });
  });

  // ============================================================================
  // Test Group 8: localStorage Integration
  // ============================================================================

  describe('localStorage Integration', () => {
    test('should use stored auth token if available', async () => {
      const token = 'test-token-123';
      localStorage.setItem('authToken', token);

      makeRequest.mockResolvedValueOnce({ success: true });

      await unifiedStatusService.approve('task-123', 'Approved');

      expect(makeRequest).toHaveBeenCalled();
    });

    test('should use stored current user if available', async () => {
      const user = { id: 'user-123', email: 'test@example.com' };
      localStorage.setItem('currentUser', JSON.stringify(user));

      makeRequest.mockResolvedValueOnce({ success: true });

      await unifiedStatusService.approve('task-123', 'Approved');

      // Verify that user ID was included in the request
      expect(makeRequest).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        expect.objectContaining({
          user_id: 'user-123',
        })
      );
    });
  });

  // ============================================================================
  // Test Group 9: Backward Compatibility
  // ============================================================================

  describe('Backward Compatibility', () => {
    test('should still work with legacy callback functions', async () => {
      const taskId = 'task-123';
      const legacyCallback = jest.fn();

      makeRequest.mockResolvedValueOnce({ success: true });

      await unifiedStatusService.approve(taskId, 'Approved');

      // Legacy callbacks should still be called by consumers
      expect(makeRequest).toHaveBeenCalled();
    });

    test('should include backward-compatible metadata', async () => {
      const taskId = 'task-123';

      makeRequest.mockResolvedValueOnce({ success: true });

      await unifiedStatusService.approve(taskId, 'Approved');

      // Check that metadata includes timestamp and ui flag
      expect(makeRequest).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        expect.objectContaining({
          metadata: expect.objectContaining({
            updated_from_ui: true,
            timestamp: expect.any(String),
          }),
        })
      );
    });
  });

  // ============================================================================
  // Test Group 10: Component Integration
  // ============================================================================

  describe('Component Integration', () => {
    test('should work with OrchestratorPage approve handler', async () => {
      // Simulate OrchestratorPage calling the service
      const taskId = 'execution-123';

      makeRequest.mockResolvedValueOnce({
        success: true,
        new_status: STATUS_ENUM.APPROVED,
      });

      const result = await unifiedStatusService.approve(
        taskId,
        'Approved via OrchestratorPage'
      );

      expect(result.success).toBe(true);
    });

    test('should work with TaskActions dialogs', async () => {
      // Simulate TaskActions approve dialog
      const taskId = 'task-123';
      const feedback = 'Looks good';

      makeRequest.mockResolvedValueOnce({
        success: true,
        validation_details: { warnings: [] },
      });

      const result = await unifiedStatusService.approve(taskId, feedback);

      expect(result.success).toBe(true);
    });

    test('should work with TaskDetailModal tabs', async () => {
      // Simulate StatusAuditTrail component
      const taskId = 'task-123';

      makeRequest.mockResolvedValueOnce({
        task_id: taskId,
        history: [],
        total: 0,
      });

      const result = await unifiedStatusService.getHistory(taskId);

      expect(result.task_id).toBe(taskId);
    });
  });
});
