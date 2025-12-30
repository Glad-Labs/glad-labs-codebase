/**
 * FastAPI API Client
 * Central export point for all FastAPI functions
 * Re-exports from api-fastapi.js for convenience
 */

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
  // OAuth Functions
  getOAuthLoginURL,
  handleOAuthCallback,
  getCurrentUser,
  logout,
  // Task Functions
  createTask,
  listTasks,
  getTaskById,
  getTaskMetrics,
  // Model Functions
  getAvailableModels,
  testModelProvider,
} from './api-fastapi';
