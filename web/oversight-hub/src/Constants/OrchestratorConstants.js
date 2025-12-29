/**
 * OrchestratorConstants.js
 *
 * Centralized constants for the orchestrator message system.
 * Single source of truth for:
 * - Message types
 * - Command types with metadata
 * - Phase configurations
 * - Error severities
 * - Gradient styles
 *
 * This eliminates duplication across handler, components, and utilities.
 */

// ===== MESSAGE TYPES =====
export const MESSAGE_TYPES = {
  USER_MESSAGE: 'user_message',
  AI_MESSAGE: 'ai_message',
  ORCHESTRATOR_COMMAND: 'orchestrator_command',
  ORCHESTRATOR_STATUS: 'orchestrator_status',
  ORCHESTRATOR_RESULT: 'orchestrator_result',
  ORCHESTRATOR_ERROR: 'orchestrator_error',
};

// ===== COMMAND TYPES WITH METADATA =====
export const COMMAND_TYPES = {
  generate: {
    id: 'generate',
    icon: '✨',
    label: 'Generate',
    description: 'Create new content',
    color: '#667eea',
    bgGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  analyze: {
    id: 'analyze',
    icon: '🔍',
    label: 'Analyze',
    description: 'Examine and evaluate',
    color: '#764ba2',
    bgGradient: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
  },
  optimize: {
    id: 'optimize',
    icon: '⚡',
    label: 'Optimize',
    description: 'Enhance and improve',
    color: '#f093fb',
    bgGradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  },
  plan: {
    id: 'plan',
    icon: '📋',
    label: 'Plan',
    description: 'Organize and schedule',
    color: '#4facfe',
    bgGradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  },
  export: {
    id: 'export',
    icon: '📤',
    label: 'Export',
    description: 'Save and extract',
    color: '#43e97b',
    bgGradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  },
  delegate: {
    id: 'delegate',
    icon: '🤝',
    label: 'Delegate',
    description: 'Hand off to agent',
    color: '#fa709a',
    bgGradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  },
};

// ===== EXECUTION PHASES =====
export const EXECUTION_PHASES = [
  {
    id: 0,
    name: 'Research',
    emoji: '🔍',
    description: 'Gathering information and context',
    estimatedDuration: 2, // minutes
  },
  {
    id: 1,
    name: 'Analysis',
    emoji: '📊',
    description: 'Analyzing data and patterns',
    estimatedDuration: 2,
  },
  {
    id: 2,
    name: 'Generation',
    emoji: '✨',
    description: 'Creating content or solution',
    estimatedDuration: 2,
  },
  {
    id: 3,
    name: 'Review',
    emoji: '👀',
    description: 'Quality assurance and validation',
    estimatedDuration: 2,
  },
  {
    id: 4,
    name: 'Refinement',
    emoji: '🔨',
    description: 'Fine-tuning and optimization',
    estimatedDuration: 2,
  },
  {
    id: 5,
    name: 'Publishing',
    emoji: '📤',
    description: 'Finalizing and delivery',
    estimatedDuration: 2,
  },
];

// ===== PHASE STATUS =====
export const PHASE_STATUS = {
  PENDING: 'pending',
  CURRENT: 'current',
  COMPLETE: 'complete',
};

// ===== ERROR SEVERITY =====
export const ERROR_SEVERITY = {
  error: {
    id: 'error',
    icon: '❌',
    label: 'Error',
    color: '#d32f2f',
    bgGradient: 'linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%)',
    borderColor: '#d32f2f',
  },
  warning: {
    id: 'warning',
    icon: '⚠️',
    label: 'Warning',
    color: '#f57c00',
    bgGradient: 'linear-gradient(135deg, #f57c00 0%, #e65100 100%)',
    borderColor: '#f57c00',
  },
  info: {
    id: 'info',
    icon: 'ℹ️',
    label: 'Info',
    color: '#1976d2',
    bgGradient: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
    borderColor: '#1976d2',
  },
};

// ===== GRADIENT STYLES =====
export const GRADIENT_STYLES = {
  command: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  status: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)',
  result: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
  error: 'linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%)',
  warning: 'linear-gradient(135deg, #f57c00 0%, #e65100 100%)',
};

// ===== STATUS COLORS =====
export const STATUS_COLORS = {
  complete: '#4caf50',
  current: '#2196f3',
  pending: '#bdbdbd',
};

export const STATUS_LABELS = {
  complete: '✓ Done',
  current: '⏳ Running',
  pending: '⏸ Waiting',
};

// ===== UTILITY FUNCTIONS =====

/**
 * Get command type metadata by ID
 * @param {string} commandId - Command type ID (generate, analyze, etc.)
 * @returns {object} Command metadata
 */
export const getCommandTypeInfo = (commandId) =>
  COMMAND_TYPES[commandId] || COMMAND_TYPES.generate;

/**
 * Get phase configuration by index
 * @param {number} phaseIndex - Phase index (0-5)
 * @returns {object} Phase configuration
 */
export const getPhaseConfig = (phaseIndex) => {
  if (typeof phaseIndex !== 'number' || phaseIndex < 0 || phaseIndex > 5) {
    return EXECUTION_PHASES[0];
  }
  return EXECUTION_PHASES[phaseIndex];
};

/**
 * Get phase configuration by name
 * @param {string} phaseName - Phase name (Research, Analysis, etc.)
 * @returns {object} Phase configuration
 */
export const getPhaseByName = (phaseName) =>
  EXECUTION_PHASES.find((p) => p.name === phaseName) || EXECUTION_PHASES[0];

/**
 * Get error severity metadata
 * @param {string} severity - Severity level (error, warning, info)
 * @returns {object} Error severity metadata
 */
export const getErrorSeverityInfo = (severity) =>
  ERROR_SEVERITY[severity] || ERROR_SEVERITY.error;

/**
 * Get status label
 * @param {string} status - Status (pending, current, complete)
 * @returns {string} Status label with indicator
 */
export const getStatusLabel = (status) => STATUS_LABELS[status] || status;

/**
 * Get status color
 * @param {string} status - Status (pending, current, complete)
 * @returns {string} Hex color code
 */
export const getStatusColor = (status) => STATUS_COLORS[status] || '#999';

/**
 * Calculate total estimated execution time in minutes
 * @returns {number} Total minutes
 */
export const getTotalEstimatedTime = () =>
  EXECUTION_PHASES.reduce((total, phase) => total + phase.estimatedDuration, 0);

/**
 * Calculate remaining time from phase index
 * @param {number} currentPhaseIndex - Current phase index
 * @returns {number} Remaining minutes
 */
export const estimateRemainingTime = (currentPhaseIndex) => {
  if (currentPhaseIndex >= EXECUTION_PHASES.length) {
    return 0;
  }
  const remainingPhases = EXECUTION_PHASES.slice(currentPhaseIndex);
  return remainingPhases.reduce(
    (total, phase) => total + phase.estimatedDuration,
    0
  );
};

/**
 * Get all command types as array
 * @returns {array} Array of command type objects
 */
export const getAllCommandTypes = () => Object.values(COMMAND_TYPES);

/**
 * Check if command type is valid
 * @param {string} commandId - Command type ID
 * @returns {boolean} True if valid
 */
export const isValidCommandType = (commandId) =>
  Boolean(COMMAND_TYPES[commandId]);

/**
 * Check if severity level is valid
 * @param {string} severity - Severity level
 * @returns {boolean} True if valid
 */
export const isValidSeverity = (severity) => Boolean(ERROR_SEVERITY[severity]);

const orchestratorConstants = {
  MESSAGE_TYPES,
  COMMAND_TYPES,
  EXECUTION_PHASES,
  PHASE_STATUS,
  ERROR_SEVERITY,
  GRADIENT_STYLES,
  STATUS_COLORS,
  STATUS_LABELS,
  getCommandTypeInfo,
  getPhaseConfig,
  getPhaseByName,
  getErrorSeverityInfo,
  getStatusLabel,
  getStatusColor,
  getTotalEstimatedTime,
  estimateRemainingTime,
  getAllCommandTypes,
  isValidCommandType,
  isValidSeverity,
};

export default orchestratorConstants;
