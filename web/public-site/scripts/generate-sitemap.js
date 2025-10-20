const fs = require('fs');
const qs = require('qs');

const STRAPI_API_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://gladlabs.io';

async function fetchAPI(path, urlParamsObject = {}, options = {}) {
  const mergedOptions = {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  };
  const queryString = qs.stringify(urlParamsObject);
  const requestUrl = `${STRAPI_API_URL}${path}${
    queryString ? `?${queryString}` : ''
  }`;
  
  try {
    const response = await fetch(requestUrl, {
      ...mergedOptions,
      timeout: 5000, // 5 second timeout
    });
    if (!response.ok) {
      console.warn(`[Sitemap] API returned ${response.status} for ${path}`);
      throw new Error(`API returned ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.warn(`[Sitemap] Failed to fetch ${path}:`, error.message);
    throw error;
  }
}

async function getAllContent() {
  try {
    const [posts, categories, tags] = await Promise.all([
      fetchAPI('/api/posts', { populate: '*' }).catch(() => ({ data: [] })),
      fetchAPI('/api/categories').catch(() => ({ data: [] })),
      fetchAPI('/api/tags').catch(() => ({ data: [] })),
    ]);

    return {
      posts: (posts.data || []).map((post) => 
        post.attributes 
          ? { id: post.id, ...post.attributes }
          : post
      ),
      categories: (categories.data || []).map((category) =>
        category.attributes
          ? { id: category.id, ...category.attributes }
          : category
      ),
      tags: (tags.data || []).map((tag) =>
        tag.attributes
          ? { id: tag.id, ...tag.attributes }
          : tag
      ),
    };
  } catch (error) {
    console.warn('[Sitemap] Error fetching content, using minimal sitemap');
    return {
      posts: [],
      categories: [],
      tags: [],
    };
  }
}

function generateSitemap(content) {
  const { posts, categories, tags } = content;
  
  // Filter out items without slugs
  const validPosts = (posts || []).filter(p => p.slug);
  const validCategories = (categories || []).filter(c => c.slug);
  const validTags = (tags || []).filter(t => t.slug);
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}</loc>
    <changefreq>weekly</changefreq>
  </url>
  <url>
    <loc>${SITE_URL}/about</loc>
    <changefreq>monthly</changefreq>
  </url>
  <url>
    <loc>${SITE_URL}/privacy-policy</loc>
    <changefreq>monthly</changefreq>
  </url>
  <url>
    <loc>${SITE_URL}/archive/1</loc>
    <changefreq>daily</changefreq>
  </url>
  ${validPosts
    .map(
      ({ slug, updatedAt, publishedAt }) => `  <url>
    <loc>${SITE_URL}/posts/${slug}</loc>
    <lastmod>${new Date(
      updatedAt || publishedAt || Date.now()
    ).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
  </url>`
    )
    .join('\n')}
  ${validCategories
    .map(
      ({ slug }) => `  <url>
    <loc>${SITE_URL}/category/${slug}</loc>
    <changefreq>weekly</changefreq>
  </url>`
    )
    .join('\n')}
  ${validTags
    .map(
      ({ slug }) => `  <url>
    <loc>${SITE_URL}/tag/${slug}</loc>
    <changefreq>weekly</changefreq>
  </url>`
    )
    .join('\n')}
</urlset>`;

  fs.writeFileSync('public/sitemap.xml', sitemap);
  console.log(`[Sitemap] Generated sitemap with ${validPosts.length} posts, ${validCategories.length} categories, ${validTags.length} tags`);
}

(async () => {
  try {
    const content = await getAllContent();
    generateSitemap(content);
    console.log('[Sitemap] ✅ Sitemap generated successfully!');
  } catch (error) {
    console.error('[Sitemap] Error generating sitemap:', error.message);
    // Generate minimal sitemap as fallback
    try {
      generateSitemap({
        posts: [],
        categories: [],
        tags: [],
      });
      console.log('[Sitemap] ⚠️  Generated minimal fallback sitemap');
    } catch (fallbackError) {
      console.error('[Sitemap] ❌ Failed to generate even fallback sitemap:', fallbackError.message);
      process.exit(1);
    }
  }
})();
