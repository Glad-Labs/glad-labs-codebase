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
        data {
          attributes {
            Title
            Slug
            publishedAt
            MetaDescription
          }
        }
      }
    }
  `);
  // Add a defensive check to prevent crashes
  if (!data || !data.posts || !data.posts.data) {
    console.error("getSortedPostsData: Received null or invalid data from API.");
    return []; // Return an empty array to prevent the page from crashing
  }
  return data.posts.data.map(post => post.attributes);
}

export async function getAllPostSlugs() {
  const data = await fetchAPI(`
    query {
      posts {
        data {
          attributes {
            Slug
          }
        }
      }
    }
  `);
  // Add a defensive check
  if (!data || !data.posts || !data.posts.data) {
    console.error("getAllPostSlugs: Received null or invalid data from API.");
    return [];
  }
  return data.posts.data.map((post) => ({
    params: {
      slug: post.attributes.Slug,
    },
  }));
}

export async function getPostData(slug) {
  const data = await fetchAPI(`
    query PostBySlug($slug: String!) {
      posts(filters: { Slug: { eq: $slug } }) {
        data {
          attributes {
            Title
            publishedAt
            BodyContent
            FeaturedImage {
              data {
                attributes {
                  url
                  alternativeText
                }
              }
            }
            MetaDescription
          }
        }
      }
    }
  `, { variables: { slug } });

  // Add a more robust check for the data object itself
  if (!data || !data.posts || !data.posts.data || data.posts.data.length === 0) {
    return null;
  }

  const postData = data.posts.data[0].attributes;

  // Convert Strapi's block content to a markdown string
  let contentMarkdown = '';
  if (postData.BodyContent) {
    contentMarkdown = postData.BodyContent.map(block => {
      if (block.type === 'paragraph') {
        return block.children.map(child => child.text).join('');
      }
      if (block.type === 'heading') {
        return `${'#'.repeat(block.level)} ${block.children.map(child => child.text).join('')}`;
      }
      if (block.type === 'list') {
        return block.children.map(li => `* ${li.children.map(child => child.text).join('')}`).join('\n');
      }
      // Add more block types here as needed (e.g., images, quotes)
      return '';
    }).join('\n\n');
  }

  const processedContent = await remark().use(html).process(contentMarkdown);
  const contentHtml = processedContent.toString();

  return {
    slug,
    contentHtml,
    ...postData,
  };
}
