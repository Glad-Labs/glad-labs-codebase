/**
 * URL Utilities
 * Handles API URL construction and image URL resolution
 */

const FASTAPI_URL =
  process.env.NEXT_PUBLIC_FASTAPI_URL || 'http://localhost:8000';

/**
 * Construct absolute URL for API calls and image assets
 * Handles both relative paths and already-absolute URLs
 * @param {string} path - Relative or absolute path
 * @returns {string} - Absolute URL
 */
export function getAbsoluteURL(path = '') {
  if (!path) return FASTAPI_URL;

  // If already an absolute URL (http:// or https://), return as-is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  // If relative path, prepend base URL
  return `${FASTAPI_URL}${path}`;
}

/**
 * Legacy alias for backward compatibility
 * @deprecated Use getAbsoluteURL instead
 */
export function getStrapiURL(path = '') {
  return getAbsoluteURL(path);
}

/**
 * Get the FastAPI base URL
 * @returns {string} - Base API URL
 */
export function getAPIBaseURL() {
  return FASTAPI_URL;
}
