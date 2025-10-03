import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const STRAPI_URL = process.env.STRAPI_API_URL || 'http://localhost:1337';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

export async function fetchAPI(query, { variables } = {}) {
  if (!STRAPI_TOKEN) {
    throw new Error('The STRAPI_API_TOKEN environment variable is not set.');
  }

  const res = await fetch(`${STRAPI_URL}/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${STRAPI_TOKEN}`,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const json = await res.json();
  if (json.errors) {
    console.error("GraphQL Errors:", JSON.stringify(json.errors, null, 2));
    throw new Error('Failed to fetch API');
  }

  return json.data;
}

export async function getSortedPostsData() {
  const data = await fetchAPI(`
    query {
      posts(sort: "publishedAt:desc") {
        Title
        Slug
        publishedAt
        MetaDescription
      }
    }
  `);
  return data.posts;
}

export async function getAllPostSlugs() {
  const data = await fetchAPI(`
    query {
      posts {
        Slug
      }
    }
  `);
  return data.posts.map((post) => ({
    params: {
      slug: post.Slug,
    },
  }));
}

export async function getPostData(slug) {
  const data = await fetchAPI(`
    query PostBySlug($slug: String!) {
      posts(filters: { Slug: { eq: $slug } }) {
        Title
        publishedAt
        Content
        FeaturedImage {
          url
          alternativeText
        }
        MetaDescription
      }
    }
  `, { variables: { slug } });

  if (!data.posts || data.posts.length === 0) {
    return null;
  }

  const postData = data.posts[0];

  const processedContent = await remark().use(html).process(postData.Content || '');
  const contentHtml = processedContent.toString();

  return {
    slug,
    contentHtml,
    ...postData,
  };
}
