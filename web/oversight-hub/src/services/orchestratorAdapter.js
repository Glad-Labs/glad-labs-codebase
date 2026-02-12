/**
 * Orchestrator Adapter - Backward Compatibility Layer
 *
 * Maps legacy /api/orchestrator/* endpoint calls to new Phase 4 endpoints.
 * Allows existing UI components to continue working without modification
 * while we transition to the new unified services architecture.
 *
 * Legacy Mapping:
 * - /api/orchestrator/executions → /api/tasks (with filtering)
 * - /api/orchestrator/stats → Aggregated from /api/workflows/ and /api/tasks/
 * - /api/orchestrator/process → /api/workflows/execute/{template}
 * - /api/orchestrator/training/* → /api/tasks (with training filters)
 * - /api/orchestrator/approval → /api/tasks/{taskId}/approve
 *
 * @module orchestratorAdapter
 */

import phase4Client from './phase4Client';
import { logError } from './errorLoggingService';

/**
 * Legacy Orchestrator API Adapter
 * Provides methods matching the old /api/orchestrator/* interface
 */
const orchestratorAdapter = {
  /**
   * Get orchestrator executions
   * Maps to: /api/tasks?filter=orchestrator
   * @param {object} options - Query options (limit, filter, etc.)
   */
  getExecutions: async (options = {}) => {
    try {
      const { limit = 50, ...filters } = options;

      // Call new API to get tasks
      const tasks = await phase4Client.taskClient.listTasks(
        { ...filters, type: 'orchestrator' },
        limit
      );

      // Transform to legacy format
      return {
        executions: tasks.map((task) => ({
          id: task.id,
          status: task.status,
          input: task.input,
          output: task.output,
          startTime: task.created_at,
          endTime: task.completed_at,
          duration: task.duration || 0,
          phase: task.phase,
          agent: task.assigned_agent,
        })),
        total: tasks.length,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      logError('getExecutions adapter', error);
      return {
        executions: [],
        total: 0,
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  },

  /**
   * Get orchestrator statistics
   * Aggregates data from /api/workflows/ and /api/tasks/
   */
  getStats: async () => {
    try {
      // Get workflow info
      const templates = await phase4Client.workflowClient.getTemplates();

      // Get recent tasks for stats
      const recentTasks = await phase4Client.taskClient.listTasks({}, 1000);

      // Calculate aggregates
      const totalExecutions = recentTasks.length;
      const completeCount = recentTasks.filter(
        (t) => t.status === 'completed'
      ).length;
      const failedCount = recentTasks.filter(
        (t) => t.status === 'failed'
      ).length;
      const pendingCount = recentTasks.filter(
        (t) => t.status === 'pending'
      ).length;

      const successRate =
        totalExecutions > 0
          ? ((completeCount / totalExecutions) * 100).toFixed(2)
          : 0;

      // Group by phase
      const phaseStats = {};
      recentTasks.forEach((task) => {
        if (!phaseStats[task.phase]) {
          phaseStats[task.phase] = { total: 0, completed: 0, failed: 0 };
        }
        phaseStats[task.phase].total += 1;
        if (task.status === 'completed') phaseStats[task.phase].completed += 1;
        if (task.status === 'failed') phaseStats[task.phase].failed += 1;
      });

      return {
        totalExecutions,
        completed: completeCount,
        failed: failedCount,
        pending: pendingCount,
        successRate: parseFloat(successRate),
        activeWorkflows: templates.length,
        phaseStats,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      logError('getStats adapter', error);
      return {
        totalExecutions: 0,
        completed: 0,
        failed: 0,
        pending: 0,
        successRate: 0,
        activeWorkflows: 0,
        phaseStats: {},
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  },

  /**
   * Process orchestrator request
   * Maps to: /api/workflows/execute/{template}
   * @param {string} templateId - Workflow template ID
   * @param {object} params - Request parameters
   */
  processRequest: async (templateId, params = {}) => {
    try {
      const result = await phase4Client.workflowClient.executeWorkflow(
        templateId,
        params
      );

      // Transform to legacy format if needed
      return {
        executionId: result.id || result.execution_id,
        status: 'processing',
        message: 'Workflow started',
        template: templateId,
        ...result,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      logError('processRequest adapter', error);
      return {
        error: error.message,
        status: 'failed',
        timestamp: new Date().toISOString(),
      };
    }
  },

  /**
   * Get overall orchestrator status
   * Aggregates agent, service, and workflow status
   */
  getOverallStatus: async () => {
    try {
      // Get agents
      const agents = await phase4Client.agentDiscoveryClient.getRegistry();
      const agentCount = Object.keys(agents).length;

      // Get services
      const services = await phase4Client.serviceRegistryClient.listServices();
      const serviceCount = Array.isArray(services)
        ? services.length
        : Object.keys(services).length;

      // Get recent stats
      const stats = await orchestratorAdapter.getStats();

      return {
        status: 'operational',
        agentCount,
        serviceCount,
        activeWorkflows: stats.activeWorkflows,
        executions: stats,
        lastUpdate: new Date().toISOString(),
      };
    } catch (error) {
      logError('getOverallStatus adapter', error);
      return {
        status: 'error',
        error: error.message,
        lastUpdate: new Date().toISOString(),
      };
    }
  },

  /**
   * Get training data metrics
   * Maps to: /api/tasks?filter=training
   */
  getTrainingMetrics: async (options = {}) => {
    try {
      const { limit = 100, ...filters } = options;

      const tasks = await phase4Client.taskClient.listTasks(
        { ...filters, type: 'training' },
        limit
      );

      // Group by type
      const byType = {};
      tasks.forEach((task) => {
        const type = task.subtype || 'general';
        if (!byType[type]) {
          byType[type] = [];
        }
        byType[type].push(task);
      });

      return {
        totalRecords: tasks.length,
        byType,
        lastUpdate: new Date().toISOString(),
      };
    } catch (error) {
      logError('getTrainingMetrics adapter', error);
      return {
        totalRecords: 0,
        byType: {},
        error: error.message,
        lastUpdate: new Date().toISOString(),
      };
    }
  },

  /**
   * Get training data for specific type
   */
  getTrainingData: async (type, options = {}) => {
    try {
      const { limit = 100 } = options;

      const tasks = await phase4Client.taskClient.listTasks(
        { type: 'training', subtype: type },
        limit
      );

      return {
        type,
        data: tasks,
        count: tasks.length,
        lastUpdate: new Date().toISOString(),
      };
    } catch (error) {
      logError('getTrainingData adapter', error);
      return {
        type,
        data: [],
        count: 0,
        error: error.message,
        lastUpdate: new Date().toISOString(),
      };
    }
  },

  /**
   * Request orchestrator approval
   * Maps to: /api/tasks/{taskId}/approve endpoint
   */
  requestApproval: async (executionId, data = {}) => {
    try {
      const result = await phase4Client.taskClient.approveTask(executionId, {
        action: 'request_approval',
        ...data,
      });

      return {
        executionId,
        status: 'approval_requested',
        ...result,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      logError('requestApproval adapter', error);
      return {
        executionId,
        status: 'error',
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  },

  /**
   * Submit approval decision
   */
  submitApproval: async (executionId, decision, notes = '') => {
    try {
      const result = await phase4Client.taskClient.approveTask(executionId, {
        decision, // 'approved' | 'rejected'
        notes,
      });

      return {
        executionId,
        status: 'approval_submitted',
        decision,
        ...result,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      logError('submitApproval adapter', error);
      return {
        executionId,
        status: 'error',
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  },

  /**
   * Get execution tools/capabilities
   * Maps to: /api/agents/* endpoints
   */
  getExecutionTools: async () => {
    try {
      const registry = await phase4Client.agentDiscoveryClient.getRegistry();
      const agents = [];

      for (const [name, agent] of Object.entries(registry)) {
        agents.push({
          id: name,
          name: agent.name || name,
          capabilities: agent.capabilities || [],
          phases: agent.phases || [],
          description: agent.description || '',
        });
      }

      return {
        tools: agents,
        count: agents.length,
        lastUpdate: new Date().toISOString(),
      };
    } catch (error) {
      logError('getExecutionTools adapter', error);
      return {
        tools: [],
        count: 0,
        error: error.message,
        lastUpdate: new Date().toISOString(),
      };
    }
  },

  /**
   * Health check - verify adapter and underlying APIs are functional
   */
  healthCheck: async () => {
    try {
      // Test Phase 4 client
      const phase4Health = await phase4Client.healthCheck();

      if (!phase4Health.healthy) {
        return {
          healthy: false,
          message: 'Phase 4 client not accessible',
          phase4: phase4Health,
        };
      }

      // Test adapter methods
      const stats = await orchestratorAdapter.getStats();

      return {
        healthy: !stats.error,
        message: stats.error || 'Adapter operational',
        phase4: phase4Health,
        stats,
      };
    } catch (error) {
      return {
        healthy: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  },
};

export default orchestratorAdapter;
