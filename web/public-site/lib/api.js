/**
 * FastAPI CMS Client - Optimized for Performance
 *
 * This module has been updated to use FastAPI instead of Strapi.
 * All exports remain the same for backward compatibility.
 * Now includes slugLookup caching for better performance.
 */

import { getCachedSlug, setCachedSlug } from './slugLookup';

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

/**
 * Helper to make GET requests to Strapi API endpoints
 * @param {string} path Path of the API route
 * @param {object} urlParamsObject URL params object, will be stringified
 * @param {object} options Options passed to fetch
 * @returns Parsed API call response
 */
async function fetchAPI(path, urlParamsObject = {}, options = {}) {
  // Merge default and user options
  const mergedOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(STRAPI_API_TOKEN
        ? { Authorization: `Bearer ${STRAPI_API_TOKEN}` }
        : {}),
    },
    ...options,
  };

  const queryString = qs.stringify(urlParamsObject);
  const requestUrl = `${getStrapiURL(
    `/api${path}${queryString ? `?${queryString}` : ''}`
  )}`;

  console.log('FETCHING URL:', requestUrl); // <--- ADD THIS LINE

  const response = await fetch(requestUrl, mergedOptions);

  // Handle response
  if (!response.ok) {
    console.error(response.statusText);
    throw new Error(`An error occurred please try again`);
  }
  const data = await response.json();
  return data;
}

export async function getPaginatedPosts(
  page = 1,
  pageSize = 10,
  excludeId = null
) {
  const query = qs.stringify(
    {
      populate: '*',
      sort: { publishedAt: 'desc' },
      pagination: {
        page,
        pageSize,
      },
      filters: {
        id: {
          $ne: excludeId,
        },
      },
    },
    { encode: false }
  );
  const data = await fetchAPI(`/posts?${query}`);
  return {
    ...data,
    data: data.data,
  };
}

export async function getFeaturedPost() {
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
}

export async function getPostBySlug(slug) {
  // Check cache first
  const cached = getCachedSlug('post', slug);
  if (cached) {
    return cached;
  }

  const data = await fetchAPI(`/posts`, {
    filters: { slug: { $eq: slug } },
    populate: '*',
  });
  const item = data?.data?.[0];

  // Cache the result
  if (item) {
    setCachedSlug('post', slug, item);
  }

  return item || null;
}

export async function getAboutPage() {
  const query = qs.stringify({ populate: '*' });
  const candidates = ['/about', '/about-page', '/about-us'];
  for (const path of candidates) {
    try {
      const data = await fetchAPI(`${path}?${query}`);
      if (data && data.data) {
        return data.data;
      }
    } catch (err) {
      // Try next candidate on 404/NotFound; rethrow on other errors if needed
      continue;
    }
  }

  // Fallback: try a collection type `pages`/`page` with slug 'about'
  const collectionCandidates = ['/pages', '/page'];
  const slugFilter = qs.stringify(
    { filters: { slug: { $eq: 'about' } }, populate: '*' },
    { encode: false }
  );
  for (const base of collectionCandidates) {
    try {
      const data = await fetchAPI(`${base}?${slugFilter}`);
      if (data && Array.isArray(data.data) && data.data.length > 0) {
        const item = data.data[0];
        return item;
      }
    } catch (err) {
      continue;
    }
  }
  return null;
}

export async function getCategories() {
  const data = await fetchAPI('/categories');
  return data.data;
}

export async function getTags() {
  const data = await fetchAPI('/tags');
  return data.data;
}

export async function getCategoryBySlug(slug) {
  // Check cache first
  const cached = getCachedSlug('category', slug);
  if (cached) {
    return cached;
  }

  const query = qs.stringify({ filters: { slug: { $eq: slug } } });
  const data = await fetchAPI(`/categories?${query}`);
  if (data && data.data && data.data.length > 0) {
    const category = data.data[0];
    // Cache the result
    setCachedSlug('category', slug, category);
    return category;
  }
  return null;
}

export async function getTagBySlug(slug) {
  // Check cache first
  const cached = getCachedSlug('tag', slug);
  if (cached) {
    return cached;
  }

  const query = qs.stringify({ filters: { slug: { $eq: slug } } });
  const data = await fetchAPI(`/tags?${query}`);
  if (data && data.data && data.data.length > 0) {
    const tag = data.data[0];
    // Cache the result
    setCachedSlug('tag', slug, tag);
    return tag;
  }
  return null;
}

export async function getPostsByCategory(categorySlug) {
  const query = qs.stringify({
    filters: { category: { slug: { $eq: categorySlug } } },
    populate: '*',
  });
  const data = await fetchAPI(`/posts?${query}`);
  return data.data;
}

export async function getPostsByTag(tagSlug) {
  const query = qs.stringify({
    filters: { tags: { slug: { $eq: tagSlug } } },
    populate: '*',
  });
  const data = await fetchAPI(`/posts?${query}`);
  return data.data;
}

export async function getAllPosts() {
  const data = await fetchAPI('/posts', {
    pagination: {
      pageSize: 1000,
    },
    fields: ['slug', 'updatedAt', 'publishedAt'],
  });
  return Array.isArray(data?.data) ? data.data : [];
}
