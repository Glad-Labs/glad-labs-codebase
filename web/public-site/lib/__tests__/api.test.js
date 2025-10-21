/**
 * API Client Tests
 *
 * Tests for lib/api.js - Core data fetching with timeout protection
 * This is CRITICAL functionality that must not break
 *
 * Note: fetchAPI is internal (not exported). We test exported functions:
 * - getStrapiURL() - URL construction
 * - getPaginatedPosts() - Paginated post fetching
 * - getFeaturedPost() - Featured post retrieval
 * - getPostBySlug() - Single post by slug
 * - getCategories() - Category listing
 * - getTags() - Tag listing
 */

import {
  getStrapiURL,
  getPaginatedPosts,
  getFeaturedPost,
  getPostBySlug,
  getCategories,
  getTags,
} from '../api';

// Mock fetch globally
global.fetch = jest.fn();

// Helper to reset env vars
const resetEnv = () => {
  delete process.env.NEXT_PUBLIC_STRAPI_API_URL;
  delete process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
  delete process.env.STRAPI_API_TOKEN;
};

describe('API Client - lib/api.js', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetEnv();
  });

  afterEach(() => {
    jest.clearAllMocks();
    resetEnv();
  });

  // ============================================================================
  // getStrapiURL Tests
  // ============================================================================

  describe('getStrapiURL', () => {
    it('constructs correct URL with path', () => {
      const result = getStrapiURL('/posts');
      expect(result).toContain('/posts');
    });

    it('handles empty path', () => {
      const result = getStrapiURL('');
      expect(result).toMatch(/localhost:1337|strapi/);
    });

    it('handles path without leading slash', () => {
      const result = getStrapiURL('posts');
      expect(result).toContain('posts');
    });

    it('appends path to base URL', () => {
      const result = getStrapiURL('/posts');
      const result2 = getStrapiURL('/categories/5');
      expect(result).toContain('/posts');
      expect(result2).toContain('/categories/5');
    });

    it('returns valid URL format', () => {
      const result = getStrapiURL('/posts');
      expect(result).toMatch(/^(https?:\/\/|http|localhost)/);
    });
  });

  // ============================================================================
  // getPaginatedPosts Tests
  // ============================================================================

  describe('getPaginatedPosts', () => {
    it('fetches paginated posts successfully', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [
            { id: 1, attributes: { title: 'Post 1' } },
            { id: 2, attributes: { title: 'Post 2' } },
          ],
          meta: { pagination: { page: 1, pageSize: 10, total: 20 } },
        }),
      });

      const result = await getPaginatedPosts();

      expect(result).toBeDefined();
      expect(result.data).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
      expect(global.fetch).toHaveBeenCalled();
    });

    it('handles pagination parameters', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [],
          meta: { pagination: { page: 2, pageSize: 20 } },
        }),
      });

      const result = await getPaginatedPosts(2, 20);

      expect(result).toBeDefined();
      expect(result.data).toBeDefined();
      expect(global.fetch).toHaveBeenCalled();
    });

    it('returns safe empty response on API error', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await getPaginatedPosts();

      expect(result).toBeDefined();
      expect(result.data).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.data.length).toBe(0);
    });

    it('returns safe empty response on 404', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      });

      const result = await getPaginatedPosts();

      expect(result).toBeDefined();
      expect(result.data).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
    });

    it('handles invalid JSON response safely', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => {
          throw new Error('Invalid JSON');
        },
      });

      const result = await getPaginatedPosts();

      expect(result).toBeDefined();
      expect(result.data).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
    });

    it('defaults to page 1 if not provided', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [],
          meta: { pagination: { page: 1 } },
        }),
      });

      const result = await getPaginatedPosts();

      expect(result.meta.pagination.page).toBe(1);
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  // ============================================================================
  // getFeaturedPost Tests
  // ============================================================================

  describe('getFeaturedPost', () => {
    it('fetches featured post successfully', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: { id: 1, attributes: { title: 'Featured Post' } },
        }),
      });

      const result = await getFeaturedPost();

      expect(result).toBeDefined();
      expect(global.fetch).toHaveBeenCalled();
    });

    it('returns null on error', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await getFeaturedPost();

      expect(result).toBeNull();
    });

    it('returns null if no featured post found', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: null }),
      });

      const result = await getFeaturedPost();

      expect(result).toBeNull();
    });

    it('handles 404 response', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      const result = await getFeaturedPost();

      expect(result).toBeNull();
    });
  });

  // ============================================================================
  // getPostBySlug Tests
  // ============================================================================

  describe('getPostBySlug', () => {
    it('fetches post by slug successfully', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: {
            id: 1,
            attributes: { title: 'Test Post', slug: 'test-post' },
          },
        }),
      });

      const result = await getPostBySlug('test-post');

      expect(result).toBeDefined();
      expect(global.fetch).toHaveBeenCalled();
    });

    it('includes slug in API call', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: null }),
      });

      await getPostBySlug('my-test-post');

      const callUrl = global.fetch.mock.calls[0][0];
      expect(callUrl).toContain('my-test-post');
    });

    it('returns null on error', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await getPostBySlug('test');

      expect(result).toBeNull();
    });

    it('handles empty slug', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: null }),
      });

      const result = await getPostBySlug('');

      expect(result).toBeNull();
    });
  });

  // ============================================================================
  // getCategories Tests
  // ============================================================================

  describe('getCategories', () => {
    it('fetches categories successfully', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [
            { id: 1, attributes: { name: 'Tech' } },
            { id: 2, attributes: { name: 'Business' } },
          ],
        }),
      });

      const result = await getCategories();

      expect(Array.isArray(result)).toBe(true);
      expect(global.fetch).toHaveBeenCalled();
    });

    it('returns empty array on error', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await getCategories();

      expect(Array.isArray(result)).toBe(true);
    });

    it('handles empty response', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: null }),
      });

      const result = await getCategories();

      expect(Array.isArray(result)).toBe(true);
    });
  });

  // ============================================================================
  // getTags Tests
  // ============================================================================

  describe('getTags', () => {
    it('fetches tags successfully', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [
            { id: 1, attributes: { name: 'React' } },
            { id: 2, attributes: { name: 'Next.js' } },
          ],
        }),
      });

      const result = await getTags();

      expect(Array.isArray(result)).toBe(true);
      expect(global.fetch).toHaveBeenCalled();
    });

    it('returns empty array on error', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await getTags();

      expect(Array.isArray(result)).toBe(true);
    });

    it('handles null response', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: null }),
      });

      const result = await getTags();

      expect(Array.isArray(result)).toBe(true);
    });
  });
});
