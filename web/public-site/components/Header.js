'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-slate-950/80 backdrop-blur-md border-b border-slate-800/50'
          : 'bg-transparent'
      }`}
    >
      <nav className="container mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="group flex items-center space-x-2">
          <div className="text-2xl md:text-3xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent group-hover:from-cyan-300 group-hover:to-blue-400 transition-all">
            GL
          </div>
          <span className="hidden sm:inline text-sm font-semibold text-slate-300 group-hover:text-white transition-colors">
            Glad Labs
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-8">
          <Link
            href="/archive/1"
            className="text-slate-300 hover:text-white font-medium transition-colors relative group"
          >
            Articles
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 group-hover:w-full transition-all duration-300" />
          </Link>
          <Link
            href="/legal/privacy"
            className="text-slate-300 hover:text-white font-medium transition-colors relative group"
          >
            About
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 group-hover:w-full transition-all duration-300" />
          </Link>
        </div>

        {/* CTA Button */}
        <Link
          href="/archive/1"
          className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-105"
        >
          <span className="hidden sm:inline">Explore</span>
          <span className="sm:hidden">Read</span>
        </Link>
      </nav>
    </header>
  );
}
    try {
      await logout();
    } catch (error) {
      console.error('[Auth] Logout error:', error);
    } finally {
      // Clear local state regardless of API response
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      setUser(null);
      router.push('/');
    }
  };

  // Determine if route is active
  const isActive = (href) => router.pathname === href;

  return (
    <>
      {/* Skip to Content Link - Screen reader and keyboard accessible */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only absolute left-0 top-0 z-50 p-2 bg-blue-600 text-white rounded-b rounded-r"
        tabIndex={0}
      >
        Skip to main content
      </a>

      <header
        className="bg-white shadow-md"
        role="banner"
        aria-label="Site header"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 h-16 flex-wrap">
            {/* Logo/Branding */}
            <div className="flex-shrink-0">
              <Link
                href="/"
                className="text-2xl font-bold text-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded px-2 py-1"
                aria-current={isActive('/') ? 'page' : undefined}
              >
                <span className="sr-only">Glad Labs - Home</span>
                <span aria-hidden="true">Glad Labs</span>
              </Link>
            </div>

            {/* Search Bar - Mobile Responsive */}
            <div className="w-full sm:w-auto md:flex-1 md:max-w-xs">
              <SearchBar />
            </div>

            {/* Main Navigation */}
            <nav
              className="hidden md:block"
              aria-label="Main navigation"
              role="navigation"
            >
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  href="/"
                  className="text-gray-600 hover:text-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded px-3 py-2 transition-colors"
                  aria-current={isActive('/') ? 'page' : undefined}
                >
                  Home
                </Link>
                <Link
                  href="/about"
                  className="text-gray-600 hover:text-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded px-3 py-2 transition-colors"
                  aria-current={isActive('/about') ? 'page' : undefined}
                >
                  About
                </Link>
                <Link
                  href="/archive/1"
                  className="text-gray-600 hover:text-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded px-3 py-2 transition-colors"
                  aria-current={isActive('/archive/1') ? 'page' : undefined}
                >
                  Archive
                </Link>
              </div>
            </nav>

            {/* Auth Section */}
            <div className="flex items-center gap-2">
              {!loading && (
                <>
                  {user ? (
                    <UserMenu user={user} onLogout={handleLogout} />
                  ) : (
                    <div className="flex gap-2">
                      <OAuthLoginButton
                        provider="github"
                        label="Sign In"
                        className="text-sm"
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Global Focus Styles - Add to component or use in globals.css */}
      <style jsx global>{`
        /* Screen reader only content */
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border-width: 0;
        }

        /* Show sr-only on focus */
        .focus\:not-sr-only:focus {
          position: static;
          width: auto;
          height: auto;
          overflow: visible;
          clip: auto;
          white-space: normal;
          margin: 0;
          padding: 0.5rem;
        }

        /* Enhanced focus visible for all interactive elements */
        :focus-visible {
          outline: none;
        }

        a:focus-visible,
        button:focus-visible,
        input:focus-visible,
        select:focus-visible,
        textarea:focus-visible {
          outline: 3px solid #3b82f6;
          outline-offset: 2px;
          border-radius: 4px;
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

        /* High contrast mode support */
        @media (prefers-contrast: more) {
          a,
          button {
            text-decoration: underline;
            font-weight: 600;
          }
        }
      `}</style>
    </>
  );
};

export default Header;
