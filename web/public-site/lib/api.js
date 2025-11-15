/**
 * FastAPI Response Adapter
 * FastAPI returns: {data: [...], meta: {pagination: {...}}}
 * Pages expect: {data: [...], meta: {pagination: {...}}}
 * So we pass through as-is
 */

// Re-export all FastAPI functions
export {
  // CMS Functions
  getPaginatedPosts,
  getFeaturedPost,
  getPostBySlug,
  getCategories,
  getTags,
  getPostsByCategory,
  getPostsByTag,
  getAllPosts,
  getRelatedPosts,
  searchPosts,
  getCMSStatus,
  validateFastAPI,
  getImageURL,
  formatPost,
  // OAuth Functions (NEW)
  getOAuthLoginURL,
  handleOAuthCallback,
  getCurrentUser,
  logout,
  // Task Functions (NEW)
  createTask,
  listTasks,
  getTaskById,
  getTaskMetrics,
  // Model Functions (NEW)
  getAvailableModels,
  testModelProvider,
} from './api-fastapi';

// For legacy code that calls getStrapiURL, redirect to getImageURL
export function getStrapiURL(path = '') {
  const FASTAPI_URL =
    process.env.NEXT_PUBLIC_FASTAPI_URL || 'http://localhost:8000';
  if (!path) return FASTAPI_URL;
  return `${FASTAPI_URL}${path}`;
}
