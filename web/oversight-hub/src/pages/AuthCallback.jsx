/**
 * OAuth Callback Handler
 * Processes GitHub OAuth callback and exchanges code for token
 */

import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { exchangeCodeForToken } from '../services/authService';
import useAuth from '../hooks/useAuth';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setAuthUser } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');

        // Check for errors
        if (error) {
          console.error('OAuth error:', error);
          navigate('/login');
          return;
        }

        // For mock auth, skip state verification
        const isMockAuth = code && code.startsWith('mock_auth_code_');

        // Verify state for CSRF protection (skip for mock auth)
        if (!isMockAuth) {
          const storedState = sessionStorage.getItem('oauth_state');
          if (state !== storedState) {
            console.error('State mismatch - possible CSRF attack');
            navigate('/login');
            return;
          }
        }

        // Exchange code for token
        if (code) {
          const data = await exchangeCodeForToken(code);
          setAuthUser(data.user);

          // Clear state
          sessionStorage.removeItem('oauth_state');

          // Redirect to dashboard
          navigate('/', { replace: true });
        }
      } catch (error) {
        console.error('Error handling OAuth callback:', error);
        navigate('/login');
      }
    };

    handleCallback();
  }, [searchParams, navigate, setAuthUser]);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <div style={{ textAlign: 'center', color: 'white' }}>
        <h2>Authenticating...</h2>
        <p>Please wait while we verify your credentials.</p>
      </div>
    </div>
  );
};

export default AuthCallback;
