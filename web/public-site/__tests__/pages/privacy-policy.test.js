/**
 * Tests for Privacy Policy Page
 * Tests Strapi v5 API integration
 */

import { render, screen } from '@testing-library/react';
import PrivacyPolicy, { getStaticProps } from '../../../pages/privacy-policy';

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

describe('Privacy Policy Page', () => {
  describe('Component Rendering', () => {
    it('renders privacy policy from Strapi', () => {
      const mockData = {
        title: 'Privacy Policy',
        effective_date: '2024-01-01',
        content: '# Privacy Policy\n\nYour privacy is important.',
      };

      render(<PrivacyPolicy data={mockData} />);

      expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
    });

    it('renders fallback content when no Strapi data', () => {
      render(<PrivacyPolicy data={null} />);

      expect(screen.getByText(/Privacy Policy/i)).toBeInTheDocument();
      expect(screen.getByText(/information we collect/i)).toBeInTheDocument();
    });
  });

  describe('getStaticProps', () => {
    beforeEach(() => {
      global.fetch = jest.fn();
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('fetches privacy policy from Strapi v5 API', async () => {
      const mockResponse = {
        data: {
          id: 1,
          title: 'Privacy Policy',
          content: 'Test content',
        },
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await getStaticProps();

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/privacy-policy?populate=*'),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: expect.any(String),
          }),
        })
      );

      expect(result.props.data).toEqual(mockResponse.data);
    });

    it('handles Strapi v5 response structure correctly', async () => {
      // Strapi v5: data directly, not data.attributes
      const mockResponse = {
        data: {
          id: 1,
          title: 'Test Policy',
          content: 'Test',
        },
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await getStaticProps();

      expect(result.props.data.title).toBe('Test Policy');
    });

    it('handles API errors', async () => {
      global.fetch.mockRejectedValueOnce(new Error('API Error'));

      const result = await getStaticProps();

      expect(result.props.data).toBeNull();
    });
  });
});
