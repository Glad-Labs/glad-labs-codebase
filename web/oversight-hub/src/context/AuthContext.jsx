/**
 * AuthContext - Global authentication state
 * Syncs with Zustand store to keep auth state consistent across entire app
 */

import React, { createContext, useState, useEffect, useCallback } from 'react';
import {
  logout as authLogout,
  getStoredUser,
  getAuthToken,
} from '../services/authService';
import useStore from '../store/useStore';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get Zustand store functions
  const setStoreUser = useStore((state) => state.setUser);
  const setStoreIsAuthenticated = useStore((state) => state.setIsAuthenticated);
  const setStoreAccessToken = useStore((state) => state.setAccessToken);
  const storeLogout = useStore((state) => state.logout);

  // Initialize auth state ONCE on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log(
          '🔐 [AuthContext] Starting authentication initialization...'
        );
        const startTime = Date.now();

        // First check if user is stored in localStorage (from recent login)
        const storedUser = getStoredUser();
        const token = getAuthToken();

        if (storedUser && token) {
          console.log(
            '✅ [AuthContext] Found stored user and token, using cached session'
          );
          // Sync EVERYTHING to Zustand FIRST before setting loading to false
          setStoreUser(storedUser);
          setStoreIsAuthenticated(true);
          setStoreAccessToken(token);
          // THEN set context state
          setUser(storedUser);
          setError(null);
          // FINALLY set loading to false (all state is ready)
          setLoading(false);
          const elapsed = Date.now() - startTime;
          console.log(
            `✅ [AuthContext] Initialization complete (${elapsed}ms)`
          );
          return;
        }

        // If no stored user, don't try backend verify - just proceed as not authenticated
        // This prevents 30-second delays on first load
        console.log('🔍 [AuthContext] No cached session - user needs to login');
        setStoreIsAuthenticated(false);
        setUser(null);
        setError(null);
        setLoading(false);
        const elapsed = Date.now() - startTime;
        console.log(`✅ [AuthContext] Initialization complete (${elapsed}ms)`);
      } catch (err) {
        console.error('❌ [AuthContext] Initialization error:', err);
        setError(err.message);
        setStoreIsAuthenticated(false);
        setUser(null);
        setLoading(false);
      }
    };

    initializeAuth();
  }, [setStoreUser, setStoreIsAuthenticated, setStoreAccessToken]);

  // Logout handler - sync with both AuthContext and Zustand
  const logout = useCallback(async () => {
    try {
      console.log('🚪 [AuthContext] Logging out...');
      await authLogout();
      setUser(null);
      storeLogout(); // Clear Zustand store
      console.log('✅ [AuthContext] Logout complete');
    } catch (err) {
      console.error('❌ [AuthContext] Logout error:', err);
      setError(err.message);
    }
  }, [storeLogout]);

  // Set user after login - sync with both context and Zustand
  const setAuthUser = useCallback(
    (userData) => {
      console.log('👤 [AuthContext] Setting user:', userData?.login);
      setUser(userData);
      setStoreUser(userData);
      setStoreIsAuthenticated(!!userData);
      if (userData) {
        const token = getAuthToken();
        if (token) {
          setStoreAccessToken(token);
        }
      }
    },
    [setStoreUser, setStoreIsAuthenticated, setStoreAccessToken]
  );

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
