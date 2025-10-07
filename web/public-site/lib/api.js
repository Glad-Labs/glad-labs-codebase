import qs from 'qs';

const STRAPI_API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;

/**
 * Get full Strapi URL from path
 * @param {string} path Path of the URL
 * @returns {string} Full Strapi URL
 */
export function getStrapiURL(path = '') {
  return `${STRAPI_API_URL || 'http://localhost:1337'}${path}`;
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
    },
    ...options,
  };

  // Build request URL
  const queryString = qs.stringify(urlParamsObject);
  const requestUrl = `${getStrapiURL(
    `${path}${queryString ? `?${queryString}` : ''}`
  )}`;

  // Trigger API call
  const response = await fetch(requestUrl, mergedOptions);

  // Handle response
  if (!response.ok) {
    console.error(response.statusText);
    throw new Error(`An error occurred please try again`);
  }
  const data = await response.json();
  return data;
}

export async function getPaginatedPosts(page = 1, pageSize = 10) {
  const query = qs.stringify({
    populate: '*',
    sort: { publishedAt: 'desc' },
    pagination: {
      page,
      pageSize,
    },
  });
  const data = await fetchAPI(`/posts?${query}`);
  return {
    ...data,
    data: data.data.map((post) => ({ id: post.id, ...post.attributes })),
  };
}

export async function getPostBySlug(slug) {
  const query = qs.stringify({
    filters: { slug: { $eq: slug } },
    populate: '*',
  });
  const data = await fetchAPI(`/posts?${query}`);
  // The response for a filtered query is always an array, so we return the first item
  if (data && data.data && data.data.length > 0) {
    const post = data.data[0];
    return { id: post.id, ...post.attributes };
  }
  return null;
}
