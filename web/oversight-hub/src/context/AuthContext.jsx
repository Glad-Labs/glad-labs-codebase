/**
 * AuthContext - Global authentication state
 * Ensures auth state is consistent across entire app
 */

import React, { createContext, useState, useEffect, useCallback } from 'react';
import {
  verifySession,
  logout as authLogout,
  getStoredUser,
} from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state ONCE on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // First check if user is stored in localStorage (from recent login)
        const storedUser = getStoredUser();
        if (storedUser) {
          setUser(storedUser);
          setLoading(false);
          return;
        }

        // If no stored user, try to verify with backend
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

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    logout,
    setAuthUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
