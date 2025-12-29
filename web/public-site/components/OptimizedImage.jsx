'use client';

import Image from 'next/image';
import { useState } from 'react';

/**
 * OptimizedImage Component
 * Wraps Next.js Image with best practices:
 * - Automatic format selection (AVIF, WebP)
 * - Responsive sizing
 * - Lazy loading (except when priority set)
 * - Blur placeholder support
 * - Error handling
 */
export default function OptimizedImage({
  src,
  alt = 'Image',
  priority = false,
  fill = false,
  className = '',
  sizes,
  blurDataURL,
  onError,
  title,
  ...props
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Validate alt text is provided (WCAG requirement)
  if (!alt || alt.trim() === '') {
    console.warn(
      'OptimizedImage: Missing alt text. Provide descriptive alt text for all images.'
    );
  }

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = (error) => {
    setHasError(true);
    if (onError) {
      onError(error);
    }
  };

  if (hasError) {
    return (
      <div
        className={`${className} bg-gray-200 flex items-center justify-center text-gray-400`}
        role="status"
        aria-label="Image failed to load"
      >
        <span className="sr-only">Failed to load image</span>
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    );
  }

  const imageProps = {
    src,
    alt: alt || 'Unlabeled image',
    title: title || undefined,
    priority,
    loading: priority ? 'eager' : 'lazy',
    onLoad: handleLoad,
    onError: handleImageError,
    className: `${className} ${isLoading ? 'blur-sm' : 'blur-0'} transition-all duration-300`,
    ...props,
  };

  // Add sizes for responsive images if fill is true
  if (fill) {
    return (
      <Image
        {...imageProps}
        alt={imageProps.alt}
        fill
        sizes={
          sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
        }
        placeholder={blurDataURL ? 'blur' : 'empty'}
        blurDataURL={blurDataURL}
        decoding="async"
      />
    );
  }

  // Static width/height image
  return (
    <Image
      {...imageProps}
      alt={imageProps.alt}
      placeholder={blurDataURL ? 'blur' : 'empty'}
      blurDataURL={blurDataURL}
      decoding="async"
    />
  );
}

/* Screen Reader Only Styles */
const srOnlyStyle = `
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
`;
