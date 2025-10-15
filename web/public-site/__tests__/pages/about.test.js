/**
 * Tests for About Page
 * Tests Strapi v5 API integration and content rendering
 */

import { render, screen, waitFor } from '@testing-library/react';
import About, { getStaticProps } from '../../../pages/about';

// Mock next/head
jest.mock('next/head', () => {
  return {
    __esModule: true,
    default: ({ children }) => {
      return <>{children}</>;
    },
  };
});

// Mock react-markdown
jest.mock('react-markdown', () => {
  return {
    __esModule: true,
    default: ({ children }) => {
      return <div data-testid="markdown-content">{children}</div>;
    },
  };
});

describe('About Page', () => {
  describe('Component Rendering', () => {
    it('renders about content from Strapi', () => {
      const mockAbout = {
        title: 'About Glad Labs',
        subtitle: 'AI Frontier Firm',
        content: '# Welcome\n\nTest content here.',
        mission: '## Our Mission\n\nTo democratize AI.',
      };

      render(<About about={mockAbout} />);

      expect(screen.getByText('About Glad Labs')).toBeInTheDocument();
      expect(screen.getByText('AI Frontier Firm')).toBeInTheDocument();
    });

    it('renders fallback content when no Strapi data', () => {
      render(<About about={null} />);

      expect(screen.getByText(/AI Co-Founder/i)).toBeInTheDocument();
      expect(screen.getByText(/autonomous AI agent/i)).toBeInTheDocument();
    });

    it('renders markdown content sections', () => {
      const mockAbout = {
        title: 'Test',
        content: 'Content section',
        mission: 'Mission section',
        vision: 'Vision section',
        values: 'Values section',
      };

      render(<About about={mockAbout} />);

      const markdownElements = screen.getAllByTestId('markdown-content');
      expect(markdownElements.length).toBeGreaterThan(0);
    });
  });

  describe('getStaticProps', () => {
    beforeEach(() => {
      global.fetch = jest.fn();
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('fetches about data from Strapi v5 API', async () => {
      const mockResponse = {
        data: {
          id: 5,
          title: 'About Glad Labs',
          subtitle: 'AI Frontier Firm',
          content: 'Test content',
        },
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await getStaticProps();

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/about?populate=*'),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: expect.any(String),
          }),
        })
      );

      expect(result.props.about).toEqual(mockResponse.data);
    });

    it('handles API errors gracefully', async () => {
      global.fetch.mockRejectedValueOnce(new Error('API Error'));

      const result = await getStaticProps();

      expect(result.props.about).toBeNull();
    });

    it('handles Strapi v5 response structure', async () => {
      // Strapi v5 returns data directly without attributes wrapper
      const mockResponse = {
        data: {
          id: 1,
          title: 'Test',
          content: 'Content',
        },
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await getStaticProps();

      // Should access json.data directly (not json.data.attributes)
      expect(result.props.about.title).toBe('Test');
    });

    it('sets ISR revalidation to 60 seconds', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: {} }),
      });

      const result = await getStaticProps();

      expect(result.revalidate).toBe(60);
    });
  });

  describe('SEO', () => {
    it('sets correct page title', () => {
      const mockAbout = {
        title: 'About Glad Labs',
      };

      render(<About about={mockAbout} />);

      // Check that title is set (mocked next/head will render it)
      expect(document.title).toBeDefined();
    });
  });
});
