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
    data: data.data.map((post) => ({ id: post.id, ...post.attributes })),
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
    return { id: post.id, ...post.attributes };
  }
  return null;
}

export async function getPostBySlug(slug) {
  const data = await fetchAPI(`/posts`, {
    filters: { slug: { $eq: slug } },
    populate: '*',
  });
  return data?.data[0]?.attributes;
}

export async function getAboutPage() {
  const query = qs.stringify({ populate: '*' });
  const data = await fetchAPI(`/about?${query}`);
  if (data && data.data) {
    return { id: data.data.id, ...data.data.attributes };
  }
  return null;
}

export async function getCategories() {
  const data = await fetchAPI('/categories');
  return data.data.map((category) => ({
    id: category.id,
    ...category.attributes,
  }));
}

export async function getTags() {
  const data = await fetchAPI('/tags');
  return data.data.map((tag) => ({ id: tag.id, ...tag.attributes }));
}

export async function getCategoryBySlug(slug) {
  const query = qs.stringify({ filters: { slug: { $eq: slug } } });
  const data = await fetchAPI(`/categories?${query}`);
  if (data && data.data && data.data.length > 0) {
    const category = data.data[0];
    return { id: category.id, ...category.attributes };
  }
  return null;
}

export async function getTagBySlug(slug) {
  const query = qs.stringify({ filters: { slug: { $eq: slug } } });
  const data = await fetchAPI(`/tags?${query}`);
  if (data && data.data && data.data.length > 0) {
    const tag = data.data[0];
    return { id: tag.id, ...tag.attributes };
  }
  return null;
}

export async function getPostsByCategory(categorySlug) {
  const query = qs.stringify({
    filters: { category: { slug: { $eq: categorySlug } } },
    populate: '*',
  });
  const data = await fetchAPI(`/posts?${query}`);
  return data.data.map((post) => ({ id: post.id, ...post.attributes }));
}

export async function getPostsByTag(tagSlug) {
  const query = qs.stringify({
    filters: { tags: { slug: { $eq: tagSlug } } },
    populate: '*',
  });
  const data = await fetchAPI(`/posts?${query}`);
  return data.data.map((post) => ({ id: post.id, ...post.attributes }));
}

export async function getAllPosts() {
  const data = await fetchAPI('/posts', {
    pagination: {
      // Set a high page size to fetch all posts
      pageSize: 1000,
    },
    // Only fetch the slug for performance
    fields: ['slug'], // Corrected from 'Slug' to 'slug'
  });
  return data?.data;
}
