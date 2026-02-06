import { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://glad-labs.com';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = SITE_URL.replace(/\/$/, ''); // Remove trailing slash if present

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/_next/', '/api/', '/.well-known/', '/admin/', '/private/'],
      },
      {
        userAgent: 'AhrefsBot',
        disallow: '/',
      },
      {
        userAgent: 'SemrushBot',
        disallow: '/',
      },
      {
        userAgent: 'DotBot',
        disallow: '/',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
