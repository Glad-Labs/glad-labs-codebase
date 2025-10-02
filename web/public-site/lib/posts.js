import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const STRAPI_URL = process.env.STRAPI_API_URL || 'http://localhost:1337';

async function fetchAPI(query, { variables } = {}) {
  const res = await fetch(`${STRAPI_URL}/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const json = await res.json();
  if (json.errors) {
    console.error(json.errors);
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
  return data.posts.data;
}

export async function getAllPostSlugs() {
  const data = await fetchAPI(`
    query {
      posts {
        slug
      }
    }
  `);
  return data.posts.map((post) => {
    return {
      params: {
        slug: post.slug,
      },
    };
  });
}

export async function getPostData(slug) {
  const data = await fetchAPI(`
    query PostBySlug($slug: String!) {
      posts(filters: { Slug: { eq: $slug } }) {
        data {
          attributes {
            Title
            publishedAt
            Content
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

  const post = data.posts.data[0].attributes;

  // Process markdown to HTML
  const processedContent = await remark().use(html).process(post.Content);
  const contentHtml = processedContent.toString();

  return {
    slug,
    contentHtml,
    ...post,
  };
}
