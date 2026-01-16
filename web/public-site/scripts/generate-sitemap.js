import fs from 'fs';
import qs from 'qs';

const FASTAPI_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_FASTAPI_URL ||
  'http://localhost:8000';
const SITE_URL = 'https://www.glad-labs.com'; // Replace with your actual site URL

async function fetchAPI(path, urlParamsObject = {}, options = {}) {
  const mergedOptions = {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  };
  const queryString = qs.stringify(urlParamsObject);
  const requestUrl = `${FASTAPI_URL}${path}${
    queryString ? `?${queryString}` : ''
  }`;
  const response = await fetch(requestUrl, mergedOptions);
  if (!response.ok) {
    console.error(response.statusText);
    throw new Error('An error occurred please try again');
  }
  const data = await response.json();
  return data;
}

async function getAllContent() {
  const [posts, categories, tags] = await Promise.all([
    fetchAPI('/api/posts', { populate: '*' }),
    fetchAPI('/api/categories'),
    fetchAPI('/api/tags'),
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
        <loc>${SITE_URL}/privacy-policy</loc>
      </url>
      <url>
        <loc>${SITE_URL}/archive/1</loc>
      </url>
      ${posts
        .map(
          ({ slug, updatedAt, publishedAt }) => `
      <url>
        <loc>${SITE_URL}/posts/${slug}</loc>
        <lastmod>${new Date(
          updatedAt || publishedAt || Date.now()
        ).toISOString()}</lastmod>
      </url>
      `
        )
        .join('')}
      ${categories
        .map(
          ({ slug }) => `
      <url>
        <loc>${SITE_URL}/category/${slug}</loc>
      </url>
      `
        )
        .join('')}
      ${tags
        .map(
          ({ slug }) => `
      <url>
        <loc>${SITE_URL}/tag/${slug}</loc>
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
    console.warn('Warning: Could not fetch content from FastAPI during build.');
    console.warn(
      'This is normal during deployment when FastAPI is not running.'
    );
    console.warn('Generating minimal fallback sitemap...');

    // Generate fallback sitemap with just static pages
    const fallbackSitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>${SITE_URL}</loc>
      </url>
      <url>
        <loc>${SITE_URL}/about</loc>
      </url>
      <url>
        <loc>${SITE_URL}/privacy-policy</loc>
      </url>
      <url>
        <loc>${SITE_URL}/terms</loc>
      </url>
      <url>
        <loc>${SITE_URL}/terms-of-service</loc>
      </url>
    </urlset>`;

    fs.writeFileSync('public/sitemap.xml', fallbackSitemap);
    console.log('Fallback sitemap generated with static pages only.');
  }
})();
