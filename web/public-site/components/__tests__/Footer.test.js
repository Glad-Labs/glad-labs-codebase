import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '../Footer';

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }) => <a href={href}>{children}</a>;
});

describe('Footer Component', () => {
  test('renders footer with contentinfo role', () => {
    const { container } = render(<Footer />);
    const footer = container.querySelector('footer');

    expect(footer).toHaveAttribute('role', 'contentinfo');
  });

  test('displays current year in copyright', () => {
    render(<Footer />);

    const currentYear = new Date().getFullYear();
    const copyrightText = screen.getByText(new RegExp(`${currentYear}`));

    expect(copyrightText).toBeInTheDocument();
  });

  test('renders main navigation sections', () => {
    render(<Footer />);

    expect(screen.getByText('Explore')).toBeInTheDocument();
    expect(screen.getByText('Legal')).toBeInTheDocument();
    expect(screen.getByText('Connect')).toBeInTheDocument();
  });

  test('renders all important links', () => {
    render(<Footer />);

    expect(screen.getByText('All Articles')).toBeInTheDocument();
    expect(screen.getByText('Latest Posts')).toBeInTheDocument();
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
    expect(screen.getByText('Terms of Service')).toBeInTheDocument();
    expect(screen.getByText('Get Updates')).toBeInTheDocument();
  });

  test('has correct link hrefs', () => {
    render(<Footer />);

    const articlesLink = screen.getByRole('link', { name: /All Articles/ });
    expect(articlesLink).toHaveAttribute('href', '/archive/1');

    const privacyLink = screen.getByRole('link', { name: /Privacy Policy/ });
    expect(privacyLink).toHaveAttribute('href', '/legal/privacy');

    const termsLink = screen.getByRole('link', { name: /Terms of Service/ });
    expect(termsLink).toHaveAttribute('href', '/legal/terms');
  });

  test('renders brand description', () => {
    render(<Footer />);

    expect(
      screen.getByText(/Transforming digital innovation/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Built for innovation, powered by AI/)
    ).toBeInTheDocument();
  });

  test('renders logo link', () => {
    render(<Footer />);

    const logoLink = screen
      .getAllByRole('link')
      .find((link) => link.textContent.includes('GL'));
    expect(logoLink).toHaveAttribute('href', '/');
  });

  test('has proper navigation labels for accessibility', () => {
    const { container } = render(<Footer />);

    const exploreNav = container.querySelector(
      '[aria-label="Explore navigation"]'
    );
    expect(exploreNav).toBeInTheDocument();
  });
});
