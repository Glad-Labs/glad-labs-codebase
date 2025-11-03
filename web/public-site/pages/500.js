import Link from 'next/link';
import { useEffect } from 'react';
import Head from 'next/head';
import { logError } from '../lib/error-handling';

/**
 * 500 Server Error Page
 * Displays when a server error occurs
 * Provides recovery options and support contact information
 */
export default function Custom500() {
  useEffect(() => {
    // Log that 500 error page was rendered
    logError(new Error('500 Server Error Page Rendered'), { page: '500' });
  }, []);

  return (
    <>
      <Head>
        <title>500 - Server Error | Glad Labs Blog</title>
        <meta
          name="description"
          content="The server encountered an unexpected error. Our team has been notified. Please try again later."
        />
        <meta name="robots" content="noindex, follow" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex flex-col">
        {/* Main Content */}
        <div className="flex-1 container mx-auto px-4 md:px-6 py-12 md:py-24 flex flex-col justify-center">
          <div className="max-w-2xl mx-auto text-center">
            {/* Error Icon & Title */}
            <div className="mb-8">
              <div className="text-7xl mb-4">⚙️</div>
              <h1 className="text-5xl md:text-6xl font-bold text-red-400 mb-2">
                500
              </h1>
              <p className="text-gray-400 text-lg">Server Error</p>
            </div>

            {/* Description */}
            <div className="mb-8 md:mb-12">
              <p className="text-gray-300 text-lg mb-4">
                Something went wrong on our end. We&apos;re sorry for the
                inconvenience.
              </p>
              <p className="text-gray-400">
                Our team has been automatically notified and is working to fix
                this issue. Please try again in a few moments.
              </p>
            </div>

            {/* Error ID */}
            <div className="bg-gray-800/50 rounded-lg p-4 mb-8 border border-gray-700">
              <p className="text-gray-400 text-sm">
                Error ID:{' '}
                <span className="text-cyan-400 font-mono">
                  {Math.random().toString(36).substr(2, 9).toUpperCase()}
                </span>
              </p>
              <p className="text-gray-500 text-xs mt-2">
                Save this ID if you need to contact support
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button
                onClick={() => window.location.reload()}
                className="inline-block px-8 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition-colors duration-200 cursor-pointer"
              >
                🔄 Try Again
              </button>
              <Link
                href="/"
                className="inline-block px-8 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors duration-200"
              >
                ← Go Home
              </Link>
            </div>

            {/* Helpful Actions */}
            <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-6 mb-8 text-left">
              <p className="text-blue-300 font-semibold mb-3">
                💡 What you can do:
              </p>
              <ul className="text-blue-200/80 space-y-2 text-sm">
                <li>✓ Refresh the page or try again in a few minutes</li>
                <li>✓ Clear your browser cache and cookies</li>
                <li>✓ Try accessing the site from a different browser</li>
                <li>✓ Check our status page for known issues</li>
              </ul>
            </div>

            {/* Helpful Links */}
            <div>
              <p className="text-gray-400 mb-4">Useful links:</p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/"
                  className="text-cyan-400 hover:text-cyan-300 underline"
                >
                  Homepage
                </Link>
                <span className="text-gray-600">•</span>
                <Link
                  href="/archive/1"
                  className="text-cyan-400 hover:text-cyan-300 underline"
                >
                  Blog Archive
                </Link>
                <span className="text-gray-600">•</span>
                <a
                  href="mailto:hello@glad-labs.com?subject=500%20Error%20Report"
                  className="text-cyan-400 hover:text-cyan-300 underline"
                >
                  Report Issue
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="border-t border-gray-700 bg-gray-900/50 py-6">
          <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
            <p>
              If this issue persists, please{' '}
              <a
                href="mailto:hello@glad-labs.com?subject=Persistent%20500%20Error"
                className="text-cyan-400 hover:text-cyan-300"
              >
                contact support
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
