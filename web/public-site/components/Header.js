import Link from 'next/link';
import { useRouter } from 'next/router';
import SearchBar from './SearchBar';

const Header = () => {
  const router = useRouter();

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
