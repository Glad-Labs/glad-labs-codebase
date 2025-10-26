/**
 * Cofounder Agent API Client - JWT Auth
 */
import useStore from '../store/useStore';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function getAuthHeaders() {
  const accessToken = useStore.getState().accessToken;
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
  retry = false
) {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = { method, headers: getAuthHeaders() };
    if (data) config.body = JSON.stringify(data);
    const response = await fetch(url, config);

    if (response.status === 401 && !retry) {
      const refreshed = await refreshAccessToken();
      if (refreshed) return makeRequest(endpoint, method, data, true);
      useStore.setState({ isAuthenticated: false, accessToken: null });
      window.location.href = '/login';
      return null;
    }

    const result = await response.json().catch(() => response.text());
    if (!response.ok) {
      const error = new Error(result?.message || `HTTP ${response.status}`);
      error.status = response.status;
      throw error;
    }
    return result;
  } catch (error) {
    console.error(`API request failed: ${endpoint}`, error);
    throw error;
  }
}

export async function login(email, password) {
  const response = await makeRequest('/api/auth/login', 'POST', {
    email,
    password,
  });
  if (response.success && response.access_token) {
    useStore.setState({
      accessToken: response.access_token,
      refreshToken: response.refresh_token,
      user: response.user,
      isAuthenticated: true,
    });
  }
  return response;
}

export async function logout() {
  try {
    await makeRequest('/api/auth/logout', 'POST');
  } catch (error) {
    console.warn('Logout failed:', error);
  } finally {
    useStore.setState({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
      tasks: [],
    });
  }
}

export async function refreshAccessToken() {
  try {
    const refreshToken = useStore.getState().refreshToken;
    if (!refreshToken) return false;
    const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
    if (response.ok) {
      const data = await response.json();
      useStore.setState({ accessToken: data.access_token });
      return true;
    }
    return false;
  } catch (error) {
    console.error('Token refresh error:', error);
    return false;
  }
}

export async function getTasks(limit = 50, offset = 0) {
  return makeRequest(`/api/tasks?limit=${limit}&offset=${offset}`, 'GET');
}

export async function getTaskStatus(taskId) {
  return makeRequest(`/api/tasks/${taskId}`, 'GET');
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

export async function createBlogPost(
  topic,
  primaryKeyword,
  targetAudience,
  category
) {
  return makeRequest('/api/tasks', 'POST', {
    task_name: `Blog Post: ${topic}`,
    agent_id: 'content-agent',
    status: 'pending',
    topic,
    primary_keyword: primaryKeyword,
    target_audience: targetAudience,
    category,
  });
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
  login,
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
