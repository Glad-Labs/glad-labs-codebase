/**
 * OrchestratorChatHandler.js
 *
 * Core handler for routing messages between conversation mode and orchestrator mode.
 * Detects user intent, parses natural language commands, and formats responses
 * for appropriate display in the unified chat interface.
 *
 * Features:
 * - Intent detection (is this a command or conversation?)
 * - Natural language command parsing (extract parameters from user input)
 * - Response formatting (format backend responses for chat display)
 * - Error handling and recovery suggestions
 * - Message type system (6 types: user, ai, command, status, result, error)
 */

/**
 * Message Types - Used to determine how messages are rendered in chat
 */
export const MESSAGE_TYPES = {
  USER_MESSAGE: 'user_message', // User text input
  AI_MESSAGE: 'ai_message', // LLM conversation response
  ORCHESTRATOR_COMMAND: 'orchestrator_command', // Command to execute
  ORCHESTRATOR_STATUS: 'orchestrator_status', // Real-time progress
  ORCHESTRATOR_RESULT: 'orchestrator_result', // Final output
  ORCHESTRATOR_ERROR: 'orchestrator_error', // Error with recovery
};

/**
 * Intent keywords mapped to orchestrator command types
 * Used for auto-detecting orchestrator commands in user input
 */
const INTENT_KEYWORDS = {
  generate: ['generate', 'create', 'write', 'make', 'build', 'compose'],
  analyze: ['analyze', 'examine', 'review', 'evaluate', 'assess', 'check'],
  optimize: ['optimize', 'improve', 'enhance', 'refine', 'boost', 'accelerate'],
  plan: ['plan', 'schedule', 'organize', 'arrange', 'structure', 'layout'],
  export: ['export', 'save', 'download', 'extract', 'pull', 'fetch'],
  delegate: ['delegate', 'assign', 'hand-off', 'pass', 'forward', 'transfer'],
};

/**
 * Extract command type from user input based on keywords
 * Returns null if no orchestrator command detected
 */
export const detectIntentFromMessage = (message) => {
  if (!message || typeof message !== 'string') {
    return null;
  }

  const lowerMessage = message.toLowerCase();

  for (const [commandType, keywords] of Object.entries(INTENT_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lowerMessage.includes(keyword)) {
        return commandType;
      }
    }
  }

  return null; // No orchestrator command detected
};

/**
 * Parse natural language command into structured parameters
 * Extracts key information from user input for orchestrator execution
 *
 * @param {string} message - User input message
 * @param {string} commandType - Type of command (generate, analyze, etc.)
 * @returns {object} Structured parameters for orchestrator
 */
export const parseCommandParameters = (message, commandType) => {
  const params = {
    commandType,
    rawInput: message,
    topic: extractTopic(message),
    style: extractStyle(message),
    length: extractLength(message),
    format: extractFormat(message),
    context: extractContext(message),
    additionalInstructions: message,
  };

  return params;
};

/**
 * Extract main topic/subject from user message
 */
const extractTopic = (message) => {
  // Remove common phrases and return the main content
  const cleaned = message
    .replace(
      /^(generate|create|write|analyze|plan|export|delegate|let me|please|can you|could you|would you)\s+/i,
      ''
    )
    .replace(/\s+(about|for|on|regarding|concerning)\s+/i, ' ')
    .trim();

  return cleaned.substring(0, 100); // Limit to 100 chars
};

/**
 * Extract style preference (e.g., "professional", "casual", "academic")
 */
const extractStyle = (message) => {
  const stylePatterns = [
    /\b(professional|formal|informal|casual|academic|technical|friendly|humorous)\b/i,
  ];

  for (const pattern of stylePatterns) {
    const match = message.match(pattern);
    if (match) {
      return match[1].toLowerCase();
    }
  }

  return 'professional'; // Default
};

/**
 * Extract content length preference (e.g., "short", "long", "2000 words")
 */
const extractLength = (message) => {
  const lengthPatterns = [
    /(\d+)\s*(words?|sentences?|paragraphs?|characters?)/i,
    /\b(short|brief|medium|long|detailed|concise|extensive|comprehensive)\b/i,
  ];

  for (const pattern of lengthPatterns) {
    const match = message.match(pattern);
    if (match) {
      if (match[1] && !isNaN(match[1])) {
        return `${match[1]} ${match[2]}`;
      }
      return match[1].toLowerCase();
    }
  }

  return 'medium'; // Default
};

/**
 * Extract format preference (e.g., "markdown", "html", "json")
 */
const extractFormat = (message) => {
  const formatPatterns = [
    /\b(markdown|html|json|xml|csv|plaintext|pdf|docx)\b/i,
  ];

  for (const pattern of formatPatterns) {
    const match = message.match(pattern);
    if (match) {
      return match[1].toLowerCase();
    }
  }

  return 'markdown'; // Default
};

/**
 * Extract any additional context mentioned (e.g., audience, purpose)
 */
const extractContext = (message) => {
  const contextPatterns = [
    /for\s+([^,.]+)/i,
    /audience[:\s]+([^,.]+)/i,
    /purpose[:\s]+([^,.]+)/i,
  ];

  for (const pattern of contextPatterns) {
    const match = message.match(pattern);
    if (match) {
      return match[1].trim();
    }
  }

  return '';
};

/**
 * Format orchestrator command message for chat display
 * Creates a structured message object for rendering
 */
export const formatCommandMessage = (message, parameters, mode) => {
  return {
    type: MESSAGE_TYPES.ORCHESTRATOR_COMMAND,
    originalMessage: message,
    sender: 'user',
    direction: 'outgoing',
    commandType: parameters.commandType,
    parameters,
    mode,
    timestamp: new Date().toISOString(),
    status: 'pending', // pending, executing, completed, failed
    executionId: null, // Will be set after submission
  };
};

/**
 * Format status update message for real-time feedback
 * Called when orchestrator provides phase updates
 */
export const formatStatusMessage = (statusUpdate, executionId) => {
  return {
    type: MESSAGE_TYPES.ORCHESTRATOR_STATUS,
    sender: 'orchestrator',
    direction: 'incoming',
    executionId,
    phase: statusUpdate.phase || 'Unknown',
    phaseNumber: statusUpdate.phase_number || 0,
    totalPhases: statusUpdate.total_phases || 6,
    progress: statusUpdate.progress || 0, // 0-100
    currentTask: statusUpdate.current_task || 'Processing...',
    estimatedTimeRemaining: statusUpdate.estimated_time_remaining || null,
    timestamp: new Date().toISOString(),
    metadata: statusUpdate,
  };
};

/**
 * Format result message for display with approve/reject buttons
 * Called when orchestrator completes execution
 */
export const formatResultMessage = (result, executionId) => {
  return {
    type: MESSAGE_TYPES.ORCHESTRATOR_RESULT,
    sender: 'orchestrator',
    direction: 'incoming',
    executionId,
    content: result.content || '',
    title: result.title || 'Result',
    summary: result.summary || '',
    metadata: {
      wordCount: result.word_count || 0,
      imageCount: result.image_count || 0,
      qualityScore: result.quality_score || 0,
      generationTime: result.generation_time || 0,
      cost: result.cost || 0,
      model: result.model || 'unknown',
    },
    canApprove: true,
    canReject: true,
    canEdit: true,
    canExport: true,
    timestamp: new Date().toISOString(),
  };
};

/**
 * Format error message with recovery suggestions
 * Called when orchestrator encounters an error
 */
export const formatErrorMessage = (error, executionId) => {
  const errorMessage =
    typeof error === 'string' ? error : error.message || 'Unknown error';

  return {
    type: MESSAGE_TYPES.ORCHESTRATOR_ERROR,
    sender: 'orchestrator',
    direction: 'incoming',
    executionId,
    error: errorMessage,
    errorType: error.errorType || 'UNKNOWN',
    suggestion: getRecoverySuggestion(error.errorType),
    timestamp: new Date().toISOString(),
    canRetry: isRetryable(error.errorType),
    canCancel: true,
  };
};

/**
 * Get recovery suggestion based on error type
 */
const getRecoverySuggestion = (errorType) => {
  const suggestions = {
    RATE_LIMIT: 'Too many requests. Try again in a few moments.',
    TIMEOUT: 'Request timed out. Try with a simpler command.',
    MODEL_UNAVAILABLE:
      'Selected model is unavailable. Try a different model or host.',
    INVALID_PARAMETERS:
      'Invalid parameters. Please check your command and try again.',
    API_ERROR: 'API error occurred. Please try again later.',
    NETWORK_ERROR: 'Network error. Check your connection and try again.',
  };

  return suggestions[errorType] || 'An error occurred. Please try again.';
};

/**
 * Determine if an error can be retried
 */
const isRetryable = (errorType) => {
  const retryable = ['RATE_LIMIT', 'TIMEOUT', 'API_ERROR', 'NETWORK_ERROR'];
  return retryable.includes(errorType);
};

/**
 * Format regular AI conversation response
 */
export const formatAIMessage = (response, model) => {
  return {
    type: MESSAGE_TYPES.AI_MESSAGE,
    message: response,
    sender: 'AI',
    direction: 'incoming',
    model,
    timestamp: new Date().toISOString(),
  };
};

/**
 * Determine handler for incoming message based on mode
 * Routes to appropriate backend endpoint
 */
export const determineHandlerRoute = (mode, isCommand) => {
  if (mode === 'agent' && isCommand) {
    return '/api/orchestrator/command'; // Orchestrator command endpoint
  }

  return '/api/chat'; // Regular conversation endpoint
};

/**
 * Build request payload for backend
 */
export const buildRequestPayload = (
  message,
  parameters,
  mode,
  selectedModel,
  activeHost
) => {
  if (mode === 'agent') {
    return {
      command: message,
      parameters: parameters || {},
      model: selectedModel,
      host: activeHost,
      mode: 'agent',
      timestamp: new Date().toISOString(),
    };
  }

  return {
    message,
    model: selectedModel,
    host: activeHost,
    mode: 'conversation',
    conversationContext: true, // Include chat history
    timestamp: new Date().toISOString(),
  };
};

/**
 * Main message handler - orchestrates the message processing flow
 *
 * @param {string} message - User message text
 * @param {string} mode - Current mode ('agent' or 'conversation')
 * @param {string} selectedModel - Selected LLM model
 * @param {string} activeHost - Selected LLM host
 * @returns {object} Structured message object and metadata for next steps
 */
export const handleMessage = (message, mode, selectedModel, activeHost) => {
  if (!message || typeof message !== 'string') {
    return {
      error: 'Invalid message',
      messageObject: formatErrorMessage('Invalid message provided', null),
    };
  }

  // Detect if this is an orchestrator command
  const intent = detectIntentFromMessage(message);
  const isCommand = intent !== null && mode === 'agent';

  let messageObject;
  let route;
  let payload;

  if (isCommand) {
    // Parse command parameters
    const parameters = parseCommandParameters(message, intent);

    // Format as orchestrator command
    messageObject = formatCommandMessage(message, parameters, mode);
    route = determineHandlerRoute(mode, isCommand);
    payload = buildRequestPayload(
      message,
      parameters,
      mode,
      selectedModel,
      activeHost
    );
  } else {
    // Regular conversation message
    messageObject = {
      type: MESSAGE_TYPES.USER_MESSAGE,
      message,
      sender: 'user',
      direction: 'outgoing',
      timestamp: new Date().toISOString(),
    };
    route = determineHandlerRoute(mode, false);
    payload = buildRequestPayload(
      message,
      null,
      mode,
      selectedModel,
      activeHost
    );
  }

  return {
    error: null,
    messageObject,
    route,
    payload,
    isCommand,
    intent,
  };
};

/**
 * Process WebSocket status update from orchestrator
 * Formats for real-time UI display
 */
export const processStatusUpdate = (statusData) => {
  if (!statusData || !statusData.executionId) {
    return null;
  }

  return formatStatusMessage(statusData, statusData.executionId);
};

/**
 * Process orchestrator result from backend
 * Formats for approval display
 */
export const processResult = (resultData) => {
  if (!resultData || !resultData.executionId) {
    return null;
  }

  return formatResultMessage(resultData, resultData.executionId);
};

/**
 * Process orchestrator error from backend
 * Formats with recovery suggestions
 */
export const processError = (errorData) => {
  if (!errorData) {
    return null;
  }

  return formatErrorMessage(errorData, errorData.executionId || null);
};

const orchestratorChatHandler = {
  MESSAGE_TYPES,
  detectIntentFromMessage,
  parseCommandParameters,
  formatCommandMessage,
  formatStatusMessage,
  formatResultMessage,
  formatErrorMessage,
  formatAIMessage,
  determineHandlerRoute,
  buildRequestPayload,
  handleMessage,
  processStatusUpdate,
  processResult,
  processError,
};

export default orchestratorChatHandler;
