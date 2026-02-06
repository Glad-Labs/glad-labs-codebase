import AdSenseScript from '../components/AdSenseScript';
import CookieConsentBanner from '../components/CookieConsentBanner.jsx';
import Footer from '../components/Footer';
import { TopNavigation } from '../components/TopNav';
// import { Analytics } from '@vercel/analytics/react'; // Temporarily disabled for local dev
import '../styles/globals.css';

export const metadata = {
  title: 'Glad Labs - Technology & Innovation',
  description:
    'Exploring the future of technology, AI, and digital innovation at Glad Labs',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'https://glad-labs.com'
  ),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://glad-labs.com',
    title: 'Glad Labs',
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
    site: '@GladLabsAI',
    creator: '@GladLabsAI',
  },
  robots: {
    index: true,
    follow: true,
    'max-snippet': -1,
    'max-image-preview': 'large',
    'max-video-preview': -1,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
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
        <TopNavigation />
        <main id="main-content" className="flex-grow">
          {children}
        </main>
        <Footer />
        {/* Client-side components that need hydration */}
        <AdSenseScript />
        <CookieConsentBanner />
        {/* <Analytics /> */}{' '}
        {/* Temporarily disabled - enable on Vercel deployment */}
      </body>
    </html>
  );
}
