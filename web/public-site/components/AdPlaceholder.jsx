/**
 * Phase 2: Ad Container Component
 *
 * Reusable component for ad placements.
 * Features:
 * - Fixed min-height to prevent layout shift (CLS)
 * - Responsive sizing
 * - Lazy loading for better performance
 *
 * Usage:
 * <AdPlaceholder slot="1234567890" format="horizontal" />
 */

'use client';

import { useEffect } from 'react';

/**
 * @typedef {Object} AdPlaceholderProps
 * @property {string} slot - Google AdSense slot ID
 * @property {'horizontal' | 'vertical' | 'rectangle' | 'responsive'} [format] - Ad format
 * @property {React.CSSProperties} [style] - Additional styles
 */

export default function AdPlaceholder({ slot, format = 'responsive', style }) {
  useEffect(() => {
    // Push ads when component mounts
    if (window.adsbygoogle) {
      window.adsbygoogle.push({});
    }
  }, []);

  // Default dimensions based on format
  const dimensions = {
    horizontal: { minHeight: '250px', minWidth: '300px' },
    vertical: { minHeight: '600px', minWidth: '160px' },
    rectangle: { minHeight: '250px', minWidth: '300px' },
    responsive: { minHeight: '250px' },
  };

  return (
    <div
      className="ad-container my-4"
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: '8px',
        overflow: 'hidden',
        ...dimensions[format],
        ...style,
      }}
    >
      <ins
        className="adsbygoogle"
        style={{
          display: format === 'responsive' ? 'block' : 'inline-block',
          ...dimensions[format],
        }}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_ID}
        data-ad-slot={slot}
        data-ad-format={format === 'responsive' ? 'auto' : format}
        data-full-width-responsive={format === 'responsive' ? 'true' : 'false'}
      />
    </div>
  );
}

/**
 * Sidebar Ad Container - Vertical placement
 * @param {Object} props
 * @param {string} props.slot - Google AdSense slot ID
 */
export function SidebarAd({ slot }) {
  return (
    <div className="sticky top-4 rounded-lg bg-gray-100 p-4">
      <AdPlaceholder slot={slot} format="vertical" />
    </div>
  );
}

/**
 * In-Article Ad Container - Horizontal placement between paragraphs
 * @param {Object} props
 * @param {string} props.slot - Google AdSense slot ID
 */
export function InArticleAd({ slot }) {
  return (
    <div className="my-8 py-4 border-t border-b border-gray-300">
      <AdPlaceholder slot={slot} format="horizontal" />
    </div>
  );
}

/**
 * Footer Ad Container - Full width
 * @param {Object} props
 * @param {string} props.slot - Google AdSense slot ID
 */
export function FooterAd({ slot }) {
  return (
    <div className="mt-12 pt-8 border-t border-gray-300">
      <AdPlaceholder slot={slot} format="responsive" />
    </div>
  );
}
