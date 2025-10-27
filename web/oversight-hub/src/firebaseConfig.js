/**
 * @file apiConfig.js (formerly firebaseConfig.js)
 * @description This file configures the API client for communicating with the PostgreSQL backend.
 * Migrated from Firebase Firestore (October 26, 2025) to REST API + PostgreSQL.
 *
 * It exports the API base URL and configuration for use throughout the application.
 *
 * @requires axios or fetch API
 *
 * MIGRATION NOTE: Firebase/Firestore code archived in archive/google-cloud-services/
 * for future Google Cloud services integration (Google Drive, Docs, Sheets, Gmail)
 */

// --- API Configuration ---
const apiConfig = {
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api',
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
};

// Validate API endpoint
if (!apiConfig.baseURL) {
  console.warn(
    'API configuration incomplete. REACT_APP_API_BASE_URL not set. ' +
      'Using default: http://localhost:8000/api'
  );
}

// --- Authentication Configuration ---
const authConfig = {
  tokenKey: 'auth_token',
  refreshTokenKey: 'refresh_token',
  headerName: 'Authorization',
  tokenPrefix: 'Bearer ',
};

// Get stored token
const getToken = () => {
  try {
    return localStorage.getItem(authConfig.tokenKey);
  } catch (err) {
    console.error('Failed to retrieve auth token:', err);
    return null;
  }
};

// Set token
const setToken = (token, refreshToken) => {
  try {
    localStorage.setItem(authConfig.tokenKey, token);
    if (refreshToken) {
      localStorage.setItem(authConfig.refreshTokenKey, refreshToken);
    }
  } catch (err) {
    console.error('Failed to store auth token:', err);
  }
};

// Clear token
const clearToken = () => {
  try {
    localStorage.removeItem(authConfig.tokenKey);
    localStorage.removeItem(authConfig.refreshTokenKey);
  } catch (err) {
    console.error('Failed to clear auth token:', err);
  }
};

export { apiConfig, authConfig, getToken, setToken, clearToken };
