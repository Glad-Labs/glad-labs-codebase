/**
 * MessageFormatters.js
 *
 * Centralized formatting utilities for orchestrator messages.
 * All message formatting logic extracted and tested independently.
 *
 * Benefits:
 * - DRY principle - no duplicate formatting in components
 * - Testable - each formatter can be unit tested
 * - Consistent - all components use same formats
 * - Maintainable - change format in one place
 * - Localization-ready - easy to add i18n
 */

// ===== TEXT FORMATTING =====

/**
 * Truncate text to specified length with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} length - Max length before truncation (default: 500)
 * @returns {string} Truncated text with ellipsis if needed
 */
export const truncateText = (text, length = 500) => {
  if (!text || typeof text !== 'string') {
    return '';
  }
  return text.length > length ? text.substring(0, length) + '...' : text;
};

/**
 * Truncate text with custom ellipsis indicator
 * @param {string} text - Text to truncate
 * @param {number} length - Max length
 * @param {string} suffix - Custom suffix (default: '...')
 * @returns {string} Truncated text
 */
export const truncateTextCustom = (text, length = 500, suffix = '...') => {
  if (!text || typeof text !== 'string') {
    return '';
  }
  return text.length > length ? text.substring(0, length) + suffix : text;
};

/**
 * Capitalize first letter of string
 * @param {string} text - Text to capitalize
 * @returns {string} Capitalized text
 */
export const capitalizeFirst = (text) => {
  if (!text) {
    return '';
  }
  return text.charAt(0).toUpperCase() + text.slice(1);
};

// ===== NUMBER FORMATTING =====

/**
 * Format word count with K notation for thousands
 * @param {number} count - Word count
 * @returns {string} Formatted count (e.g., "2.5K", "500")
 */
export const formatWordCount = (count) => {
  if (typeof count !== 'number' || count < 0) {
    return '0';
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
};

/**
 * Format cost in USD
 * @param {number} cost - Cost in dollars
 * @returns {string} Formatted cost (e.g., "$0.025")
 */
export const formatCost = (cost) => {
  if (typeof cost !== 'number' || cost < 0) {
    return '$0.00';
  }
  return `$${cost.toFixed(3)}`;
};

/**
 * Format quality score 0-100 as 0-10
 * @param {number} score - Quality score (0-1 or 0-100)
 * @returns {string} Formatted score (e.g., "8/10")
 */
export const formatQualityScore = (score) => {
  if (typeof score !== 'number') {
    return 'N/A';
  }
  // Handle both 0-1 and 0-100 scales
  const normalized = score > 1 ? score : score * 100;
  return `${Math.round(normalized / 10)}/10`;
};

/**
 * Format percentage value
 * @param {number} value - Value 0-1
 * @returns {string} Formatted percentage (e.g., "85%")
 */
export const formatPercentage = (value) => {
  if (typeof value !== 'number') {
    return '0%';
  }
  return `${Math.round(value * 100)}%`;
};

// ===== TIME FORMATTING =====

/**
 * Format seconds into human-readable duration
 * @param {number} seconds - Total seconds
 * @returns {string} Formatted duration (e.g., "2m 30s", "5s")
 */
export const formatExecutionTime = (seconds) => {
  if (typeof seconds !== 'number' || seconds < 0) {
    return '0s';
  }

  if (seconds < 60) {
    return `${Math.round(seconds)}s`;
  }

  if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return secs > 0 ? `${minutes}m ${secs}s` : `${minutes}m`;
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
};

/**
 * Format timestamp to locale string
 * @param {number|string|Date} timestamp - Timestamp
 * @returns {string} Formatted date/time
 */
export const formatTimestamp = (timestamp) => {
  if (!timestamp) {
    return 'N/A';
  }
  try {
    return new Date(timestamp).toLocaleString();
  } catch {
    return 'Invalid date';
  }
};

/**
 * Format timestamp to relative time (e.g., "2 minutes ago")
 * @param {number|string|Date} timestamp - Timestamp
 * @returns {string} Relative time string
 */
export const formatRelativeTime = (timestamp) => {
  if (!timestamp) {
    return 'N/A';
  }

  try {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSecs < 60) {
      return 'just now';
    }
    if (diffMins < 60) {
      return `${diffMins}m ago`;
    }
    if (diffHours < 24) {
      return `${diffHours}h ago`;
    }
    if (diffDays < 7) {
      return `${diffDays}d ago`;
    }

    return date.toLocaleDateString();
  } catch {
    return 'N/A';
  }
};

/**
 * Estimate remaining time from phase count
 * @param {number} phasesRemaining - Number of remaining phases
 * @param {number} avgPerPhase - Average minutes per phase (default: 2)
 * @returns {string} Estimated time (e.g., "~10 min")
 */
export const formatEstimatedTime = (phasesRemaining, avgPerPhase = 2) => {
  if (typeof phasesRemaining !== 'number' || phasesRemaining < 0) {
    return '0 min';
  }
  const totalMinutes = phasesRemaining * avgPerPhase;
  return `~${totalMinutes} min`;
};

// ===== ARRAY/OBJECT FORMATTING =====

/**
 * Format phase status
 * @param {string} status - Status (complete, current, pending)
 * @returns {string} Formatted status with indicator
 */
export const formatPhaseStatus = (status) => {
  const labels = {
    complete: '✓ Done',
    current: '⏳ Running',
    pending: '⏸ Waiting',
  };
  return labels[status] || status;
};

/**
 * Format command parameters as readable string
 * @param {object} params - Parameters object
 * @returns {string} Formatted parameters (e.g., "topic: AI trends • style: professional")
 */
export const formatCommandParameters = (params) => {
  if (!params || typeof params !== 'object') {
    return '';
  }

  return Object.entries(params)
    .filter(([key, value]) => {
      // Skip internal fields
      if (['commandType', 'rawInput', 'additionalInstructions'].includes(key)) {
        return false;
      }
      return value && value !== '';
    })
    .map(([key, value]) => {
      const formattedKey = capitalizeFirst(
        key.replace(/([A-Z])/g, ' $1').trim()
      );
      return `${formattedKey}: ${truncateText(String(value), 50)}`;
    })
    .join(' • ');
};

/**
 * Format error severity
 * @param {string} severity - Severity level (error, warning, info)
 * @returns {string} Formatted severity with indicator
 */
export const formatErrorSeverity = (severity) => {
  const config = {
    error: '❌ Error',
    warning: '⚠️ Warning',
    info: 'ℹ️ Info',
  };
  return config[severity] || severity;
};

// ===== PHASE FORMATTING =====

/**
 * Format phase name with emoji
 * @param {string} phaseName - Phase name
 * @param {object} phaseEmojis - Emoji mapping
 * @returns {string} Formatted phase (e.g., "🔍 Research")
 */
export const formatPhaseLabel = (phaseName, phaseEmojis) => {
  const emoji = phaseEmojis?.[phaseName] || '⏳';
  return `${emoji} ${phaseName}`;
};

/**
 * Format progress percentage
 * @param {number} progress - Progress 0-100
 * @returns {string} Formatted progress (e.g., "45%")
 */
export const formatProgress = (progress) => {
  if (typeof progress !== 'number' || progress < 0 || progress > 100) {
    return '0%';
  }
  return `${Math.round(progress)}%`;
};

// ===== COMPOUND FORMATTERS =====

/**
 * Format full execution summary for display
 * @param {object} execution - Execution object
 * @returns {string} Summary text
 */
export const formatExecutionSummary = (execution) => {
  if (!execution) {
    return 'No execution data';
  }

  const duration = formatExecutionTime(execution.totalDuration || 0);
  const status = execution.status || 'unknown';
  const phaseText = `${execution.currentPhaseIndex + 1 || 0}/${execution.totalPhases || 0} phases`;

  return `${status} • ${phaseText} • ${duration}`;
};

/**
 * Format result metadata for display
 * @param {object} metadata - Metadata object
 * @returns {object} Formatted metadata
 */
export const formatResultMetadata = (metadata) => {
  if (!metadata) {
    return {};
  }

  return {
    words: formatWordCount(metadata.wordCount),
    quality: formatQualityScore(metadata.qualityScore),
    cost: formatCost(metadata.cost),
    time: formatExecutionTime(metadata.executionTime),
    model: metadata.model || 'Unknown',
    provider: metadata.provider || 'Unknown',
  };
};

// ===== VALIDATION HELPERS =====

/**
 * Check if value is valid for formatting
 * @param {*} value - Value to check
 * @returns {boolean} True if value can be formatted
 */
export const isFormattable = (value) =>
  value !== null && value !== undefined && value !== '';

/**
 * Safe formatter wrapper - returns N/A if value is invalid
 * @param {function} formatter - Formatter function
 * @param {*} value - Value to format
 * @param {*} defaultValue - Default if formatting fails (default: 'N/A')
 * @returns {string} Formatted value or default
 */
export const safeFormat = (formatter, value, defaultValue = 'N/A') => {
  try {
    return isFormattable(value) ? formatter(value) : defaultValue;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(`Formatting error: ${error.message}`);
    return defaultValue;
  }
};

// ===== EXPORT ALL FORMATTERS =====
const messageFormatters = {
  truncateText,
  truncateTextCustom,
  capitalizeFirst,
  formatWordCount,
  formatCost,
  formatQualityScore,
  formatPercentage,
  formatExecutionTime,
  formatTimestamp,
  formatRelativeTime,
  formatEstimatedTime,
  formatPhaseStatus,
  formatCommandParameters,
  formatErrorSeverity,
  formatPhaseLabel,
  formatProgress,
  formatExecutionSummary,
  formatResultMetadata,
  isFormattable,
  safeFormat,
};

export default messageFormatters;
