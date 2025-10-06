/**
 * @file lib/posts.js
 * @description This library module contains functions for fetching blog post data
 * from the Strapi GraphQL API. It handles API requests, data fetching for
 * lists of posts, individual posts, and slugs for generating static pages.
 *
 * @requires graphql-request - A more robust GraphQL client.
 * @suggestion FUTURE_ENHANCEMENT: Add a more sophisticated GraphQL client like
 * `graphql-request` or Apollo Client to handle queries, caching, and error handling
 * more gracefully. For now, the native `fetch` is sufficient.
 */

/**
 * A generic fetch wrapper for the Strapi GraphQL API.
 * It handles authentication, request formatting, and error handling.
 *
 * @async
 * @function fetchAPI
 * @param {string} query - The GraphQL query string.
 * @param {Object} [options={}] - Optional parameters.
 * @param {Object} [options.variables] - Variables for the GraphQL query.
 * @returns {Promise<Object>} The `data` object from the GraphQL response.
 * @throws {Error} If the API token is missing or if the fetch request fails.
 *
 * @suggestion SECURITY_NOTE: The API URL and Token are loaded from environment
 * variables (`.env.local`). This is a critical security practice to avoid
 * exposing credentials in the source code.
 */
async function fetchAPI(query, { variables } = {}) {
  const apiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337';
  const apiToken = process.env.STRAPI_API_TOKEN;

  // Critical check to ensure the API token is configured.
  if (!apiToken) {
    console.error("FATAL: STRAPI_API_TOKEN is not set in your environment variables.");
    throw new Error("The Strapi API token is missing. Please check your .env.local file.");
  }

  try {
    const res = await fetch(`${apiUrl}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiToken}`,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
      // Revalidate cache every 60 seconds to ensure data is reasonably fresh.
      next: { revalidate: 60 }
    });

    if (!res.ok) {
      const errorDetails = await res.text();
      throw new Error(`API request failed with status ${res.status}: ${errorDetails}`);
    }

    const json = await res.json();
    if (json.errors) {
      console.error('GraphQL Errors:', JSON.stringify(json.errors, null, 2));
      throw new Error('A GraphQL error occurred. Check the server console for details.');
    }

    return json.data;

  } catch (error) {
    console.error("There was a problem with the fetch operation:", error.message);
    // Re-throw the error to be caught by the calling function.
    throw error;
  }
}

/**
 * Fetches a limited number of the most recent posts for the home page.
 *
 * @async
 * @returns {Promise<Array<Object>>} A sorted array of post data, or an empty array on error.
 */
export async function getSortedPostsData() {
  const query = `
    query GetRecentPosts {
      # Sort by publishedAt in descending order and limit to the 10 most recent.
      posts(sort: "publishedAt:desc", pagination: { limit: 10 }) {
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
  `;
  try {
    const data = await fetchAPI(query);
    // The data structure from Strapi v4+ nests attributes.
    return data?.posts?.data.map(post => post.attributes) || [];
  } catch (error) {
    console.error("Error in getSortedPostsData:", error.message);
    return []; // Return an empty array to prevent the site from crashing.
  }
}

/**
 * Fetches ALL posts for the archive page.
 * This query uses a high limit to simulate fetching all posts.
 *
 * @async
 * @returns {Promise<Array<Object>>} A sorted array of all post data, or an empty array on error.
 *
 * @suggestion FUTURE_ENHANCEMENT: Implement proper pagination if the number of posts
 * exceeds the Strapi API's max limit per request (default is 100). This would
 * involve making multiple requests to fetch all data.
 */
export async function getAllPostsForArchive() {
  const query = `
    query GetAllPosts {
      # Use a high pagination limit to fetch all posts. Adjust if necessary.
      posts(sort: "publishedAt:desc", pagination: { limit: 200 }) {
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
  `;
  try {
    const data = await fetchAPI(query);
    return data?.posts?.data.map(post => post.attributes) || [];
  } catch (error) {
    console.error("Error in getAllPostsForArchive:", error.message);
    return [];
  }
}


/**
 * Fetches all post slugs for generating static paths in Next.js.
 * This is used by `getStaticPaths` to pre-render every blog post page at build time.
 *
 * @async
 * @returns {Promise<Array<{params: {slug: string}}>>} An array of objects formatted for `getStaticPaths`.
 */
export async function getAllPostSlugs() {
  const query = `
    query GetAllPostSlugs {
      posts(pagination: { limit: 200 }) {
        data {
          attributes {
            Slug
          }
        }
      }
    }
  `;
  try {
    const data = await fetchAPI(query);
    return data?.posts?.data.map(post => ({
      params: {
        slug: post.attributes.Slug,
      },
    })) || [];
  } catch (error) {
    console.error("Error in getAllPostSlugs:", error.message);
    return [];
  }
}

/**
 * Fetches the complete data for a single post based on its slug.
 * This is used by `getStaticProps` on the dynamic post pages (`/posts/[slug].js`).
 *
 * @async
 * @param {string} slug - The slug of the post to fetch.
 * @returns {Promise<Object|null>} The full post data object, or null if not found or on error.
 */
export async function getPostData(slug) {
  const query = `
    query GetPostBySlug($slug: String!) {
      # Find the post where the Slug field equals the provided $slug variable.
      posts(filters: { Slug: { eq: $slug } }) {
        data {
          attributes {
            Title
            Slug
            BodyContent
            publishedAt
            MetaDescription
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
  try {
    const data = await fetchAPI(query, { variables: { slug } });
    const post = data?.posts?.data[0]?.attributes || null;

    if (post && post.FeaturedImage.data) {
      post.FeaturedImage = post.FeaturedImage.data.attributes;
    }

    return post;
  } catch (error) {
    console.error(`Error fetching post data for slug "${slug}":`, error.message);
    return null;
  }
}