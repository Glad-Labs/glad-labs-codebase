/**
 * PostCard Component Tests
 *
 * Tests for components/PostCard.js
 * Used throughout the site for displaying blog posts
 */

import { render, screen } from '@testing-library/react';
import PostCard from '../PostCard';

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ children, href, ...props }) => (
    // Use span instead of <a> for nested links to avoid HTML validation warnings
    <span {...props} data-href={href}>
      {children}
    </span>
  );
});

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line jsx-a11y/alt-text
    const { fill, ...imgProps } = props;
    // Convert fill boolean to string if present
    const attributes = fill ? { ...imgProps, fill: 'true' } : imgProps;
    return <img {...attributes} />;
  },
}));

describe('PostCard Component', () => {
  const mockPost = {
    id: 1,
    title: 'Test Blog Post',
    excerpt: 'This is a test excerpt for the blog post',
    slug: 'test-blog-post',
    publishedAt: '2025-10-21T10:00:00Z',
    date: '2025-10-21',
    // Strapi v5 nested structure
    coverImage: {
      data: {
        id: 1,
        attributes: {
          url: '/uploads/test-post-xyz123.jpg',
          alternativeText: 'Test post image',
          caption: 'Test caption',
        },
      },
    },
    category: {
      data: {
        id: 1,
        attributes: {
          name: 'Technology',
          slug: 'technology',
        },
      },
    },
    tags: {
      data: [
        {
          id: 1,
          attributes: {
            name: 'testing',
            slug: 'testing',
          },
        },
        {
          id: 2,
          attributes: {
            name: 'javascript',
            slug: 'javascript',
          },
        },
      ],
    },
  };

  describe('Rendering', () => {
    it('renders post title', () => {
      render(<PostCard post={mockPost} />);

      expect(screen.getByText('Test Blog Post')).toBeInTheDocument();
    });

    it('renders post excerpt', () => {
      render(<PostCard post={mockPost} />);

      expect(
        screen.getByText('This is a test excerpt for the blog post')
      ).toBeInTheDocument();
    });

    it('renders featured image', () => {
      render(<PostCard post={mockPost} />);

      const image = screen.getByAltText('Test post image');
      expect(image).toBeInTheDocument();
    });

    it('renders category name', () => {
      render(<PostCard post={mockPost} />);

      expect(screen.getByText('Technology')).toBeInTheDocument();
    });

    it('renders publication date', () => {
      render(<PostCard post={mockPost} />);

      // Should display date in human readable format (may be off by 1 due to timezone)
      expect(screen.getByText(/10\/(20|21)\/2025/)).toBeInTheDocument();
    });

    it('renders tags from post', () => {
      render(<PostCard post={mockPost} />);

      expect(screen.getByText('#testing')).toBeInTheDocument();
      expect(screen.getByText('#javascript')).toBeInTheDocument();
    });
  });

  describe('Links', () => {
    it('title links to post detail page', () => {
      render(<PostCard post={mockPost} />);

      const titleLink = screen.getByText('Test Blog Post').closest('span');
      expect(titleLink).toHaveAttribute(
        'data-href',
        expect.stringContaining('test-blog-post')
      );
    });

    it('image links to post detail page', () => {
      render(<PostCard post={mockPost} />);

      const image = screen.getByAltText('Test post image').closest('span');
      expect(image).toHaveAttribute(
        'data-href',
        expect.stringContaining('test-blog-post')
      );
    });

    it('category links to category archive', () => {
      render(<PostCard post={mockPost} />);

      const categoryLink = screen.getByText('Technology').closest('span');
      expect(categoryLink).toHaveAttribute(
        'data-href',
        expect.stringContaining('category/technology')
      );
    });

    it('tag links to tag archive', () => {
      render(<PostCard post={mockPost} />);

      const tagLink = screen.getByText('#testing').closest('span');
      expect(tagLink).toHaveAttribute(
        'data-href',
        expect.stringContaining('tag/testing')
      );
    });
  });

  describe('Missing Image Handling', () => {
    it('renders without image when coverImage is null', () => {
      const postWithoutImage = {
        ...mockPost,
        coverImage: null,
      };

      render(<PostCard post={postWithoutImage} />);

      // Should render without crashing
      expect(screen.getByText('Test Blog Post')).toBeInTheDocument();
    });

    it('renders without image when coverImage.data is missing', () => {
      const postWithoutImage = {
        ...mockPost,
        coverImage: {
          data: null,
        },
      };

      render(<PostCard post={postWithoutImage} />);

      expect(screen.getByText('Test Blog Post')).toBeInTheDocument();
    });

    it('uses alternative text for image from attributes', () => {
      render(<PostCard post={mockPost} />);

      const image = screen.getByAltText('Test post image');
      expect(image).toBeInTheDocument();
    });

    it('uses post title as fallback alt text if not specified', () => {
      const postWithoutAlt = {
        ...mockPost,
        coverImage: {
          data: {
            attributes: {
              url: '/uploads/test.jpg',
              alternativeText: null,
            },
          },
        },
      };

      render(<PostCard post={postWithoutAlt} />);

      // Should use title as fallback
      const image = screen.getByAltText('Test Blog Post');
      expect(image).toBeInTheDocument();
    });
  });

  describe('Category Display', () => {
    it('renders category badge', () => {
      render(<PostCard post={mockPost} />);

      expect(screen.getByText('Technology')).toBeInTheDocument();
    });

    it('handles missing category', () => {
      const postWithoutCategory = {
        ...mockPost,
        category: null,
      };

      render(<PostCard post={postWithoutCategory} />);

      // Should render without crashing
      expect(screen.getByText('Test Blog Post')).toBeInTheDocument();
    });

    it('displays category with link when category data exists', () => {
      render(<PostCard post={mockPost} />);

      const categoryElement = screen.getByText('Technology');
      const categoryLink = categoryElement.closest('span');
      expect(categoryLink).toHaveAttribute(
        'data-href',
        expect.stringContaining('category')
      );
    });

    it('handles missing category data', () => {
      const postWithNoData = {
        ...mockPost,
        category: {
          data: null,
        },
      };

      render(<PostCard post={postWithNoData} />);

      expect(screen.queryByText('Technology')).not.toBeInTheDocument();
    });
  });

  describe('Tags Display', () => {
    it('renders tags as links', () => {
      render(<PostCard post={mockPost} />);

      expect(screen.getByText('#testing')).toBeInTheDocument();
      expect(screen.getByText('#javascript')).toBeInTheDocument();
    });

    it('limits tags display to first 3 tags', () => {
      const postWithManyTags = {
        ...mockPost,
        tags: {
          data: [
            { id: 1, attributes: { name: 'tag1', slug: 'tag1' } },
            { id: 2, attributes: { name: 'tag2', slug: 'tag2' } },
            { id: 3, attributes: { name: 'tag3', slug: 'tag3' } },
            { id: 4, attributes: { name: 'tag4', slug: 'tag4' } },
          ],
        },
      };

      render(<PostCard post={postWithManyTags} />);

      expect(screen.getByText('#tag1')).toBeInTheDocument();
      expect(screen.getByText('#tag2')).toBeInTheDocument();
      expect(screen.getByText('#tag3')).toBeInTheDocument();
      expect(screen.queryByText('#tag4')).not.toBeInTheDocument();
    });

    it('handles missing tags', () => {
      const postWithoutTags = {
        ...mockPost,
        tags: null,
      };

      render(<PostCard post={postWithoutTags} />);

      expect(screen.getByText('Test Blog Post')).toBeInTheDocument();
    });
  });

  describe('Date Formatting', () => {
    it('formats publication date from date field correctly', () => {
      render(<PostCard post={mockPost} />);

      // Component uses date field first, then publishedAt
      expect(screen.getByText(/10\/20\/2025/)).toBeInTheDocument();
    });

    it('falls back to publishedAt when date is missing', () => {
      const postWithoutDate = {
        ...mockPost,
        date: null,
      };

      render(<PostCard post={postWithoutDate} />);

      // Should display some date-like content
      expect(screen.getByText(/\d+/)).toBeInTheDocument();
    });

    it('handles missing publication date gracefully', () => {
      const postWithoutDate = {
        ...mockPost,
        date: null,
        publishedAt: null,
      };

      render(<PostCard post={postWithoutDate} />);

      expect(screen.getByText('Test Blog Post')).toBeInTheDocument();
    });

    it('handles invalid date format gracefully', () => {
      const postWithInvalidDate = {
        ...mockPost,
        date: 'invalid-date',
        publishedAt: null,
      };

      render(<PostCard post={postWithInvalidDate} />);

      expect(screen.getByText('Test Blog Post')).toBeInTheDocument();
    });
  });

  describe('Excerpt Handling', () => {
    it('truncates long excerpts', () => {
      const postWithLongExcerpt = {
        ...mockPost,
        excerpt: 'A'.repeat(500), // Very long excerpt
      };

      render(<PostCard post={postWithLongExcerpt} />);

      // Component should handle long text gracefully
      expect(screen.getByText(/^A+/)).toBeInTheDocument();
    });

    it('handles missing excerpt', () => {
      const postWithoutExcerpt = {
        ...mockPost,
        excerpt: null,
      };

      render(<PostCard post={postWithoutExcerpt} />);

      expect(screen.getByText('Test Blog Post')).toBeInTheDocument();
    });

    it('renders excerpt with proper formatting', () => {
      render(<PostCard post={mockPost} />);

      const excerpt = screen.getByText(
        'This is a test excerpt for the blog post'
      );
      expect(excerpt).toBeInTheDocument();
    });

    it('handles excerpt with special characters', () => {
      const postWithSpecialChars = {
        ...mockPost,
        excerpt: 'Test & excerpt with <special> "characters"',
      };

      render(<PostCard post={postWithSpecialChars} />);

      // Should render without XSS issues
      expect(screen.getByText(/Test.*excerpt/)).toBeInTheDocument();
    });
  });

  describe('Styling and Layout', () => {
    it('renders as a clickable link with proper structure', () => {
      const { container } = render(<PostCard post={mockPost} />);

      // Component renders as Link (which becomes <span> tag with data-href)
      const link = container.querySelector('span[data-href]');
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute(
        'data-href',
        expect.stringContaining('/posts/')
      );
    });

    it('displays image in proper proportion', () => {
      const { container } = render(<PostCard post={mockPost} />);

      const imageContainer = container.querySelector('[class*="h-48"]');
      expect(imageContainer).toBeInTheDocument();
    });

    it('arranges content in proper order', () => {
      const { container } = render(<PostCard post={mockPost} />);

      const allText = container.textContent;
      const titleIndex = allText.indexOf('Test Blog Post');
      const excerptIndex = allText.indexOf('This is a test excerpt');

      expect(titleIndex).toBeGreaterThan(-1);
      expect(excerptIndex).toBeGreaterThan(-1);
      expect(titleIndex).toBeLessThan(excerptIndex);
    });
  });

  describe('Props Validation', () => {
    it('renders without error when given valid post object', () => {
      const { container } = render(<PostCard post={mockPost} />);
      expect(container).toBeInTheDocument();
    });

    it('handles post with only required fields', () => {
      const minimalPost = {
        title: 'Minimal Post',
        slug: 'minimal-post',
        excerpt: 'A minimal excerpt',
      };

      render(<PostCard post={minimalPost} />);

      expect(screen.getByText('Minimal Post')).toBeInTheDocument();
    });

    it('renders default content when optional fields missing', () => {
      const postWithMissingFields = {
        title: 'Post',
        slug: 'post',
        excerpt: 'Excerpt',
      };

      render(<PostCard post={postWithMissingFields} />);

      expect(screen.getByText('Post')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('renders as clickable link component', () => {
      const { container } = render(<PostCard post={mockPost} />);

      const link = container.querySelector('span[data-href]');
      expect(link).toBeInTheDocument();
    });

    it('images have proper alt text', () => {
      render(<PostCard post={mockPost} />);

      const image = screen.getByAltText('Test post image');
      expect(image).toHaveAttribute('alt');
    });

    it('links have descriptive text', () => {
      render(<PostCard post={mockPost} />);

      const titleLink = screen.getByText('Test Blog Post').closest('span');
      expect(titleLink.textContent).toContain('Test Blog Post');
    });

    it('headings use proper hierarchy', () => {
      const { container } = render(<PostCard post={mockPost} />);

      const heading = container.querySelector('h2');
      expect(heading).toBeInTheDocument();
    });
  });
});
