/**
 * @file API Client for Strapi CMS Backend
 *
 * This module provides utilities to communicate with the Strapi v5 backend API.
 * It handles:
 * - Request authentication via Bearer tokens
 * - Query string building and parameter encoding
 * - Timeout protection (10 seconds) to prevent indefinite hangs
 * - Error handling for failed requests and timeouts
 *
 * CRITICAL: The 10-second timeout is essential for production deployments.
 * Without it, build processes on Vercel will hang if Strapi is unreachable.
 *
 * @see docs/RECENT_FIXES/TIMEOUT_FIX_SUMMARY.md for timeout details
 * @see docs/03-DEPLOYMENT_AND_INFRASTRUCTURE.md for deployment info
 */

import qs from 'qs';

// Environment variables
const STRAPI_API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
const STRAPI_API_TOKEN =
  process.env.NEXT_PUBLIC_STRAPI_API_TOKEN || process.env.STRAPI_API_TOKEN;

/**
 * Constructs the full Strapi API URL from a path
 *
 * @param {string} path - The API endpoint path (e.g., '/posts', '/categories')
 * @returns {string} Complete URL for the Strapi endpoint
 *
 * @example
 * getStrapiURL('/posts')
 * // Returns: 'https://strapi.railway.app/api/posts'
 */
export function getStrapiURL(path = '') {
  return `${STRAPI_API_URL || 'http://localhost:1337'}${path}`;
}

/**
 * Fetches data from the Strapi API with timeout protection
 *
 * CRITICAL: This function includes a 10-second timeout that is essential for
 * production deployments on Vercel. Without this timeout, if Strapi is unreachable
 * or slow during the build process, the entire build will hang and eventually timeout.
 *
 * @param {string} path - The API endpoint path (e.g., '/posts', '/categories/1')
 * @param {object} urlParamsObject - Query parameters (e.g., { populate: 'author' })
 * @param {object} options - Additional fetch options (method, headers, body, etc.)
 *
 * @returns {Promise<object>} The parsed JSON response from Strapi
 *
 * @throws {Error} - Throws if:
 *   - Request times out after 10 seconds (AbortError)
 *   - API returns non-2xx status code
 *   - Response is not valid JSON
 *
 * @example
 * // Simple GET request
 * const posts = await fetchAPI('/posts');
 *
 * @example
 * // With query parameters
 * const featured = await fetchAPI('/posts', {
 *   filters: { featured: true },
 *   populate: ['author', 'category'],
 *   pagination: { limit: 10 }
 * });
 *
 * @example
 * // POST request
 * const newPost = await fetchAPI('/posts', {}, {
 *   method: 'POST',
 *   body: JSON.stringify({ title: 'New Post' })
 * });
 */
async function fetchAPI(path, urlParamsObject = {}, options = {}) {
  // Merge fetch options with required headers
  const mergedOptions = {
    headers: {
      'Content-Type': 'application/json',
      // Add Authorization header if token is available
      ...(STRAPI_API_TOKEN
        ? { Authorization: `Bearer ${STRAPI_API_TOKEN}` }
        : {}),
    },
    ...options,
  };

  // Build query string from parameters and construct full URL
  const queryString = qs.stringify(urlParamsObject);
  const requestUrl = `${getStrapiURL(
    `/api${path}${queryString ? `?${queryString}` : ''}`
  )}`;

  try {
    // ⏱️ TIMEOUT PROTECTION (10 seconds)
    // This is critical for production builds. If Strapi doesn't respond within
    // 10 seconds, the request is aborted to prevent indefinite hangs.
    // See: docs/RECENT_FIXES/TIMEOUT_FIX_SUMMARY.md
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      console.warn(`[API Timeout] Request to ${path} aborted after 10 seconds`);
      controller.abort();
    }, 10000);

    // Make the API request with timeout signal
    const response = await fetch(requestUrl, {
      ...mergedOptions,
      signal: controller.signal,
    });

    // Clear timeout if request completes
    clearTimeout(timeout);

    // Handle HTTP errors
    if (!response.ok) {
      console.error(
        `[API Error] ${response.status} ${response.statusText} from ${path}`
      );
      throw new Error(`API Error: ${response.status} - ${response.statusText}`);
    }

    // Parse and return JSON response
    const data = await response.json();
    return data;
  } catch (error) {
    // Handle timeout specifically
    if (error.name === 'AbortError') {
      const timeoutError = new Error(
        `API request timed out for ${path} after 10 seconds`
      );
      timeoutError.code = 'TIMEOUT';
      console.error(`[API Timeout] ${timeoutError.message}`);
      throw timeoutError;
    }

    // Re-throw other errors with context
    console.error(`[API Error] Failed to fetch ${path}:`, error.message);
    throw error;
  }
}

/**
 * Fetches paginated posts from Strapi
 *
 * Used by the archive/[page].js dynamic page to show posts with pagination.
 * Includes error handling to return empty results if API fails, preventing
 * build failures during deployments when Strapi might be unreachable.
 *
 * @param {number} page - The page number (1-indexed)
 * @param {number} pageSize - Number of posts per page (default: 10)
 * @param {number} excludeId - Optional post ID to exclude from results
 *
 * @returns {Promise<object>} - Object with 'data' array and 'meta' pagination info
 *
 * @example
 * const result = await getPaginatedPosts(2, 10);
 * // Returns: { data: [...posts], meta: { pagination: {...} } }
 */
export async function getPaginatedPosts(
  page = 1,
  pageSize = 10,
  excludeId = null
) {
  try {
    // Build query with filters, sorting, and pagination
    const query = qs.stringify(
      {
        populate: '*', // Get all related data (author, category, etc.)
        sort: { publishedAt: 'desc' }, // Newest posts first
        pagination: {
          page,
          pageSize,
        },
        filters: {
          // Optionally exclude a specific post (e.g., featured post)
          ...(excludeId && { id: { $ne: excludeId } }),
        },
      },
      { encode: false }
    );

    const data = await fetchAPI(`/posts?${query}`);

    // Normalize response to ensure it always has required shape
    return {
      ...data,
      data: Array.isArray(data?.data) ? data.data : [],
      meta: {
        pagination: data?.meta?.pagination || {
          page,
          pageSize,
          pageCount: 0,
          total: 0,
        },
      },
    };
  } catch (error) {
    console.error('[getPaginatedPosts] Error fetching posts:', error.message);

    // CRITICAL: Return safe empty response on error
    // This prevents build failures during Strapi downtime.
    // Next.js will return a 404 page instead of crashing the build.
    // See: docs/RECENT_FIXES/TIMEOUT_FIX_SUMMARY.md
    return {
      data: [],
      meta: {
        pagination: {
          page,
          pageSize,
          pageCount: 0,
          total: 0,
        },
      },
    };
  }
}

/**
 * Fetches the featured post from Strapi
 *
 * Returns a single post marked as featured. Used on the homepage.
 * Gracefully returns null if no featured post or if API fails.
 *
 * @returns {Promise<object|null>} - The featured post object or null
 *
 * @example
 * const featured = await getFeaturedPost();
 * if (!featured) console.log('No featured post set');
 */
export async function getFeaturedPost() {
  try {
    const query = qs.stringify({
      filters: { featured: { $eq: true } },
      sort: { publishedAt: 'desc' },
      pagination: {
        limit: 1,
      },
      populate: '*',
    });
    const data = await fetchAPI(`/posts?${query}`);
    if (data && data.data && data.data.length > 0) {
      const post = data.data[0];
      return post;
    }
    return null;
  } catch (error) {
    console.error(
      '[getFeaturedPost] Error fetching featured post:',
      error.message
    );
    return null;
  }
}

/**
 * Fetches a single post by slug
 *
 * Used by dynamic post detail pages to fetch individual post content.
 * Returns null if post not found or API fails.
 *
 * @param {string} slug - The post slug (URL-friendly identifier)
 * @returns {Promise<object|null>} - The post object or null if not found
 *
 * @example
 * const post = await getPostBySlug('my-first-post');
 */
export async function getPostBySlug(slug) {
  try {
    const data = await fetchAPI(`/posts`, {
      filters: { slug: { $eq: slug } },
      populate: '*', // Include all relations (author, category, etc.)
    });
    const item = data?.data?.[0];
    return item || null;
  } catch (error) {
    console.error(
      '[getPostBySlug] Error fetching post with slug:',
      slug,
      error.message
    );
    return null;
  }
}

/**
 * Fetches the About page content from Strapi
 *
 * Tries multiple possible paths/collections:
 * 1. Single-type '/about' endpoint
 * 2. Single-type '/about-page' endpoint
 * 3. Single-type '/about-us' endpoint
 * 4. Collection '/pages' filtered by slug='about'
 * 5. Collection '/page' filtered by slug='about'
 *
 * This flexibility handles different Strapi content configurations.
 * Returns null if About page not found.
 *
 * @returns {Promise<object|null>} - The About page content or null
 *
 * @example
 * const about = await getAboutPage();
 * if (!about) console.log('About page not configured');
 */
export async function getAboutPage() {
  // Try single-type endpoints first
  const query = qs.stringify({ populate: '*' });
  const candidates = ['/about', '/about-page', '/about-us'];

  for (const path of candidates) {
    try {
      const data = await fetchAPI(`${path}?${query}`);
      if (data && data.data) {
        console.log(`[getAboutPage] Found about page at ${path}`);
        return data.data;
      }
    } catch (err) {
      // Continue to next candidate on error
      continue;
    }
  }

  // Fallback: try collection types with slug filter
  const collectionCandidates = ['/pages', '/page'];
  const slugFilter = qs.stringify(
    { filters: { slug: { $eq: 'about' } }, populate: '*' },
    { encode: false }
  );

  for (const base of collectionCandidates) {
    try {
      const data = await fetchAPI(`${base}?${slugFilter}`);
      if (data && Array.isArray(data.data) && data.data.length > 0) {
        console.log(`[getAboutPage] Found about page in collection ${base}`);
        return data.data[0];
      }
    } catch (err) {
      continue;
    }
  }

  // No About page found in any location
  console.warn(
    '[getAboutPage] About page not found in any configured location'
  );
  return null;
}

/**
 * Fetches all categories from Strapi
 *
 * Used for category listing/filtering. Returns empty array if API fails
 * to prevent build failures.
 *
 * @returns {Promise<Array>} - Array of category objects (empty if error)
 *
 * @example
 * const categories = await getCategories();
 * categories.forEach(cat => console.log(cat.name));
 */
export async function getCategories() {
  try {
    const data = await fetchAPI('/categories');
    return Array.isArray(data?.data) ? data.data : [];
  } catch (error) {
    console.error('[getCategories] Failed to fetch categories:', error.message);
    // Return empty array to prevent build failure
    // This allows site to build even if categories are unavailable
    return [];
  }
}

/**
 * Fetches all tags from Strapi
 *
 * Used for tag listing/filtering. Returns empty array if API fails
 * to prevent build failures.
 *
 * @returns {Promise<Array>} - Array of tag objects (empty if error)
 *
 * @example
 * const tags = await getTags();
 * tags.forEach(tag => console.log(tag.name));
 */
export async function getTags() {
  try {
    const data = await fetchAPI('/tags');
    return Array.isArray(data?.data) ? data.data : [];
  } catch (error) {
    console.error('[getTags] Failed to fetch tags:', error.message);
    // Return empty array during build to prevent failure
    // In production, users can still browse posts but tags page won't work
    return [];
  }
}

export async function getCategoryBySlug(slug) {
  try {
    const query = qs.stringify({ filters: { slug: { $eq: slug } } });
    const data = await fetchAPI(`/categories?${query}`);
    if (data && data.data && data.data.length > 0) {
      const category = data.data[0];
      return category;
    }
    return null;
  } catch (error) {
    console.error(
      '[getCategoryBySlug] Error fetching category:',
      error.message
    );
    return null;
  }
}

export async function getTagBySlug(slug) {
  try {
    const query = qs.stringify({ filters: { slug: { $eq: slug } } });
    const data = await fetchAPI(`/tags?${query}`);
    if (data && data.data && data.data.length > 0) {
      const tag = data.data[0];
      return tag;
    }
    return null;
  } catch (error) {
    console.error('[getTagBySlug] Error fetching tag:', error.message);
    return null;
  }
}

export async function getPostsByCategory(categorySlug) {
  try {
    const query = qs.stringify({
      filters: { category: { slug: { $eq: categorySlug } } },
      populate: '*',
    });
    const data = await fetchAPI(`/posts?${query}`);
    return Array.isArray(data?.data) ? data.data : [];
  } catch (error) {
    console.error('[getPostsByCategory] Error:', error.message);
    return [];
  }
}

export async function getPostsByTag(tagSlug) {
  try {
    const query = qs.stringify({
      filters: { tags: { slug: { $eq: tagSlug } } },
      populate: '*',
    });
    const data = await fetchAPI(`/posts?${query}`);
    return Array.isArray(data?.data) ? data.data : [];
  } catch (error) {
    console.error('[getPostsByTag] Error:', error.message);
    return [];
  }
}

export async function getAllPosts() {
  try {
    const data = await fetchAPI('/posts', {
      pagination: {
        pageSize: 1000,
      },
      fields: ['slug', 'updatedAt', 'publishedAt'],
    });
    return Array.isArray(data?.data) ? data.data : [];
  } catch (error) {
    console.error('[getAllPosts] Error fetching all posts:', error.message);
    return [];
  }
}
