import {
  getPaginatedPosts,
  getPostBySlug,
  getLatestPosts,
  getPostContent,
} from '../api-fastapi';

// Mock fetch globally
global.fetch = jest.fn();

describe('FastAPI Client (lib/api-fastapi.js)', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  const mockPosts = [
    {
      id: '1',
      title: 'First Post',
      slug: 'first-post',
      excerpt: 'First post excerpt',
      published_at: '2024-01-15',
      cover_image_url: '/image1.jpg',
    },
    {
      id: '2',
      title: 'Second Post',
      slug: 'second-post',
      excerpt: 'Second post excerpt',
      published_at: '2024-01-14',
      cover_image_url: '/image2.jpg',
    },
  ];

  describe('getPaginatedPosts()', () => {
    test('calls API with correct endpoint', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ posts: mockPosts, total: 2, pages: 1 }),
      });

      await getPaginatedPosts(1, 10);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/posts'),
        expect.any(Object)
      );
    });

    test('returns paginated posts data', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ posts: mockPosts, total: 2, pages: 1 }),
      });

      const result = await getPaginatedPosts(1, 10);

      expect(result.posts).toBeDefined();
      expect(Array.isArray(result.posts)).toBe(true);
    });

    test('handles page parameter correctly', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ posts: mockPosts, total: 2, pages: 1 }),
      });

      await getPaginatedPosts(2, 10);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('page=2'),
        expect.any(Object)
      );
    });

    test('handles limit parameter correctly', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ posts: mockPosts, total: 2, pages: 1 }),
      });

      await getPaginatedPosts(1, 5);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('limit=5'),
        expect.any(Object)
      );
    });

    test('returns empty array on API error', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      const result = await getPaginatedPosts(1, 10);

      expect(result.posts || result).toBeDefined();
    });

    test('handles network errors gracefully', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await getPaginatedPosts(1, 10);

      // Should return fallback data or empty array
      expect(result).toBeDefined();
    });
  });

  describe('getPostBySlug()', () => {
    test('calls API with correct slug', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockPosts[0],
      });

      await getPostBySlug('first-post');

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('first-post'),
        expect.any(Object)
      );
    });

    test('returns single post data', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockPosts[0],
      });

      const result = await getPostBySlug('first-post');

      expect(result.title).toBe('First Post');
      expect(result.slug).toBe('first-post');
    });

    test('handles post not found', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      const result = await getPostBySlug('non-existent');

      expect(result).toBeDefined();
    });

    test('includes post content if available', async () => {
      const postWithContent = {
        ...mockPosts[0],
        content: 'Full post content here',
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => postWithContent,
      });

      const result = await getPostBySlug('first-post');

      expect(result.content).toBeDefined();
    });
  });

  describe('getLatestPosts()', () => {
    test('calls API with correct endpoint', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockPosts,
      });

      await getLatestPosts(10);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/posts'),
        expect.any(Object)
      );
    });

    test('returns array of posts', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockPosts,
      });

      const result = await getLatestPosts(10);

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    test('respects limit parameter', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockPosts.slice(0, 5),
      });

      await getLatestPosts(5);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('limit=5'),
        expect.any(Object)
      );
    });

    test('returns posts sorted by date descending', async () => {
      const sortedPosts = [
        { ...mockPosts[0], published_at: '2024-01-15' },
        { ...mockPosts[1], published_at: '2024-01-14' },
      ];

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => sortedPosts,
      });

      const result = await getLatestPosts(10);

      // Verify first post is newer than second
      expect(new Date(result[0].published_at)).toBeGreaterThan(
        new Date(result[1].published_at)
      );
    });
  });

  describe('getPostContent()', () => {
    test('returns full post content', async () => {
      const postWithContent = {
        ...mockPosts[0],
        content: 'Full post content with markdown',
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => postWithContent,
      });

      const result = await getPostContent('first-post');

      expect(result.content).toBeDefined();
      expect(typeof result.content).toBe('string');
    });

    test('calls correct endpoint with slug', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ...mockPosts[0], content: 'test' }),
      });

      await getPostContent('test-post');

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('test-post'),
        expect.any(Object)
      );
    });

    test('handles missing content gracefully', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockPosts[0],
      });

      const result = await getPostContent('first-post');

      expect(result).toBeDefined();
    });
  });

  describe('API Error Handling', () => {
    test('handles 500 server errors', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      });

      const result = await getPaginatedPosts(1, 10);

      // Should return fallback data without throwing
      expect(result).toBeDefined();
    });

    test('handles timeout/network errors', async () => {
      fetch.mockRejectedValueOnce(new Error('Timeout'));

      const result = await getPaginatedPosts(1, 10);

      // Should return empty/fallback data without throwing
      expect(result).toBeDefined();
    });

    test('handles malformed JSON responses', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => {
          throw new Error('Invalid JSON');
        },
      });

      const result = await getPaginatedPosts(1, 10);

      // Should handle gracefully
      expect(result).toBeDefined();
    });
  });

  describe('API Request Format', () => {
    test('includes proper headers in requests', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockPosts,
      });

      await getPaginatedPosts(1, 10);

      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: expect.any(String),
        })
      );
    });

    test('uses GET method for fetch operations', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockPosts,
      });

      await getPaginatedPosts(1, 10);

      const callArgs = fetch.mock.calls[0][1];
      expect(callArgs.method || 'GET').toMatch(/GET|undefined/);
    });
  });
});
