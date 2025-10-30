/**
 * GitHub OAuth Authentication Service
 * Handles OAuth flow, token exchange, and user verification
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

/**
 * Generate GitHub OAuth authorization URL
 * @param {string} clientId - GitHub OAuth Client ID
 * @returns {string} - Authorization URL
 */
export const generateGitHubAuthURL = (clientId) => {
  const redirectUri = `${window.location.origin}/auth/callback`;
  const scope = 'user:email';
  const state = Math.random().toString(36).substring(7); // Simple state for CSRF protection

  // Store state in session storage for verification
  sessionStorage.setItem('oauth_state', state);

  return `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&state=${state}`;
};

/**
 * Exchange GitHub authorization code for access token
 * @param {string} code - Authorization code from GitHub
 * @returns {Promise<object>} - User data and token
 */
export const exchangeCodeForToken = async (code) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/github-callback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
      credentials: 'include', // Include cookies for session
    });

    if (!response.ok) {
      throw new Error(`Authentication failed: ${response.statusText}`);
    }

    const data = await response.json();

    // Store token and user data
    if (data.token) {
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }

    return data;
  } catch (error) {
    console.error('Error exchanging code for token:', error);
    throw error;
  }
};

/**
 * Verify current session is valid
 * @returns {Promise<object|null>} - User data if valid, null otherwise
 */
export const verifySession = async () => {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) return null;

    const response = await fetch(`${API_BASE_URL}/api/auth/verify`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      // Token invalid, clear storage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      return null;
    }

    const data = await response.json();
    return data.user;
  } catch (error) {
    console.error('Error verifying session:', error);
    return null;
  }
};

/**
 * Logout user - clear tokens and user data
 * @returns {Promise<void>}
 */
export const logout = async () => {
  try {
    const token = localStorage.getItem('auth_token');

    if (token) {
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
    }

    // Clear local storage regardless of API response
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('oauth_state');
  } catch (error) {
    console.error('Error during logout:', error);
    // Still clear local storage even if API call fails
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  }
};

/**
 * Get stored user data
 * @returns {object|null} - Parsed user object or null
 */
export const getStoredUser = () => {
  const userStr = localStorage.getItem('user');
  try {
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
};

/**
 * Get stored auth token
 * @returns {string|null} - Auth token or null
 */
export const getAuthToken = () => {
  return localStorage.getItem('auth_token');
};

/**
 * Make authenticated API request
 * @param {string} endpoint - API endpoint (relative to API_BASE_URL)
 * @param {object} options - Fetch options
 * @returns {Promise<object>} - Response data
 */
export const authenticatedFetch = async (endpoint, options = {}) => {
  const token = getAuthToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  if (response.status === 401) {
    // Token expired or invalid
    await logout();
    window.location.href = '/login';
    throw new Error('Session expired');
  }

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  return response.json();
};

const authService = {
  generateGitHubAuthURL,
  exchangeCodeForToken,
  verifySession,
  logout,
  getStoredUser,
  getAuthToken,
  authenticatedFetch,
};

export default authService;
