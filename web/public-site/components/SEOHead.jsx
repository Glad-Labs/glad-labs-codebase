'use client';

import Head from 'next/head';

/**
 * SEOHead Component
 * Renders meta tags, Open Graph, Twitter Cards, and JSON-LD schemas
 * WCAG 2.1 AA Compliant: Includes proper language meta, viewport, and semantic structure
 * Used on article pages and other SEO-critical pages
 */
export default function SEOHead({
  title = 'Glad Labs - AI Co-Founder Blog',
  description = 'Explore insights on AI, business automation, and digital transformation.',
  canonical = '',
  ogTags = {},
  twitterTags = {},
  keywords = '',
  robots = 'index, follow',
  schema = null,
  lang = 'en',
  children = null,
}) {
  // Ensure OG tags have defaults
  const ogDefaults = {
    'og:type': 'website',
    'og:site_name': 'Glad Labs',
    ...ogTags,
  };

  // Ensure Twitter tags have defaults
  const twitterDefaults = {
    'twitter:card': 'summary_large_image',
    'twitter:site': '@GladLabsAI',
    ...twitterTags,
  };

  // Validate required fields
  if (!title) {
    console.warn(
      'SEOHead: title prop is required for accessibility and SEO. Missing page title will impact screen readers and search engines.'
    );
  }

  if (!description) {
    console.warn(
      'SEOHead: description prop is recommended for accessibility and SEO. Missing meta description may affect search results and user understanding.'
    );
  }

  return (
    <Head>
      {/* WCAG 2.1 AA: Language Declaration - Required for screen readers to pronounce content correctly */}
      <html lang={lang} />

      {/* WCAG 2.1 AA: Character Encoding - Required for proper text rendering and accessibility */}
      <meta charSet="utf-8" />

      {/* WCAG 2.1 AA: Viewport Meta - Critical for responsive design and keyboard navigation on mobile */}
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes"
      />

      {/* Page Title - Critical for screen readers and browser tab context */}
      <title>{title}</title>

      {/* Meta Description - Summary for screen readers and search results */}
      <meta name="description" content={description} />

      {/* Keywords - Optional but helpful for SEO */}
      {keywords && <meta name="keywords" content={keywords} />}

      {/* Robots Meta - Control indexing behavior */}
      <meta name="robots" content={robots} />

      {/* Color Scheme - Support for prefers-color-scheme (WCAG 2.1 Enhancement) */}
      <meta name="color-scheme" content="dark light" />

      {/* Theme Color - Browser chrome color on mobile */}
      <meta name="theme-color" content="#00d4ff" />

      {/* Accessibility Meta Tags */}
      {/* Format Detection - Disable automatic phone/email linking for better control */}
      <meta
        name="format-detection"
        content="telephone=no, email=no, address=no"
      />

      {/* Mobile Web App Status Bar Style - Improves mobile accessibility */}
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta
        name="apple-mobile-web-app-status-bar-style"
        content="black-translucent"
      />

      {/* Canonical URL for duplicate content prevention */}
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Open Graph Meta Tags for Social Media - Improves sharing accessibility */}
      {Object.entries(ogDefaults).map(([key, value]) =>
        value ? (
          <meta
            key={key}
            property={key}
            content={String(value)}
            // WCAG: Ensure OG tags have proper encoding
          />
        ) : null
      )}

      {/* Twitter Card Meta Tags - Enables accessible sharing on Twitter */}
      {Object.entries(twitterDefaults).map(([key, value]) =>
        value ? (
          <meta
            key={key}
            name={key}
            content={String(value)}
            // WCAG: Proper meta tag structure for social accessibility
          />
        ) : null
      )}

      {/* JSON-LD Structured Data Schema - Helps search engines and assistive tech understand content */}
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema, null, 2),
          }}
          // WCAG: Structured data improves accessibility for assistive technologies
        />
      )}

      {/* Favicon and Icons - Essential for browser tab accessibility */}
      <link rel="icon" href="/favicon.ico" type="image/x-icon" />
      <link
        rel="apple-touch-icon"
        href="/apple-touch-icon.png"
        type="image/png"
      />

      {/* PWA Manifest - Enables offline accessibility and installability */}
      <link rel="manifest" href="/manifest.json" />

      {/* Preconnect and DNS Prefetch for external resources - Improves load time accessibility */}
      {/* eslint-disable-next-line @next/next/google-font-preconnect */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      <link rel="dns-prefetch" href="https://fonts.gstatic.com" />

      {/* Additional Children (for custom meta tags if needed) */}
      {children}
    </Head>
  );
}

/**
 * Alternative: Advanced SEOHead with multiple schema support
 * WCAG 2.1 AA Compliant: Supports multiple structured data schemas
 * Useful when you need to render multiple JSON-LD schemas (e.g., Article + Organization)
 */
export function SEOHeadAdvanced({
  title = 'Glad Labs',
  description = '',
  canonical = '',
  ogTags = {},
  twitterTags = {},
  schemas = [], // Array of schema objects
  lang = 'en',
  children = null,
}) {
  const ogDefaults = {
    'og:type': 'website',
    'og:site_name': 'Glad Labs',
    ...ogTags,
  };

  const twitterDefaults = {
    'twitter:card': 'summary_large_image',
    'twitter:site': '@GladLabsAI',
    ...twitterTags,
  };

  // Combine multiple schemas
  const combinedSchema =
    schemas.length === 1
      ? schemas[0]
      : {
          '@context': 'https://schema.org',
          '@graph': schemas,
        };

  return (
    <Head>
      {/* WCAG 2.1 AA: Language Declaration */}
      <html lang={lang} />

      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="description" content={description} />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes"
      />
      <meta name="color-scheme" content="dark light" />

      {canonical && <link rel="canonical" href={canonical} />}

      {/* Open Graph Tags */}
      {Object.entries(ogDefaults).map(([key, value]) =>
        value ? <meta key={key} property={key} content={String(value)} /> : null
      )}

      {/* Twitter Tags */}
      {Object.entries(twitterDefaults).map(([key, value]) =>
        value ? <meta key={key} name={key} content={String(value)} /> : null
      )}

      {/* Multiple Schemas - Proper JSON-LD structure for accessibility */}
      {schemas.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(combinedSchema, null, 2),
          }}
        />
      )}

      {children}
    </Head>
  );
}
