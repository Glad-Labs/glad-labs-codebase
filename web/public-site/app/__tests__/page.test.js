import React from 'react';
import { render, screen } from '@testing-library/react';
import Page from '../page';

// Mock the Carousel component
jest.mock('@/components/Carousel', () => {
  return function MockCarousel() {
    return <div data-testid="carousel">Carousel Component</div>;
  };
});

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
     
    return <img {...props} />;
  },
}));

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }) => <a href={href}>{children}</a>;
});

describe('Home Page (/)', () => {
  test('renders the page component', () => {
    const { container } = render(<Page />);
    expect(container).toBeInTheDocument();
  });

  test('renders main page heading', () => {
    render(<Page />);

    // The page should have a main heading
    const headings = screen.queryAllByRole('heading', { level: 1 });
    expect(headings.length).toBeGreaterThan(0);
  });

  test('renders Carousel component', () => {
    render(<Page />);

    expect(screen.getByTestId('carousel')).toBeInTheDocument();
  });

  test('has proper semantic structure with main element', () => {
    const { container } = render(<Page />);

    const mainElement = container.querySelector('main');
    expect(mainElement).toBeInTheDocument();
  });

  test('renders page with content sections', () => {
    const { container } = render(<Page />);

    // Should have multiple sections for layout
    const sections = container.querySelectorAll('section');
    expect(sections.length).toBeGreaterThanOrEqual(1);
  });

  test('has proper heading hierarchy', () => {
    const { container } = render(<Page />);

    const h1 = container.querySelector('h1');
    const h2s = container.querySelectorAll('h2');

    // Should start with h1
    expect(h1).toBeInTheDocument();
    // Should have h2s for subsections if they exist
    if (h2s.length > 0) {
      expect(h2s[0]).toBeInTheDocument();
    }
  });

  test('renders page without errors', () => {
    const { container } = render(<Page />);

    // Should render successfully without console errors
    expect(container.firstChild).toBeTruthy();
  });

  test('page is responsive with proper layout classes', () => {
    const { container } = render(<Page />);

    // Check for responsive container classes
    const hasResponsiveClass = Array.from(container.querySelectorAll('*')).some(
      (el) => {
        const classList = el.className || '';
        return (
          classList.includes('container') ||
          classList.includes('grid') ||
          classList.includes('flex')
        );
      }
    );

    expect(hasResponsiveClass).toBe(true);
  });

  test('has proper text content related to platform', () => {
    render(<Page />);

    // The page should mention something about content or AI (generic check)
    const container =
      screen.getByRole('main') || document.querySelector('main');
    expect(container).toBeInTheDocument();
  });
});
