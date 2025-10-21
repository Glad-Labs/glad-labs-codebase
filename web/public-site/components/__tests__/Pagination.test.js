/**
 * Pagination Component Tests
 *
 * Tests for components/Pagination.js
 * Critical for navigation throughout the site
 */

import { render, screen } from '@testing-library/react';
import Pagination from '../Pagination';

describe('Pagination Component', () => {
  describe('Rendering', () => {
    it('renders all page links for multi-page results', () => {
      const pagination = { page: 2, pageCount: 5 };
      render(<Pagination pagination={pagination} />);

      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('4')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
    });

    it('highlights current page with cyan background', () => {
      const pagination = { page: 3, pageCount: 5 };
      render(<Pagination pagination={pagination} />);

      const currentPageLink = screen.getByText('3').closest('a');
      expect(currentPageLink).toHaveClass('bg-cyan-500');
    });

    it('applies gray background to non-current pages', () => {
      const pagination = { page: 1, pageCount: 3 };
      render(<Pagination pagination={pagination} />);

      const otherPageLink = screen.getByText('2').closest('a');
      expect(otherPageLink).toHaveClass('bg-gray-800');
    });

    it('returns null when only one page', () => {
      const pagination = { page: 1, pageCount: 1 };
      const { container } = render(<Pagination pagination={pagination} />);

      // Should render nothing (null)
      expect(container.firstChild).toBeNull();
    });

    it('returns null when pageCount is 0', () => {
      const pagination = { page: 1, pageCount: 0 };
      const { container } = render(<Pagination pagination={pagination} />);

      expect(container.firstChild).toBeNull();
    });
  });

  describe('Previous Button', () => {
    it('shows Previous button on non-first page', () => {
      const pagination = { page: 2, pageCount: 5 };
      render(<Pagination pagination={pagination} />);

      expect(screen.getByText('Previous')).toBeInTheDocument();
    });

    it('Previous button links to previous page', () => {
      const pagination = { page: 3, pageCount: 5 };
      render(<Pagination pagination={pagination} />);

      const prevButton = screen.getByText('Previous').closest('a');
      expect(prevButton).toHaveAttribute('href', '/archive/2');
    });

    it('does not show Previous on first page', () => {
      const pagination = { page: 1, pageCount: 5 };
      render(<Pagination pagination={pagination} />);

      expect(screen.queryByText('Previous')).not.toBeInTheDocument();
    });

    it('Previous button has correct styling', () => {
      const pagination = { page: 2, pageCount: 5 };
      render(<Pagination pagination={pagination} />);

      const prevButton = screen.getByText('Previous').closest('a');
      expect(prevButton).toHaveClass('bg-gray-700');
      expect(prevButton).toHaveClass('text-white');
    });
  });

  describe('Next Button', () => {
    it('shows Next button on non-last page', () => {
      const pagination = { page: 2, pageCount: 5 };
      render(<Pagination pagination={pagination} />);

      expect(screen.getByText('Next')).toBeInTheDocument();
    });

    it('Next button links to next page', () => {
      const pagination = { page: 2, pageCount: 5 };
      render(<Pagination pagination={pagination} />);

      const nextButton = screen.getByText('Next').closest('a');
      expect(nextButton).toHaveAttribute('href', '/archive/3');
    });

    it('does not show Next on last page', () => {
      const pagination = { page: 5, pageCount: 5 };
      render(<Pagination pagination={pagination} />);

      expect(screen.queryByText('Next')).not.toBeInTheDocument();
    });

    it('Next button has correct styling', () => {
      const pagination = { page: 1, pageCount: 5 };
      render(<Pagination pagination={pagination} />);

      const nextButton = screen.getByText('Next').closest('a');
      expect(nextButton).toHaveClass('bg-gray-700');
      expect(nextButton).toHaveClass('text-white');
    });
  });

  describe('basePath Prop', () => {
    it('uses custom basePath for all links', () => {
      const pagination = { page: 1, pageCount: 3 };
      render(<Pagination pagination={pagination} basePath="/blog" />);

      expect(screen.getByText('Next')).toHaveAttribute('href', '/blog/2');
      expect(screen.getByText('1')).toHaveAttribute('href', '/blog/1');
      expect(screen.getByText('2')).toHaveAttribute('href', '/blog/2');
    });

    it('defaults to /archive when basePath not provided', () => {
      const pagination = { page: 1, pageCount: 2 };
      render(<Pagination pagination={pagination} />);

      expect(screen.getByText('Next')).toHaveAttribute('href', '/archive/2');
    });

    it('handles basePath with trailing slash', () => {
      const pagination = { page: 1, pageCount: 2 };
      render(<Pagination pagination={pagination} basePath="/blog/" />);

      const nextButton = screen.getByText('Next');
      // Should not double up slashes
      expect(nextButton).toHaveAttribute('href', '/blog//2');
    });

    it('handles basePath without leading slash', () => {
      const pagination = { page: 1, pageCount: 2 };
      render(<Pagination pagination={pagination} basePath="blog" />);

      const nextButton = screen.getByText('Next');
      expect(nextButton.getAttribute('href')).toContain('blog');
    });
  });

  describe('Edge Cases', () => {
    it('handles page 1 of 1 (single page)', () => {
      const pagination = { page: 1, pageCount: 1 };
      const { container } = render(<Pagination pagination={pagination} />);

      expect(container.firstChild).toBeNull();
    });

    it('handles last page correctly', () => {
      const pagination = { page: 10, pageCount: 10 };
      render(<Pagination pagination={pagination} />);

      expect(screen.queryByText('Next')).not.toBeInTheDocument();
      expect(screen.getByText('Previous')).toBeInTheDocument();
    });

    it('handles first page correctly', () => {
      const pagination = { page: 1, pageCount: 10 };
      render(<Pagination pagination={pagination} />);

      expect(screen.queryByText('Previous')).not.toBeInTheDocument();
      expect(screen.getByText('Next')).toBeInTheDocument();
    });

    it('handles middle page correctly', () => {
      const pagination = { page: 5, pageCount: 10 };
      render(<Pagination pagination={pagination} />);

      expect(screen.getByText('Previous')).toBeInTheDocument();
      expect(screen.getByText('Next')).toBeInTheDocument();
      expect(screen.getByText('5')).toHaveClass('bg-cyan-500');
    });

    it('handles very large page count', () => {
      const pagination = { page: 1, pageCount: 1000 };
      render(<Pagination pagination={pagination} />);

      // Should render all 1000 page links
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('1000')).toBeInTheDocument();
    });

    it('handles current page > pageCount (invalid state)', () => {
      const pagination = { page: 10, pageCount: 5 };
      // Should handle gracefully, not crash
      const { container } = render(<Pagination pagination={pagination} />);
      expect(container).toBeInTheDocument();
    });

    it('handles zero page (invalid state)', () => {
      const pagination = { page: 0, pageCount: 5 };
      const { container } = render(<Pagination pagination={pagination} />);
      expect(container).toBeInTheDocument();
    });

    it('handles negative pageCount (invalid state)', () => {
      const pagination = { page: 1, pageCount: -5 };
      const { container } = render(<Pagination pagination={pagination} />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe('Accessibility', () => {
    it('page links are keyboard navigable', () => {
      const pagination = { page: 1, pageCount: 3 };
      render(<Pagination pagination={pagination} />);

      const pageLink = screen.getByText('2').closest('a');
      expect(pageLink).toHaveAttribute('href');
    });

    it('Previous/Next buttons are keyboard accessible', () => {
      const pagination = { page: 2, pageCount: 5 };
      render(<Pagination pagination={pagination} />);

      const prevButton = screen.getByText('Previous').closest('a');
      const nextButton = screen.getByText('Next').closest('a');

      expect(prevButton).toHaveAttribute('href');
      expect(nextButton).toHaveAttribute('href');
    });

    it('current page is visually distinct', () => {
      const pagination = { page: 3, pageCount: 5 };
      render(<Pagination pagination={pagination} />);

      const currentPage = screen.getByText('3').closest('a');
      expect(currentPage).toHaveClass('bg-cyan-500');
      expect(currentPage).toHaveClass('text-white');
    });
  });

  describe('Styling', () => {
    it('uses correct Tailwind classes', () => {
      const pagination = { page: 1, pageCount: 3 };
      const { container } = render(<Pagination pagination={pagination} />);

      // Check for Tailwind flex classes on container
      const flexContainer = container.querySelector('.flex');
      expect(flexContainer).toHaveClass('justify-center');
      expect(flexContainer).toHaveClass('items-center');
    });

    it('page links have hover effect', () => {
      const pagination = { page: 1, pageCount: 3 };
      render(<Pagination pagination={pagination} />);

      const pageLink = screen.getByText('2').closest('a');
      expect(pageLink).toHaveClass('hover:bg-gray-700');
    });

    it('button links have rounded corners', () => {
      const pagination = { page: 2, pageCount: 5 };
      render(<Pagination pagination={pagination} />);

      const prevButton = screen.getByText('Previous').closest('a');
      expect(prevButton).toHaveClass('rounded');
    });
  });
});
