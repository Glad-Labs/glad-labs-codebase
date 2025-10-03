import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import { marked } from 'marked';

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

async function fetchAPI(query, { variables } = {}) {
  if (!STRAPI_API_TOKEN) {
    console.error("STRAPI_API_TOKEN is not set in .env.local");
    throw new Error('Failed to fetch API: Missing API Token');
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
  };

  try {
    const res = await fetch(`${STRAPI_URL}/graphql`, {
      method: 'POST',
      headers,
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
  } catch (error) {
    console.error("Error in fetchAPI:", error);
    // Return null to allow for graceful handling in the calling functions
    return null;
  }
}

export async function getSortedPostsData() {
  const data = await fetchAPI(`
    query GetSortedPosts {
      posts(sort: "Date:desc") {
        data {
          attributes {
            Title
            Slug
            Date
            Excerpt
            FeaturedImage {
              data {
                attributes {
                  url
                  alternativeText
                }
              }
            }
          }
        }
      }
    }
  `);
  // Defensive check to prevent crashes
  if (!data || !data.posts || !data.posts.data) {
    console.error("getSortedPostsData: Received null or invalid data from API.");
    return []; // Return an empty array to prevent the page from crashing
  }
  return data.posts.data.map(post => post.attributes);
}

export async function getAllPostSlugs() {
  const data = await fetchAPI(`
    query GetAllPostSlugs {
      posts {
        data {
          attributes {
            Slug
          }
        }
      }
    }
  `);
  // Defensive check
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
    query GetPostBySlug($slug: String!) {
      posts(filters: { Slug: { eq: $slug } }) {
        data {
          attributes {
            Title
            Slug
            Date
            BodyContent
            FeaturedImage {
              data {
                attributes {
                  url
                  alternativeText
                }
              }
            }
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

  // Convert markdown BodyContent to HTML
  if (postData.BodyContent) {
    const contentHtml = marked(postData.BodyContent);
    return {
      ...postData,
      contentHtml,
    };
  }

  return {
    ...postData,
    contentHtml: '',
  };
}
