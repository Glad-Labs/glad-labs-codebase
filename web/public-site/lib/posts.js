async function fetchAPI(query, { variables } = {}) {
  const apiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337';
  const apiToken = process.env.STRAPI_API_TOKEN;

  if (!apiToken) {
    console.error("STRAPI_API_TOKEN is not set in .env.local");
    throw new Error("API token is missing.");
  }

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
  });

  const json = await res.json();
  if (json.errors) {
    console.error('GraphQL Errors:', JSON.stringify(json.errors, null, 2));
    throw new Error('Failed to fetch API');
  }

  return json.data;
}

export async function getSortedPostsData() {
  const query = `
    query GetPublicPosts {
      posts(sort: "publishedAt:desc", pagination: { limit: 10 }) {
        Title
        Slug
        publishedAt
        MetaDescription
      }
    }
  `;
  try {
    const data = await fetchAPI(query);
    return data?.posts || [];
  } catch (error) {
    console.error("Error in getSortedPostsData:", error.message);
    return [];
  }
}

export async function getAllPostSlugs() {
  const query = `
    query GetAllPostSlugs {
      posts {
        Slug
      }
    }
  `;
  const data = await fetchAPI(query);
  return data?.posts?.map(post => ({
    params: {
      slug: post.Slug,
    },
  })) || [];
}

export async function getPostData(slug) {
  const query = `
    query GetPostBySlug($slug: String!) {
      posts(filters: { Slug: { eq: $slug } }) {
        Title
        Slug
        BodyContent
        publishedAt
        MetaDescription
        FeaturedImage {
          url
          alternativeText
        }
      }
    }
  `;
  const data = await fetchAPI(query, { variables: { slug } });
  return data?.posts[0] || null;
}