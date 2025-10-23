/**
 * Cofounder Agent API Client
 * Handles all communication with the cofounder_agent (FastAPI backend)
 * Manages authentication, polling, error handling, and request/response formatting
 */

// API Configuration
const API_BASE_URL =
  process.env.REACT_APP_COFOUNDER_AGENT_URL || 'http://localhost:8000/api/v1';
const API_KEY = process.env.REACT_APP_COFOUNDER_AGENT_KEY || 'dev-key';
const POLL_INTERVAL = 3000; // Poll every 3 seconds
const MAX_POLL_ATTEMPTS = 120; // Maximum 10 minutes of polling

// Request configuration
const defaultHeaders = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${API_KEY}`,
};

/**
 * Make HTTP request to cofounder agent
 */
async function makeRequest(endpoint, method = 'GET', data = null) {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      method,
      headers: defaultHeaders,
    };

    if (data) {
      config.body = JSON.stringify(data);
    }

    const response = await fetch(url, config);

    // Handle non-JSON responses
    const contentType = response.headers.get('content-type');
    let result;
    if (contentType && contentType.includes('application/json')) {
      result = await response.json();
    } else {
      result = await response.text();
    }

    // Handle HTTP errors
    if (!response.ok) {
      const error = new Error(
        result?.message || `API Error: ${response.status}`
      );
      error.status = response.status;
      error.data = result;
      throw error;
    }

    return result;
  } catch (error) {
    console.error(`API request failed: ${endpoint}`, error);
    throw error;
  }
}

/**
 * Create a new blog post (async)
 * Returns immediately with task_id, use pollTaskStatus to check progress
 */
export async function createBlogPost(params) {
  const payload = {
    topic: params.topic,
    style: params.style || 'technical',
    tone: params.tone || 'professional',
    target_length: params.targetLength || 1500,
    tags: params.tags || [],
    categories: params.categories || [],
    featured_image_prompt: params.featuredImagePrompt || null,
    publish_mode: params.publishMode || 'draft',
    target_strapi_environment: params.targetEnvironment || 'production',
  };

  return makeRequest('/content/create-blog-post', 'POST', payload);
}

/**
 * Poll task status until completion
 * Returns task info with progress, result, or error
 */
export async function pollTaskStatus(taskId, onProgress = null) {
  let attempts = 0;

  return new Promise((resolve, reject) => {
    const poll = async () => {
      try {
        if (attempts >= MAX_POLL_ATTEMPTS) {
          reject(new Error('Task polling timeout (10 minutes exceeded)'));
          return;
        }

        const task = await makeRequest(`/content/tasks/${taskId}`);

        // Call progress callback if provided
        if (onProgress) {
          onProgress(task);
        }

        // Check if task is complete
        if (task.status === 'completed' || task.status === 'failed') {
          resolve(task);
          return;
        }

        // Continue polling
        attempts++;
        setTimeout(poll, POLL_INTERVAL);
      } catch (error) {
        reject(error);
      }
    };

    poll();
  });
}

/**
 * Create blog post and wait for completion
 * Combines createBlogPost + pollTaskStatus into one call
 */
export async function createBlogPostAndWait(params, onProgress = null) {
  try {
    // Start generation
    const response = await createBlogPost(params);
    const taskId = response.task_id;

    // Poll until complete
    const result = await pollTaskStatus(taskId, onProgress);

    return result;
  } catch (error) {
    console.error('Error creating blog post:', error);
    throw error;
  }
}

/**
 * Get list of blog drafts
 */
export async function listBlogDrafts(limit = 20, offset = 0) {
  return makeRequest(`/content/drafts?limit=${limit}&offset=${offset}`);
}

/**
 * Publish a blog draft to Strapi
 */
export async function publishBlogDraft(
  draftId,
  targetEnvironment = 'production'
) {
  const payload = {
    target_strapi_environment: targetEnvironment,
    scheduled_for: null,
  };

  return makeRequest(`/content/drafts/${draftId}/publish`, 'POST', payload);
}

/**
 * Delete a blog draft
 */
export async function deleteBlogDraft(draftId) {
  return makeRequest(`/content/drafts/${draftId}`, 'DELETE');
}

/**
 * Send a command to the cofounder agent
 */
export async function sendCommand(command, context = null) {
  const payload = {
    command,
    context,
    priority: 'normal',
  };

  return makeRequest('/command', 'POST', payload);
}

/**
 * Get agent status
 */
export async function getAgentStatus() {
  return makeRequest('/status');
}

/**
 * Format API error message for display
 */
export function formatErrorMessage(error) {
  if (error.data?.details) {
    return error.data.details;
  }
  if (error.data?.message) {
    return error.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
}

/**
 * Check if API is reachable
 */
export async function checkAPIHealth() {
  try {
    const status = await getAgentStatus();
    return status?.status === 'online';
  } catch (error) {
    console.warn('API health check failed:', error);
    return false;
  }
}

const cofounderAgentClient = {
  createBlogPost,
  pollTaskStatus,
  createBlogPostAndWait,
  listBlogDrafts,
  publishBlogDraft,
  deleteBlogDraft,
  sendCommand,
  getAgentStatus,
  formatErrorMessage,
  checkAPIHealth,
};

export default cofounderAgentClient;
