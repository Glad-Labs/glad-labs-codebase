/**
 * Posts API Functions
 * Fetches post data from the FastAPI backend
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  'http://localhost:8000';

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featured_image_url?: string;
  cover_image_url?: string;
  author_id?: string;
  category_id?: string;
  status: string;
  published_at?: string;
  created_at: string;
  updated_at: string;
  view_count: number;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
}

export interface PostsResponse {
  posts: Post[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

const POSTS_PER_PAGE = 10;

/**
 * Fetch paginated list of published posts
 */
export async function getPosts(page: number = 1): Promise<PostsResponse> {
  try {
    const skip = (page - 1) * POSTS_PER_PAGE;

    const response = await fetch(
      `${API_BASE_URL}/api/posts?skip=${skip}&limit=${POSTS_PER_PAGE}&status=published`,
      {
        next: { revalidate: 3600 }, // ISR: revalidate every hour
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      posts: data.items || [],
      total: data.total || 0,
      page,
      pageSize: POSTS_PER_PAGE,
      totalPages: Math.ceil((data.total || 0) / POSTS_PER_PAGE),
    };
  } catch (error) {
    console.error('Error fetching posts:', error);
    // Return empty result on error
    return {
      posts: [],
      total: 0,
      page,
      pageSize: POSTS_PER_PAGE,
      totalPages: 0,
    };
  }
}

/**
 * Fetch a single post by slug
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    // Fetch all published posts and filter by slug (backend doesn't have /by-slug endpoint)
    const response = await fetch(
      `${API_BASE_URL}/api/posts?populate=*&status=published`,
      {
        next: { revalidate: 3600 }, // ISR: revalidate every hour
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const posts = data.data || data || [];
    const post = posts.find((p: Post) => p.slug === slug);

    return post || null;
  } catch (error) {
    console.error(`Error fetching post with slug ${slug}:`, error);
    return null;
  }
}

/**
 * Fetch related posts from the same category
 */
export async function getRelatedPosts(
  categoryId: string,
  excludeId: string,
  limit: number = 3
): Promise<Post[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/posts?category_id=${categoryId}&exclude_id=${excludeId}&limit=${limit}&status=published`,
      {
        next: { revalidate: 3600 }, // ISR: revalidate every hour
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch related posts');
    }

    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error('Error fetching related posts:', error);
    return [];
  }
}

/**
 * Fetch posts by category
 */
export async function getPostsByCategory(
  categoryId: string,
  page: number = 1
): Promise<PostsResponse> {
  try {
    const skip = (page - 1) * POSTS_PER_PAGE;

    const response = await fetch(
      `${API_BASE_URL}/api/posts?category_id=${categoryId}&skip=${skip}&limit=${POSTS_PER_PAGE}&status=published`,
      {
        next: { revalidate: 3600 }, // ISR: revalidate every hour
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch posts by category');
    }

    const data = await response.json();

    return {
      posts: data.items || [],
      total: data.total || 0,
      page,
      pageSize: POSTS_PER_PAGE,
      totalPages: Math.ceil((data.total || 0) / POSTS_PER_PAGE),
    };
  } catch (error) {
    console.error('Error fetching posts by category:', error);
    return {
      posts: [],
      total: 0,
      page,
      pageSize: POSTS_PER_PAGE,
      totalPages: 0,
    };
  }
}
