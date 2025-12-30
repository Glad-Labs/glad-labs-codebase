import AdSenseScript from '../components/AdSenseScript.jsx';
import CookieConsentBanner from '../components/CookieConsentBanner.tsx';
import '../styles/globals.css';

export const metadata = {
  title: 'Glad Labs Blog - Technology & Innovation',
  description:
    'Exploring the future of technology, AI, and digital innovation at Glad Labs',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com'
  ),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com',
    title: 'Glad Labs Blog',
    description:
      'Exploring the future of technology, AI, and digital innovation',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Glad Labs',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@yourtwitterhandle',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* AdSense Script - Loaded with afterInteractive strategy */}
        <AdSenseScript />

        {/* Analytics - If using Google Analytics */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                    'anonymize_ip': true,
                    'allow_google_signals': false,
                    'allow_ad_personalization_signals': false
                  });
                `,
              }}
            />
          </>
        )}
      </head>
      <body>
        {children}
        {/* Cookie Consent Banner */}
        <CookieConsentBanner />
      </body>
    </html>
  );
}
