/**
 * AuthContext - Global authentication state
 * Syncs with Zustand store to keep auth state consistent across entire app
 */

import React, { createContext, useState, useEffect, useCallback } from 'react';
import {
  logout as authLogout,
  getStoredUser,
  getAuthToken,
  initializeDevToken,
  handleOAuthCallbackNew,
  validateAndGetCurrentUser,
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

        // Initialize dev token for local development if needed
        if (process.env.NODE_ENV === 'development') {
          console.log('[AuthContext] 🔧 Initializing development token...');
          try {
            await initializeDevToken();
            console.log(
              '[AuthContext] ✅ Development token initialized successfully'
            );
          } catch (tokenError) {
            console.error(
              '[AuthContext] ❌ Development token initialization failed:',
              tokenError
            );
          }
          // Small delay to ensure localStorage write is complete
          await new Promise((resolve) => setTimeout(resolve, 10));
        }

        // First check if user is stored in localStorage (from recent login OR dev init)
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

        // No user/token found - this is normal for production (user not logged in)
        // In development, this should NOT happen since initializeDevToken creates them
        if (process.env.NODE_ENV === 'development') {
          console.warn(
            '⚠️ [AuthContext] Development token initialization may have failed, no token in localStorage'
          );
        } else {
          console.log(
            '🔍 [AuthContext] No cached session - user needs to login'
          );
        }

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

  // OAuth callback handler
  const handleOAuthCallback = useCallback(
    async (provider, code, state) => {
      try {
        console.log(
          `🔐 [AuthContext] Processing ${provider} OAuth callback...`
        );
        setLoading(true);
        const result = await handleOAuthCallbackNew(provider, code, state);

        if (result.user && result.token) {
          console.log(
            `✅ [AuthContext] OAuth login successful for ${provider}`
          );
          setAuthUser(result.user);
          setStoreAccessToken(result.token);
          setError(null);
          return result.user;
        } else {
          throw new Error(`No user data returned from ${provider} OAuth`);
        }
      } catch (err) {
        console.error(`❌ [AuthContext] OAuth callback error:`, err);
        setError(err.message);
        setLoading(false);
        throw err;
      }
    },
    [setStoreAccessToken, setAuthUser]
  );

  // Validate current user token
  const validateCurrentUser = useCallback(async () => {
    try {
      console.log('🔐 [AuthContext] Validating current user...');
      const user = await validateAndGetCurrentUser();
      if (user) {
        setAuthUser(user);
        setError(null);
        return user;
      } else {
        setUser(null);
        storeLogout();
        return null;
      }
    } catch (err) {
      console.error('❌ [AuthContext] Validation error:', err);
      setError(err.message);
      return null;
    }
  }, [setAuthUser, storeLogout]);

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    logout,
    setAuthUser,
    handleOAuthCallback,
    validateCurrentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
