/**
 * OAuth Callback Handler Component
 * Processes OAuth redirect from external provider (GitHub, Google, etc)
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Alert, Typography } from '@mui/material';
import * as authService from '../services/authService';

function OAuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get URL parameters
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        const state = params.get('state');
        const provider = params.get('provider') || 'github'; // Default to GitHub

        if (!code) {
          throw new Error('No authorization code received from provider');
        }

        // Exchange code for token
        console.log(`Processing ${provider} OAuth callback...`);
        const result = await authService.handleOAuthCallbackNew(
          provider,
          code,
          state
        );

        if (!result.token) {
          throw new Error('No token received from server');
        }

        console.log('✅ OAuth authentication successful');

        // Redirect to dashboard after short delay (allow state to update)
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 500);
      } catch (err) {
        console.error('❌ OAuth callback error:', err);
        setError(err.message || 'Authentication failed');
        setLoading(false);
      }
    };

    handleCallback();
  }, [navigate]);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          gap: 2,
        }}
      >
        <CircularProgress />
        <Typography variant="h6">Processing authentication...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          gap: 2,
          px: 2,
        }}
      >
        <Alert severity="error" sx={{ maxWidth: 500 }}>
          <Typography variant="h6">Authentication Error</Typography>
          <Typography variant="body2">{error}</Typography>
        </Alert>
        <button
          onClick={() => navigate('/login', { replace: true })}
          style={{
            padding: '10px 20px',
            backgroundColor: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          Back to Login
        </button>
      </Box>
    );
  }

  return null;
}

export default OAuthCallback;
