/**
 * LoginForm.jsx
 *
 * Complete React component for user authentication with:
 * - Username/email input
 * - Password input
 * - TOTP 2FA support (when required)
 * - Remember me functionality
 * - Error handling and display
 * - Loading states
 * - Session management
 * - Token refresh handling
 * - Social login ready (OAuth integration points)
 *
 * API Integration: Connects to authentication endpoints
 * - POST /api/auth/login - Initial login with credentials
 * - POST /api/auth/verify-2fa - Verify TOTP code
 * - POST /api/auth/refresh - Refresh JWT token
 *
 * @component
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  CircularProgress,
  Container,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Link,
  TextField,
  Typography,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Paper,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  VpnKey as VpnKeyIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import useStore from '../store/useStore';
import './LoginForm.css';

/**
 * API Service for Authentication
 */
const authAPI = {
  /**
   * Perform initial login with credentials
   * @param {string} email - User email or username
   * @param {string} password - User password
   * @returns {Promise<Object>} - Login response with tokens or 2FA challenge
   */
  login: async (email, password) => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/auth/login`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      }
    );
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Login failed');
    }
    return response.json();
  },

  /**
   * Verify TOTP 2FA code
   * @param {string} email - User email
   * @param {string} code - TOTP code (6 digits)
   * @param {string} challenge - 2FA challenge token from initial login
   * @returns {Promise<Object>} - Tokens on successful verification
   */
  verify2FA: async (email, code, challenge) => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/auth/verify-2fa`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          code,
          challenge,
        }),
      }
    );
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || '2FA verification failed');
    }
    return response.json();
  },

  /**
   * Refresh JWT token
   * @param {string} refreshToken - Refresh token
   * @returns {Promise<Object>} - New access token
   */
  refreshToken: async (refreshToken) => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/auth/refresh`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error('Token refresh failed');
    }
    return response.json();
  },
};

/**
 * LoginForm Component
 * Handles user authentication with optional 2FA
 */
function LoginForm({
  onLoginSuccess = null,
  onLoginError = null,
  redirectOnSuccess = true,
}) {
  const navigate = useNavigate();

  // Login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // 2FA state
  const [require2FA, setRequire2FA] = useState(false);
  const [twoFACode, setTwoFACode] = useState('');
  const [twoFAChallenge, setTwoFAChallenge] = useState(null);
  const [backupCodes, setBackupCodes] = useState([]);

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  // Dialog states
  const [showBackupCodesDialog, setShowBackupCodesDialog] = useState(false);

  /**
   * Handle password visibility toggle
   */
  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  /**
   * Validate email format
   */
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) || /^[a-zA-Z0-9_]+$/.test(email); // Allow username too
  };

  /**
   * Validate form data
   */
  const validateLoginForm = () => {
    if (!email.trim()) {
      setError('Email or username is required');
      return false;
    }
    if (!isValidEmail(email)) {
      setError('Please enter a valid email or username');
      return false;
    }
    if (!password) {
      setError('Password is required');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    return true;
  };

  /**
   * Validate 2FA code
   */
  const validate2FACode = () => {
    if (!twoFACode) {
      setError('2FA code is required');
      return false;
    }
    if (!/^\d{6}$/.test(twoFACode)) {
      setError('2FA code must be 6 digits');
      return false;
    }
    return true;
  };

  /**
   * Handle initial login
   */
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateLoginForm()) {
      return;
    }

    try {
      setLoading(true);
      const response = await authAPI.login(email, password);

      // Save credentials if remember me is checked
      if (rememberMe) {
        localStorage.setItem('rememberEmail', email);
      } else {
        localStorage.removeItem('rememberEmail');
      }

      // Check if 2FA is required
      if (response.requires_2fa) {
        setRequire2FA(true);
        setTwoFAChallenge(response.challenge);
        setActiveStep(1);
        setBackupCodes(response.backup_codes || []);
      } else {
        // Login successful without 2FA
        handleLoginSuccess(response);
      }
    } catch (err) {
      setError(err.message);
      if (onLoginError) {
        onLoginError(err);
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle 2FA verification
   */
  const handleVerify2FA = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validate2FACode()) {
      return;
    }

    try {
      setLoading(true);
      const response = await authAPI.verify2FA(
        email,
        twoFACode,
        twoFAChallenge
      );
      handleLoginSuccess(response);
    } catch (err) {
      setError(err.message);
      // Try once more - they may have used a backup code
      if (err.message.includes('backup')) {
        setShowBackupCodesDialog(true);
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle successful login
   */
  const handleLoginSuccess = (response) => {
    setSuccess(true);
    setActiveStep(2);

    // Store tokens in localStorage or sessionStorage
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem('token', response.access_token);
    if (response.refresh_token) {
      storage.setItem('refreshToken', response.refresh_token);
    }
    storage.setItem('userEmail', email);

    // Store user info if available
    if (response.user) {
      storage.setItem('userRole', response.user.role);
      storage.setItem('userId', response.user.id);
    }

    // ===== UPDATE ZUSTAND STORE =====
    useStore.setState({
      accessToken: response.access_token,
      refreshToken: response.refresh_token || null,
      user: response.user || null,
      isAuthenticated: true,
    });

    // Callback or redirect
    if (onLoginSuccess) {
      onLoginSuccess(response);
    } else if (redirectOnSuccess) {
      setTimeout(() => {
        navigate('/');
      }, 2000);
    }

    // Reset form
    setTimeout(() => {
      setEmail('');
      setPassword('');
      setTwoFACode('');
      setRequire2FA(false);
      setActiveStep(0);
    }, 2000);
  };

  /**
   * Handle back to login from 2FA
   */
  const handleBackToLogin = () => {
    setRequire2FA(false);
    setTwoFACode('');
    setTwoFAChallenge(null);
    setError(null);
    setActiveStep(0);
  };

  /**
   * Load remembered email on mount
   */
  useEffect(() => {
    const rememberEmail = localStorage.getItem('rememberEmail');
    if (rememberEmail) {
      setEmail(rememberEmail);
      setRememberMe(true);
    }
  }, []);

  /**
   * Steps for stepper
   */
  const steps = [
    { label: 'Login', icon: <EmailIcon /> },
    { label: '2FA Verification', icon: <VpnKeyIcon /> },
    { label: 'Success', icon: <CheckCircleIcon /> },
  ];

  return (
    <Container maxWidth="sm" className="login-form-container">
      {/* Login Card */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          justifyContent: 'center',
        }}
      >
        <Card className="login-card" elevation={3}>
          {/* Header */}
          <CardHeader
            title={
              <Typography
                variant="h4"
                component="h1"
                sx={{ fontWeight: 'bold' }}
              >
                {success
                  ? 'Welcome!'
                  : require2FA
                    ? '2FA Verification'
                    : 'Sign In'}
              </Typography>
            }
            subheader={
              success
                ? 'You have been successfully authenticated'
                : require2FA
                  ? 'Enter your 2FA code'
                  : 'Enter your credentials to continue'
            }
            sx={{ textAlign: 'center', pb: 2 }}
          />

          {/* Stepper */}
          <Box sx={{ px: 3, mb: 3 }}>
            <Stepper activeStep={activeStep} sx={{ mb: 2 }}>
              {steps.map((step, index) => (
                <Step key={step.label} completed={activeStep > index}>
                  <StepLabel icon={step.icon}>{step.label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>

          <CardContent sx={{ pt: 0 }}>
            {/* Error Alert */}
            {error && (
              <Alert
                severity="error"
                onClose={() => setError(null)}
                sx={{ mb: 2 }}
              >
                {error}
              </Alert>
            )}

            {/* Success Message */}
            {success && (
              <Alert
                severity="success"
                icon={<CheckCircleIcon />}
                sx={{ mb: 2 }}
              >
                Login successful! Redirecting...
              </Alert>
            )}

            {/* Login Form */}
            {!require2FA && !success && (
              <form onSubmit={handleLogin}>
                {/* Email/Username Field */}
                <TextField
                  fullWidth
                  label="Email or Username"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  variant="outlined"
                  margin="normal"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon />
                      </InputAdornment>
                    ),
                  }}
                  placeholder="you@example.com or username"
                  autoFocus
                  autoComplete="email"
                />

                {/* Password Field */}
                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  variant="outlined"
                  margin="normal"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleTogglePasswordVisibility}
                          edge="end"
                          disabled={loading}
                        >
                          {showPassword ? (
                            <VisibilityOffIcon />
                          ) : (
                            <VisibilityIcon />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />

                {/* Remember Me Checkbox */}
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      disabled={loading}
                    />
                  }
                  label="Remember me"
                  sx={{ mt: 2, mb: 2 }}
                />

                {/* Forgot Password Link */}
                <Box sx={{ mb: 2 }}>
                  <Link href="/forgot-password" sx={{ fontSize: '0.875rem' }}>
                    Forgot your password?
                  </Link>
                </Box>

                {/* Submit Button */}
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  type="submit"
                  disabled={loading || !email || !password}
                  sx={{ mb: 2, position: 'relative' }}
                >
                  {loading ? (
                    <>
                      <CircularProgress size={24} sx={{ mr: 1 }} />
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>

                {/* Divider */}
                <Divider sx={{ my: 2 }}>OR</Divider>

                {/* Social Login Buttons (Ready for OAuth integration) */}
                <Button
                  fullWidth
                  variant="outlined"
                  disabled={loading}
                  sx={{ mb: 1 }}
                >
                  Continue with Google
                </Button>

                <Button
                  fullWidth
                  variant="outlined"
                  disabled={loading}
                  sx={{ mb: 2 }}
                >
                  Continue with GitHub
                </Button>

                {/* Sign Up Link */}
                <Typography variant="body2" align="center">
                  Don't have an account?{' '}
                  <Link href="/signup" sx={{ fontWeight: 'bold' }}>
                    Sign up
                  </Link>
                </Typography>
              </form>
            )}

            {/* 2FA Form */}
            {require2FA && !success && (
              <form onSubmit={handleVerify2FA}>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ mb: 2 }}
                >
                  A verification code has been sent to your authenticator app.
                </Typography>

                {/* 2FA Code Field */}
                <TextField
                  fullWidth
                  label="6-Digit Code"
                  type="text"
                  value={twoFACode}
                  onChange={(e) =>
                    setTwoFACode(e.target.value.replace(/\D/g, '').slice(0, 6))
                  }
                  disabled={loading}
                  variant="outlined"
                  margin="normal"
                  inputProps={{
                    maxLength: 6,
                    pattern: '[0-9]*',
                    autoComplete: 'one-time-code',
                    style: {
                      letterSpacing: '0.5rem',
                      textAlign: 'center',
                      fontSize: '1.5rem',
                    },
                  }}
                  placeholder="000000"
                  autoFocus
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <VpnKeyIcon />
                      </InputAdornment>
                    ),
                  }}
                />

                <Typography
                  variant="caption"
                  color="textSecondary"
                  sx={{ mt: 1, mb: 2, display: 'block' }}
                >
                  You can also use a backup code if you don't have access to
                  your authenticator.
                </Typography>

                {/* Submit Button */}
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  type="submit"
                  disabled={loading || twoFACode.length !== 6}
                  sx={{ mb: 2 }}
                >
                  {loading ? (
                    <>
                      <CircularProgress size={24} sx={{ mr: 1 }} />
                      Verifying...
                    </>
                  ) : (
                    'Verify Code'
                  )}
                </Button>

                {/* Back Button */}
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={handleBackToLogin}
                  disabled={loading}
                >
                  Back to Login
                </Button>
              </form>
            )}

            {/* Success State */}
            {success && (
              <Box sx={{ textAlign: 'center', py: 2 }}>
                <CheckCircleIcon
                  sx={{ fontSize: 60, color: 'success.main', mb: 2 }}
                />
                <Typography variant="body1" sx={{ mb: 1 }}>
                  Login successful!
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {redirectOnSuccess
                    ? 'Redirecting to dashboard...'
                    : 'You can close this window.'}
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <Typography
          variant="caption"
          align="center"
          sx={{ mt: 3, color: 'textSecondary' }}
        >
          Protected by enterprise-grade security. © 2025 GLAD Labs.
        </Typography>
      </Box>

      {/* Backup Codes Dialog */}
      <Dialog
        open={showBackupCodesDialog}
        onClose={() => setShowBackupCodesDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Use Backup Code</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Enter one of your backup codes instead of your 2FA code:
          </Typography>
          <Paper sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
            {backupCodes.map((code, index) => (
              <Typography
                key={index}
                variant="monospace"
                sx={{ fontSize: '0.9rem', mb: 1 }}
              >
                {code}
              </Typography>
            ))}
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowBackupCodesDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default LoginForm;
