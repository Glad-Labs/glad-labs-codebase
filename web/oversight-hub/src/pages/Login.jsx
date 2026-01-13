import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateGitHubAuthURL } from '../services/authService';
import { generateMockGitHubAuthURL } from '../services/mockAuthService';
import useAuth from '../hooks/useAuth';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const clientId = process.env.REACT_APP_GH_OAUTH_CLIENT_ID;
  const useMockAuth = process.env.REACT_APP_USE_MOCK_AUTH === 'true';
  const [debugInfo, setDebugInfo] = useState('');

  useEffect(() => {
    const info = {
      clientId: clientId ? 'Set' : 'NOT SET',
      mockAuth: useMockAuth ? 'ENABLED' : 'DISABLED',
    };
    setDebugInfo(JSON.stringify(info, null, 2));
  }, [clientId, useMockAuth]);

  useEffect(() => {
    if (isAuthenticated) navigate('/');
  }, [isAuthenticated, navigate]);

  const handleGitHubLogin = () => {
    if (useMockAuth) {
      window.location.href = generateMockGitHubAuthURL(clientId || 'mock_id');
    } else {
      if (!clientId) {
        alert('GitHub Client ID not configured');
        return;
      }
      window.location.href = generateGitHubAuthURL(clientId);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Glad Labs</h1>
          <h2>Oversight Hub</h2>
        </div>
        <div className="login-body">
          <button
            className="github-login-btn"
            onClick={handleGitHubLogin}
            type="button"
          >
            {useMockAuth ? 'Sign in (Mock)' : 'Sign in with GitHub'}
          </button>
          <div style={{ marginTop: '20px', fontSize: '11px', opacity: 0.5 }}>
            <pre>{debugInfo}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
