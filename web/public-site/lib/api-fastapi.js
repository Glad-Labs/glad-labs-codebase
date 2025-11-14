/**
 * FastAPI CMS Client - Optimized for Performance
 *
 * This replaces the Strapi client with a direct FastAPI integration.
 * - Sync endpoints (no async complications)
 * - PostgreSQL backend (fast queries)
 * - Built-in pagination and filtering
 * - Minimal response size
 * - Production-ready caching headers
 */

// API Configuration
const FASTAPI_URL =
  process.env.NEXT_PUBLIC_FASTAPI_URL || 'http://localhost:8000';
const API_BASE = `${FASTAPI_URL}/api`;

// Cache control for static content
const CACHE_HEADERS = {
  'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
};

/**
 * Generic fetch wrapper with error handling
 */
async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...CACHE_HEADERS,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`[FastAPI] Error fetching ${endpoint}:`, error.message);
    throw error;
  }
}

/**
 * Get paginated posts list
 *
 * @param {number} page - Page number (1-indexed)
 * @param {number} limit - Items per page (default 10)
 * @param {string} category - Filter by category slug (optional)
 * @param {string} tag - Filter by tag slug (optional)
 * @returns {Promise<{data: Array, meta: Object}>}
 */
export async function getPaginatedPosts(
  page = 1,
  limit = 10,
  category = null,
  tag = null
) {
  const skip = (page - 1) * limit;

  let endpoint = `/posts?skip=${skip}&limit=${limit}&published_only=true`;

  if (category) {
    endpoint += `&category=${encodeURIComponent(category)}`;
  }
  if (tag) {
    endpoint += `&tag=${encodeURIComponent(tag)}`;
  }

  const response = await fetchAPI(endpoint);

  return {
    posts: response.data,
    pagination: {
      page,
      limit,
      total: response.meta.pagination.total,
      pages: Math.ceil(response.meta.pagination.total / limit),
    },
  };
}

/**
 * Get featured post for homepage hero
 *
 * @returns {Promise<Object|null>}
 */
export async function getFeaturedPost() {
  try {
    const response = await fetchAPI('/posts?featured=true&limit=1');

    if (response.data && response.data.length > 0) {
      return response.data[0];
    }
    return null;
  } catch (error) {
    console.error('[FastAPI] Error fetching featured post:', error);
    return null;
  }
}

/**
 * Get single post by slug with full content
 * Includes related category and tags
 *
 * @param {string} slug - Post slug
 * @returns {Promise<Object|null>}
 */
export async function getPostBySlug(slug) {
  try {
    const response = await fetchAPI(`/posts/${slug}`);

    if (response.data) {
      return {
        ...response.data,
        // Normalize meta fields for compatibility
        category: response.meta.category || null,
        tags: response.meta.tags || [],
      };
    }
    return null;
  } catch (error) {
    console.error(`[FastAPI] Error fetching post ${slug}:`, error);
    return null;
  }
}

/**
 * Get all categories for navigation/filtering
 *
 * @returns {Promise<Array>}
 */
export async function getCategories() {
  try {
    const response = await fetchAPI('/categories');
    return response.data || [];
  } catch (error) {
    console.error('[FastAPI] Error fetching categories:', error);
    return [];
  }
}

/**
 * Get all tags for filtering/cloud
 *
 * @returns {Promise<Array>}
 */
export async function getTags() {
  try {
    const response = await fetchAPI('/tags');
    return response.data || [];
  } catch (error) {
    console.error('[FastAPI] Error fetching tags:', error);
    return [];
  }
}

/**
 * Get posts in specific category
 *
 * @param {string} slug - Category slug
 * @param {number} page - Page number (1-indexed)
 * @param {number} limit - Items per page
 * @returns {Promise<{posts: Array, pagination: Object}>}
 */
export async function getPostsByCategory(slug, page = 1, limit = 10) {
  return getPaginatedPosts(page, limit, slug, null);
}

/**
 * Get posts with specific tag
 *
 * @param {string} slug - Tag slug
 * @param {number} page - Page number (1-indexed)
 * @param {number} limit - Items per page
 * @returns {Promise<{posts: Array, pagination: Object}>}
 */
export async function getPostsByTag(slug, page = 1, limit = 10) {
  return getPaginatedPosts(page, limit, null, slug);
}

/**
 * Get all posts for static generation (Next.js)
 * Used in getStaticPaths for SSG
 *
 * @returns {Promise<Array<{slug: string}>>}
 */
export async function getAllPosts() {
  try {
    const response = await fetchAPI('/posts?limit=1000&published_only=true');
    return (
      response.data.map((post) => ({
        slug: post.slug,
      })) || []
    );
  } catch (error) {
    console.error('[FastAPI] Error fetching all posts:', error);
    return [];
  }
}

/**
 * Get related posts (similar by tags)
 *
 * @param {string} postId - Current post ID
 * @param {Array} tagIds - Tag IDs to match
 * @param {number} limit - Number of related posts to return
 * @returns {Promise<Array>}
 */
export async function getRelatedPosts(postId, tagIds = [], limit = 3) {
  try {
    // Query posts with same tags, excluding current post
    let endpoint = `/posts?limit=${limit}&published_only=true`;

    if (tagIds && tagIds.length > 0) {
      endpoint += `&related_tags=${tagIds.join(',')}`;
    }

    const response = await fetchAPI(endpoint);

    // Filter out the current post
    return (response.data || [])
      .filter((post) => post.id !== postId)
      .slice(0, limit);
  } catch (error) {
    console.error('[FastAPI] Error fetching related posts:', error);
    return [];
  }
}

/**
 * Search posts by keyword
 *
 * @param {string} query - Search query
 * @param {number} limit - Max results
 * @returns {Promise<Array>}
 */
export async function searchPosts(query, limit = 20) {
  try {
    if (!query || query.trim().length === 0) {
      return [];
    }

    const endpoint = `/posts/search?q=${encodeURIComponent(query)}&limit=${limit}`;
    const response = await fetchAPI(endpoint);

    return response.data || [];
  } catch (error) {
    console.error('[FastAPI] Error searching posts:', error);
    return [];
  }
}

/**
 * Get CMS health status
 * Useful for build-time validation
 *
 * @returns {Promise<Object>}
 */
export async function getCMSStatus() {
  try {
    const response = await fetchAPI('/cms/status');
    return response;
  } catch (error) {
    console.error('[FastAPI] Error checking CMS status:', error);
    return { status: 'error', message: error.message };
  }
}

/**
 * Build-time validation
 * Checks if FastAPI is available
 *
 * @returns {Promise<boolean>}
 */
export async function validateFastAPI() {
  try {
    const status = await getCMSStatus();
    return status.status === 'healthy';
  } catch (error) {
    return false;
  }
}

/**
 * Get image URL from relative path
 * (In case we move to CloudFront/CDN later)
 *
 * @param {string} path - Relative image path
 * @returns {string}
 */
export function getImageURL(path) {
  if (!path) return null;

  // If absolute URL, return as-is
  if (path.startsWith('http')) {
    return path;
  }

  // Otherwise, construct from FastAPI
  return `${FASTAPI_URL}${path}`;
}

/**
 * Format post data for display
 * Normalizes field names and types
 *
 * @param {Object} post - Raw post from FastAPI
 * @returns {Object}
 */
export function formatPost(post) {
  if (!post) return null;

  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    featured: post.featured || false,
    publishedAt: post.published_at,
    createdAt: post.created_at,
    category: post.category || null,
    tags: post.tags || [],
    coverImage: post.cover_image || null,
    meta: {
      wordCount: (post.content || '').split(/\s+/).length,
      readingTime: Math.ceil((post.content || '').split(/\s+/).length / 200), // ~200 words per minute
    },
  };
}

// Default export for compatibility
export default {
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
};
