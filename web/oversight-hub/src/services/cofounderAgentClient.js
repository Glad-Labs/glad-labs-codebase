/**
 * Cofounder Agent API Client - JWT Auth
 *
 * Environment Variables (required):
 * - REACT_APP_API_URL: Backend API base URL (e.g., https://api.example.com or http://localhost:8000)
 *
 * NOTE: This service does NOT directly update Zustand store.
 * Auth state updates are handled by AuthContext only.
 * Use getAuthToken() to read current token from localStorage.
 */
import { getAuthToken } from './authService';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Log API configuration for debugging (remove in production if verbose)
if (!process.env.REACT_APP_API_URL) {
  console.warn(
    '⚠️ REACT_APP_API_URL not configured. Using localhost fallback. ' +
      'In production, set REACT_APP_API_URL environment variable.'
  );
}

function getAuthHeaders() {
  const accessToken = getAuthToken();
  const headers = { 'Content-Type': 'application/json' };
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }
  return headers;
}

async function makeRequest(
  endpoint,
  method = 'GET',
  data = null,
  retry = false,
  onUnauthorized = null,
  timeout = 30000 // 30 seconds - allows for long-running operations like Ollama generation
) {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = { method, headers: getAuthHeaders() };
    if (data) config.body = JSON.stringify(data);

    // Use AbortController to implement timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    config.signal = controller.signal;

    try {
      const response = await fetch(url, config);
      clearTimeout(timeoutId);

      if (response.status === 401 && !retry) {
        // Call the onUnauthorized callback if provided
        if (onUnauthorized) {
          onUnauthorized();
        }
        throw new Error('Unauthorized - token expired or invalid');
      }

      const result = await response.json().catch(() => response.text());
      if (!response.ok) {
        const error = new Error(result?.message || `HTTP ${response.status}`);
        error.status = response.status;
        throw error;
      }
      return result;
    } catch (fetchError) {
      clearTimeout(timeoutId);
      // Check if it's an abort error (timeout)
      if (fetchError.name === 'AbortError') {
        throw new Error(
          `Request timeout after ${timeout}ms - operation took too long`
        );
      }
      throw fetchError;
    }
  } catch (error) {
    console.error(`API request failed: ${endpoint}`, error);
    throw error;
  }
}

/**
 * NOTE: login() function removed - use AuthCallback + exchangeCodeForToken from authService instead
 * This service should NOT handle authentication state updates.
 * Authentication is managed exclusively by AuthContext.
 */

export async function logout() {
  try {
    // Attempt to notify backend of logout
    await makeRequest('/api/auth/logout', 'POST');
  } catch (error) {
    console.warn('Logout failed:', error);
    // Continue with local logout even if API call fails
  }
  // Note: Actual state clearing happens in AuthContext.logout()
}

export async function refreshAccessToken() {
  // Token refresh logic would go here
  // For now, if token is invalid, let 401 handler in component deal with it
  console.warn(
    '⚠️ Token refresh not implemented - auth flow should prevent 401s'
  );
  return false;
}

export async function getTasks(limit = 50, offset = 0) {
  return makeRequest(
    `/api/tasks?limit=${limit}&offset=${offset}`,
    'GET',
    null,
    false,
    null,
    120000
  ); // 120 second timeout
}

export async function getTaskStatus(taskId) {
  // Try new endpoint first, fall back to old endpoint
  try {
    return await makeRequest(`/api/content/blog-posts/tasks/${taskId}`, 'GET');
  } catch (error) {
    if (error.status === 404) {
      // Fall back to old endpoint
      return await makeRequest(`/api/tasks/${taskId}`, 'GET');
    }
    throw error;
  }
}

export async function pollTaskStatus(taskId, onProgress, maxWait = 3600000) {
  const startTime = Date.now();
  const pollInterval = 5000;
  return new Promise((resolve, reject) => {
    const interval = setInterval(async () => {
      try {
        const task = await getTaskStatus(taskId);
        if (onProgress) onProgress(task);
        if (task.status === 'completed' || task.status === 'failed') {
          clearInterval(interval);
          resolve(task);
        }
        if (Date.now() - startTime > maxWait) {
          clearInterval(interval);
          reject(new Error('Task polling timeout'));
        }
      } catch (error) {
        clearInterval(interval);
        reject(error);
      }
    }, pollInterval);
  });
}

export async function createBlogPost(options) {
  // Support both old and new API formats for backwards compatibility
  if (typeof options === 'string') {
    // Old format: createBlogPost(topic, primaryKeyword, targetAudience, category)
    // Use 60 second timeout for content generation
    return makeRequest(
      '/api/tasks',
      'POST',
      {
        task_name: `Blog Post: ${options}`,
        agent_id: 'content-agent',
        status: 'pending',
        topic: options,
      },
      false,
      null,
      60000 // 60 seconds for content generation
    );
  }

  // New format: createBlogPost({ topic, style, tone, ... })
  // Use 60 second timeout for content generation with Ollama
  return makeRequest(
    '/api/content/blog-posts',
    'POST',
    {
      topic: options.topic,
      style: options.style || 'technical',
      tone: options.tone || 'professional',
      target_length: options.targetLength || options.target_length || 1500,
      tags: options.tags || [],
      categories: options.categories || [],
      generate_featured_image: options.generate_featured_image !== false,
      enhanced: options.enhanced || false,
      publish_mode: options.publishMode || options.publish_mode || 'draft',
      target_environment:
        options.targetEnvironment || options.target_environment || 'production',
    },
    false,
    null,
    60000 // 60 seconds for content generation
  );
}

export async function getMetrics() {
  return makeRequest('/api/metrics', 'GET');
}

export async function publishBlogDraft(postId, environment = 'production') {
  return makeRequest(`/api/tasks/${postId}/publish`, 'PATCH', {
    environment,
    status: 'published',
  });
}

const cofounderAgentClient = {
  logout,
  refreshAccessToken,
  getTasks,
  getTaskStatus,
  pollTaskStatus,
  createBlogPost,
  publishBlogDraft,
  getMetrics,
};

export default cofounderAgentClient;
