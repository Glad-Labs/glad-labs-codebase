const fs = require('fs');
const qs = require('qs');

const STRAPI_API_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337';
const SITE_URL = 'https://www.glad-labs.com'; // Replace with your actual site URL

async function fetchAPI(path, urlParamsObject = {}, options = {}) {
  const mergedOptions = {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  };
  const queryString = qs.stringify(urlParamsObject);
  const requestUrl = `${STRAPI_API_URL}${path}${
    queryString ? `?${queryString}` : ''
  }`;
  const response = await fetch(requestUrl, mergedOptions);
  if (!response.ok) {
    console.error(response.statusText);
    throw new Error(`An error occurred please try again`);
  }
  const data = await response.json();
  return data;
}

async function getAllContent() {
  const [posts, categories, tags] = await Promise.all([
    fetchAPI('/posts', { populate: '*' }),
    fetchAPI('/categories'),
    fetchAPI('/tags'),
  ]);

  return {
    posts: posts.data.map((post) => ({ id: post.id, ...post.attributes })),
    categories: categories.data.map((category) => ({
      id: category.id,
      ...category.attributes,
    })),
    tags: tags.data.map((tag) => ({ id: tag.id, ...tag.attributes })),
  };
}

function generateSitemap(content) {
  const { posts, categories, tags } = content;
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>${SITE_URL}</loc>
      </url>
      <url>
        <loc>${SITE_URL}/about</loc>
      </url>
      <url>
        <loc>${SITE_URL}/archive/1</loc>
      </url>
      ${posts
        .map(
          ({ Slug, updatedAt }) => `
      <url>
        <loc>${SITE_URL}/posts/${Slug}</loc>
        <lastmod>${new Date(updatedAt).toISOString()}</lastmod>
      </url>
      `
        )
        .join('')}
      ${categories
        .map(
          ({ Slug }) => `
      <url>
        <loc>${SITE_URL}/category/${Slug}</loc>
      </url>
      `
        )
        .join('')}
      ${tags
        .map(
          ({ Slug }) => `
      <url>
        <loc>${SITE_URL}/tag/${Slug}</loc>
      </url>
      `
        )
        .join('')}
    </urlset>
  `;

  fs.writeFileSync('public/sitemap.xml', sitemap);
}

(async () => {
  try {
    const content = await getAllContent();
    generateSitemap(content);
    console.log('Sitemap generated successfully!');
  } catch (error) {
    console.error('Error generating sitemap:', error);
  }
})();
