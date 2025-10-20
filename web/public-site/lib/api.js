import qs from 'qs';

const STRAPI_API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
const STRAPI_API_TOKEN =
  process.env.NEXT_PUBLIC_STRAPI_API_TOKEN || process.env.STRAPI_API_TOKEN;

/**
 * Get full Strapi URL from path
 * @param {string} path Path of the URL
 * @returns {string} Full Strapi URL
 */
export function getStrapiURL(path = '') {
  return `${STRAPI_API_URL || 'http://localhost:1337'}${path}`;
}

/**
 * Helper to make GET requests to Strapi API endpoints with timeout
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

  try {
    // Add 10 second timeout for API calls
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(requestUrl, {
      ...mergedOptions,
      signal: controller.signal,
    });

    clearTimeout(timeout);

    // Handle response
    if (!response.ok) {
      console.error(`API Error: ${response.statusText}`);
      throw new Error(`API Error: ${response.status} - ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error(`API timeout for path: ${path}`);
      throw new Error(`API request timed out for ${path}`);
    }
    throw error;
  }
}

export async function getPaginatedPosts(
  page = 1,
  pageSize = 10,
  excludeId = null
) {
  try {
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
    // Return safe empty response during build failures
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

export async function getPostBySlug(slug) {
  try {
    const data = await fetchAPI(`/posts`, {
      filters: { slug: { $eq: slug } },
      populate: '*',
    });
    const item = data?.data?.[0];
    return item || null;
  } catch (error) {
    console.error('[getPostBySlug] Error fetching post:', error.message);
    return null;
  }
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
  try {
    const data = await fetchAPI('/categories');
    return Array.isArray(data?.data) ? data.data : [];
  } catch (error) {
    console.error('[getCategories] Failed to fetch categories:', error.message);
    // Return empty array during build to prevent failure
    // In production, users can still browse posts but categories page won't work
    return [];
  }
}

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
