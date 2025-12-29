/**
 * @file components/Layout.js
 * @description The main layout component for the entire site. It includes the
 * header, footer, and a consistent background style. It wraps around the content
 * of each page.
 *
 * @requires next/link - For client-side navigation between pages.
 * @requires next/head - For adding Google Analytics script tag
 * @requires next/router - For tracking page views on route changes
 */

import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { trackPageView, isGA4Loaded } from '../lib/analytics';

/**
 * The Layout component.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - The page content to be rendered inside the layout.
 * @returns {JSX.Element} The rendered layout with header, content, and footer.
 */
export default function Layout({ children }) {
  const router = useRouter();

  // Track page views when route changes
  useEffect(() => {
    if (!isGA4Loaded()) return;

    const handleRouteChange = (url) => {
      // Extract path and title for analytics
      const pathname = url.split('?')[0]; // Remove query params
      const pageTitle = document.title || 'Page';

      // Determine page type
      let pageType = 'page';
      if (pathname === '/') pageType = 'home';
      else if (pathname.startsWith('/posts/')) pageType = 'post';
      else if (pathname.startsWith('/archive/')) pageType = 'archive';
      else if (pathname.startsWith('/category/')) pageType = 'category';
      else if (pathname.startsWith('/tag/')) pageType = 'tag';

      trackPageView(pathname, pageTitle, pageType);
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => router.events.off('routeChangeComplete', handleRouteChange);
  }, []);
  return (
    <>
      <Head>
        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />

        {/* Google Analytics 4 */}
        {process.env.NEXT_PUBLIC_GA4_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA4_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA4_ID}', {
                    page_path: window.location.pathname,
                    send_page_view: true,
                  });
                `,
              }}
            />
          </>
        )}
      </Head>

      <div className="bg-gray-900 min-h-screen text-gray-300 font-sans flex flex-col">
        {/* Skip to Content Link - WCAG 2.1 AA Requirement */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-cyan-500 focus:text-white focus:px-4 focus:py-2 focus:rounded focus:outline-none"
        >
          Skip to main content
        </a>

        <header
          className="bg-gray-800/50 backdrop-blur-sm sticky top-0 z-10 border-b border-cyan-400/20"
          role="banner"
        >
          <nav
            className="container mx-auto px-6 py-4 flex justify-between items-center"
            role="navigation"
            aria-label="Main navigation"
          >
            <Link
              href="/"
              className="text-2xl font-bold text-cyan-400 hover:text-cyan-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:rounded transition-all"
              aria-label="Glad Labs Frontier - Home"
            >
              Glad Labs Frontier
            </Link>
            <div className="flex items-center gap-6">
              <Link
                href="/archive/1"
                className="text-gray-300 hover:text-cyan-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:rounded transition-all"
              >
                Archive
              </Link>
              <Link
                href="/about"
                className="text-gray-300 hover:text-cyan-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:rounded transition-all"
              >
                About
              </Link>
            </div>
          </nav>
        </header>

        {/* Main Content Area - Referenced by skip link */}
        <main
          id="main-content"
          className="flex-1 container mx-auto px-6 py-8"
          role="main"
        >
          {children}
        </main>

        {/* Footer */}
        <footer
          className="py-8 mt-12 border-t border-gray-800 bg-gray-800/30"
          role="contentinfo"
        >
          <div className="container mx-auto px-6">
            <div className="text-center text-gray-500 mb-6">
              <p className="mb-2">
                &copy; {new Date().getFullYear()} Glad Labs, LLC. An autonomous
                content experiment.
              </p>
              <nav
                className="flex justify-center gap-4"
                aria-label="Footer navigation"
              >
                <Link
                  href="/privacy-policy"
                  className="text-sm hover:text-cyan-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:rounded transition-all"
                >
                  Privacy Policy
                </Link>
                <span className="text-gray-700" aria-hidden="true">
                  •
                </span>
                <a
                  href="#main-content"
                  className="text-sm hover:text-cyan-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:rounded transition-all"
                >
                  Back to top
                </a>
              </nav>
            </div>
          </div>
        </footer>
      </div>

      {/* Global Accessibility Styles */}
      <style jsx global>{`
        /* Screen Reader Only Content */
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
          padding: inherit;
          margin: inherit;
          overflow: visible;
          clip: auto;
          white-space: normal;
        }

        /* Focus Visible Styles */
        *:focus-visible {
          outline: none;
        }

        /* Respect Prefers Reduced Motion */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

        /* High Contrast Mode Support */
        @media (prefers-contrast: more) {
          * {
            border-width: 2px;
          }

          input,
          textarea,
          select {
            border: 2px solid currentColor;
          }

          a {
            text-decoration: underline;
            text-decoration-thickness: 2px;
          }
        }

        /* Ensure focus indicators are always visible */
        :focus-visible {
          outline: 2px solid currentColor;
          outline-offset: 2px;
        }
      `}</style>
    </>
  );
}
