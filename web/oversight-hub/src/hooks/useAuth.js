/**
 * useAuth Hook
 * Custom hook for managing authentication state and actions
 */

import { useState, useEffect, useCallback } from 'react';
import { verifySession, logout as authLogout } from '../services/authService';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Try to verify existing session
        const userData = await verifySession();
        if (userData) {
          setUser(userData);
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Logout handler
  const logout = useCallback(async () => {
    try {
      await authLogout();
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
      setError(err.message);
    }
  }, []);

  // Set user after login
  const setAuthUser = useCallback((userData) => {
    setUser(userData);
  }, []);

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    logout,
    setAuthUser,
  };
};

export default useAuth;
