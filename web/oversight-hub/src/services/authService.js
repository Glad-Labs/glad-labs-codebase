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
    // Check if this is a mock code (for development)
    if (code && code.startsWith('mock_auth_code_')) {
      // Handle mock auth
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay

      const mockUser = {
        id: 'mock_user_12345',
        login: 'dev-user',
        email: 'dev@example.com',
        name: 'Development User',
        avatar_url: 'https://avatars.githubusercontent.com/u/1?v=4',
      };

      const mockToken =
        'mock_jwt_token_' + Math.random().toString(36).substring(2, 15);

      // Store token and user data
      localStorage.setItem('auth_token', mockToken);
      localStorage.setItem('user', JSON.stringify(mockUser));

      return {
        token: mockToken,
        user: mockUser,
      };
    }

    // Real GitHub OAuth
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
    const user = localStorage.getItem('user');

    if (!token) return null;

    // For mock tokens (development/testing), trust the stored user
    if (token.startsWith('mock_jwt_token_')) {
      try {
        return user ? JSON.parse(user) : null;
      } catch (e) {
        return null;
      }
    }

    // For real tokens, verify with backend
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

// ============================================================================
// Enhanced OAuth Functions (FastAPI Backend Compatible)
// ============================================================================

/**
 * Get available OAuth providers from backend
 * @returns {Promise<array>} List of available providers
 */
export async function getAvailableOAuthProviders() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/providers`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch OAuth providers: ${response.statusText}`);
    }

    const data = await response.json();
    return data.providers || [];
  } catch (error) {
    console.error('Error fetching OAuth providers:', error);
    return [];
  }
}

/**
 * Get login URL for OAuth provider
 * @param {string} provider - Provider name (github, google, etc)
 * @returns {Promise<string>} OAuth login URL
 */
export async function getOAuthLoginURL(provider) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/${provider}/login`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to get OAuth login URL: ${response.statusText}`);
    }

    const data = await response.json();
    return data.login_url;
  } catch (error) {
    console.error(`Error getting ${provider} login URL:`, error);
    throw error;
  }
}

/**
 * Handle OAuth callback - NEW FastAPI endpoint
 * @param {string} provider - OAuth provider
 * @param {string} code - Authorization code
 * @param {string} state - State parameter for CSRF verification
 * @returns {Promise<object>} User data and tokens {user, token, refresh_token}
 */
export async function handleOAuthCallbackNew(provider, code, state) {
  try {
    // Verify CSRF state
    const storedState = sessionStorage.getItem('oauth_state');
    if (storedState && storedState !== state) {
      throw new Error('CSRF state mismatch - potential security breach');
    }

    const response = await fetch(`${API_BASE_URL}/api/auth/${provider}/callback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, state }),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`OAuth callback failed: ${response.statusText}`);
    }

    const data = await response.json();

    // Store tokens
    if (data.token) {
      localStorage.setItem('auth_token', data.token);
    }
    if (data.refresh_token) {
      localStorage.setItem('refresh_token', data.refresh_token);
    }
    if (data.user) {
      localStorage.setItem('user', JSON.stringify(data.user));
    }

    // Clear state
    sessionStorage.removeItem('oauth_state');

    return data;
  } catch (error) {
    console.error(`Error handling ${provider} callback:`, error);
    throw error;
  }
}

/**
 * Validate token is still valid and get current user
 * @returns {Promise<object>} Current user data
 */
export async function validateAndGetCurrentUser() {
  try {
    const token = getAuthToken();
    if (!token) return null;

    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token expired
        await logout();
        return null;
      }
      throw new Error(`Failed to validate user: ${response.statusText}`);
    }

    const data = await response.json();
    if (data.user) {
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data.user;
  } catch (error) {
    console.error('Error validating user:', error);
    return null;
  }
}

/**
 * Clear authentication (alias for logout)
 * @returns {Promise<void>}
 */
export async function clearAuth() {
  return logout();
}

/**
 * Check if user is authenticated
 * @returns {boolean}
 */
export function isAuthenticated() {
  return !!getAuthToken();
}
