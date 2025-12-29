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

// Helper to construct absolute URLs for images and assets
// Handles both relative paths and already-absolute URLs
export function getStrapiURL(path = '') {
  const FASTAPI_URL =
    process.env.NEXT_PUBLIC_FASTAPI_URL || 'http://localhost:8000';

  if (!path) return FASTAPI_URL;

  // If already an absolute URL (http:// or https://), return as-is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  // If relative path, prepend base URL
  return `${FASTAPI_URL}${path}`;
}

// Stub implementations for legacy Pages Router pages
// These pages use App Router equivalents at app/legal/
export async function getCategoryBySlug(slug) {
  // Legacy function - categories are no longer supported
  // See app/posts/[slug]/page.tsx for current implementation
  return null;
}

export async function getTagBySlug(slug) {
  // Legacy function - tags are no longer supported
  // See app/posts/[slug]/page.tsx for current implementation
  return null;
}
