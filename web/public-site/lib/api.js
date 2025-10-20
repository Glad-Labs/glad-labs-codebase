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
  const data = await fetchAPI(`/posts`, {
    filters: { slug: { $eq: slug } },
    populate: '*',
  });
  const item = data?.data?.[0];
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
  const query = qs.stringify({ filters: { slug: { $eq: slug } } });
  const data = await fetchAPI(`/categories?${query}`);
  if (data && data.data && data.data.length > 0) {
    const category = data.data[0];
    return category;
  }
  return null;
}

export async function getTagBySlug(slug) {
  const query = qs.stringify({ filters: { slug: { $eq: slug } } });
  const data = await fetchAPI(`/tags?${query}`);
  if (data && data.data && data.data.length > 0) {
    const tag = data.data[0];
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
