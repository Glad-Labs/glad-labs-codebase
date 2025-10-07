const STRAPI_API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;

async function fetchAPI(query, { variables } = {}) {
  const res = await fetch(`${STRAPI_API_URL}/graphql`, {
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

export async function getPaginatedPosts(page = 1, pageSize = 10) {
  const data = await fetchAPI(
    `
    query GetPosts($page: Int, $pageSize: Int) {
      posts(pagination: { page: $page, pageSize: $pageSize }, sort: "publishedAt:desc") {
        data {
          id
          attributes {
            Title
            Slug
            publishedAt
            Excerpt
          }
        }
        meta {
          pagination {
            page
            pageSize
            total
            pageCount
          }
        }
      }
    }
  `,
    { variables: { page, pageSize } }
  );
  return data.posts;
}

export async function getPostBySlug(slug) {
  const data = await fetchAPI(
    `
    query GetPostBySlug($slug: String!) {
      posts(filters: { Slug: { eq: $slug } }) {
        data {
          id
          attributes {
            Title
            BodyContent
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
  `,
    { variables: { slug } }
  );
  return data.posts.data[0];
}
