/**
 * Mock GitHub OAuth Authentication Service
 * For local development - simulates GitHub OAuth flow without needing real credentials
 *
 * To use: Set REACT_APP_USE_MOCK_AUTH=true in .env.local
 */

/**
 * Mock GitHub OAuth - simulates authorization redirect
 * In production, this would redirect to github.com
 * In development, we skip GitHub and go straight to callback
 */
export const generateMockGitHubAuthURL = (clientId) => {
  // Simulate what GitHub would do - generate a mock authorization code
  const mockCode = 'mock_auth_code_' + Math.random().toString(36).substring(7);

  // Store the code for the callback to retrieve
  sessionStorage.setItem('mock_auth_code', mockCode);

  // In real flow, this would be:
  // https://github.com/login/oauth/authorize?client_id=...
  // But in mock mode, we redirect directly to callback with the code
  return `${window.location.origin}/auth/callback?code=${mockCode}&state=mock_state`;
};

/**
 * Mock token exchange - simulates GitHub's token endpoint
 * Returns a fake user and token
 */
export const exchangeCodeForToken = async (code) => {
  try {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Check if this is a mock code
    if (!code.startsWith('mock_auth_code_')) {
      throw new Error('Invalid mock auth code');
    }

    // Simulate a successful token response
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
  } catch (error) {
    console.error('Error in mock token exchange:', error);
    throw error;
  }
};

/**
 * Mock session verification
 */
export const verifySession = async () => {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      return null;
    }

    // If token exists, consider session valid
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error verifying mock session:', error);
    return null;
  }
};

/**
 * Logout - removes stored credentials
 */
export const logout = async () => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user');
  sessionStorage.removeItem('mock_auth_code');
};
