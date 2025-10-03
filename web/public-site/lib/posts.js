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
    const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.STRAPI_API_TOKEN}`,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    const json = await res.json();
    if (json.errors) {
      console.error('GraphQL Errors:', JSON.stringify(json.errors, null, 2));
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
  const query = `
    query GetSortedPosts {
      posts(sort: "publishedAt:desc") {
        data {
          id
          attributes {
            Title
            Slug
            publishedAt
            MetaDescription
          }
        }
      }
    }
  `;
  try {
    const data = await fetchAPI(query);
    // Ensure we return the array of attributes, or an empty array if null
    return data?.posts?.data || [];
  } catch (error) {
    console.error("Error in getSortedPostsData:", error);
    console.log("getSortedPostsData: Received null or invalid data from API.");
    return []; // Return an empty array on error
  }
}

export async function getAllPostSlugs() {
  const query = `
    query GetAllPostSlugs {
      posts {
        data {
          attributes {
            Slug
          }
        }
      }
    }
  `;
  const data = await fetchAPI(query);
  return data?.posts?.data || [];
}

export async function getPostData(slug) {
  const query = `
    query GetPostBySlug($slug: String!) {
      posts(filters: { Slug: { eq: $slug } }) {
        data {
          id
          attributes {
            Title
            Slug
            Content
            publishedAt
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
  `;
  const data = await fetchAPI(query, { variables: { slug } });
  // The filter returns an array, so we return the first element
  return data?.posts?.data[0] || null;
}
