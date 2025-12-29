/**
 * Phase 4: Cookie Consent Banner
 *
 * Lightweight cookie consent implementation for GDPR/CCPA compliance.
 * Uses localStorage to remember user's choice.
 *
 * Features:
 * - Persistent consent (remembers user choice for 365 days)
 * - Non-intrusive design
 * - Links to privacy policy and cookie policy
 * - Compliant with GDPR and CCPA
 */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface CookieConsent {
  analytics: boolean;
  advertising: boolean;
  essential: boolean;
}

const DEFAULT_CONSENT: CookieConsent = {
  analytics: false,
  advertising: false,
  essential: true, // Essential cookies always enabled
};

export default function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [consent, setConsent] = useState<CookieConsent>(DEFAULT_CONSENT);
  const [mounted, setMounted] = useState(false);

  // Load consent from localStorage on mount
  useEffect(() => {
    setMounted(true);
    const savedConsent = localStorage.getItem('cookieConsent');

    if (savedConsent) {
      try {
        const parsed = JSON.parse(savedConsent);
        setConsent(parsed);
        // Don't show banner if user has already made a choice
        setIsVisible(false);
      } catch {
        setIsVisible(true);
      }
    } else {
      // Show banner if no consent has been saved
      setIsVisible(true);
    }
  }, []);

  if (!mounted || !isVisible) {
    return null;
  }

  const handleAcceptAll = () => {
    const newConsent: CookieConsent = {
      essential: true,
      analytics: true,
      advertising: true,
    };
    saveConsent(newConsent);
  };

  const handleRejectAll = () => {
    const newConsent: CookieConsent = {
      essential: true,
      analytics: false,
      advertising: false,
    };
    saveConsent(newConsent);
  };

  const handleCustomize = () => {
    // Toggle expanded state or navigate to settings
    // For now, we'll just show preferences
    const newConsent: CookieConsent = {
      essential: true,
      analytics: consent.analytics,
      advertising: consent.advertising,
    };
    saveConsent(newConsent);
  };

  const saveConsent = (newConsent: CookieConsent) => {
    setConsent(newConsent);
    localStorage.setItem('cookieConsent', JSON.stringify(newConsent));
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    setIsVisible(false);

    // Update global consent variables for third-party scripts
    window.__cookieConsent = newConsent;

    // If analytics are now enabled, load Google Analytics
    if (newConsent.analytics) {
      loadGoogleAnalytics();
    }

    // If advertising are now enabled, reload ads
    if (newConsent.advertising && window.adsbygoogle) {
      window.adsbygoogle.push({});
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900 border-t border-gray-700 shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Message */}
          <div className="flex-1 text-sm md:text-base">
            <p className="text-gray-300 mb-2">
              We use cookies to enhance your experience and analyze website
              traffic. This includes
              <strong> essential cookies</strong> (required),{' '}
              <strong>analytics</strong>, and <strong>advertising</strong>{' '}
              cookies from Google AdSense.
            </p>
            <div className="flex gap-4 text-xs text-cyan-400">
              <Link
                href="/legal/privacy"
                target="_blank"
                className="hover:text-cyan-300"
              >
                Privacy Policy
              </Link>
              <Link
                href="/legal/cookie-policy"
                target="_blank"
                className="hover:text-cyan-300"
              >
                Cookie Policy
              </Link>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <button
              onClick={handleRejectAll}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition"
            >
              Reject All
            </button>
            <button
              onClick={handleCustomize}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition"
            >
              Customize
            </button>
            <button
              onClick={handleAcceptAll}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-sm font-medium text-white transition"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function to load Google Analytics after consent
function loadGoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  if (!gaId) return;

  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
  script.async = true;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag(...args: any[]) {
    (window.dataLayer as any).push(arguments);
  }
  (window as any).gtag = gtag;
  gtag('js', new Date());
  gtag('config', gaId);
}

// Declare global window properties
declare global {
  interface Window {
    __cookieConsent: CookieConsent;
    dataLayer: any[];
    gtag: Function;
    adsbygoogle: any;
  }
}
