/**
 * OAuth Callback Handler for Public Site
 *
 * This page is called after user authorizes with OAuth provider (GitHub/Google)
 * It exchanges the authorization code for a JWT token and redirects to dashboard
 */

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { handleOAuthCallback } from '../../lib/api';

export default function OAuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Extract OAuth parameters from URL
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const provider = localStorage.getItem('oauth_provider') || 'github';

        console.log('[OAuth] Processing callback:', {
          provider,
          code: code ? code.substring(0, 10) + '...' : null,
          state: state ? state.substring(0, 10) + '...' : null,
        });

        if (!code) {
          throw new Error('Missing authorization code from OAuth provider');
        }

        // Exchange code for JWT token
        const result = await handleOAuthCallback(provider, code, state);

        console.log('[OAuth] Callback successful:', {
          user: result.user?.email,
          tokenReceived: !!result.access_token,
        });

        // Store token and user data
        if (result.access_token) {
          localStorage.setItem('auth_token', result.access_token);
          if (result.user) {
            localStorage.setItem('auth_user', JSON.stringify(result.user));
          }

          // Clean up OAuth state
          localStorage.removeItem('oauth_provider');
          localStorage.removeItem('oauth_state');

          // Redirect to dashboard or home page
          setTimeout(() => {
            router.push('/dashboard');
          }, 1000);
        } else {
          throw new Error('No access token received from OAuth provider');
        }
      } catch (err) {
        console.error('[OAuth] Callback error:', err);
        setError(err.message || 'Failed to process OAuth callback');
        setLoading(false);
      }
    };

    handleCallback();
  }, [router, searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
          <h1 className="mt-4 text-xl font-semibold text-gray-900">
            Processing Login
          </h1>
          <p className="mt-2 text-gray-600">
            Authenticating you with our system...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h1 className="text-xl font-semibold text-red-900">
              Authentication Failed
            </h1>
            <p className="mt-2 text-red-700">{error}</p>

            <div className="mt-4 flex gap-2">
              <Link
                href="/"
                className="inline-block px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Back to Home
              </Link>
              <Link
                href="/login"
                className="inline-block px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
              >
                Try Again
              </Link>
            </div>

            <details className="mt-4 text-sm text-red-600 cursor-pointer">
              <summary>Error Details</summary>
              <pre className="mt-2 text-xs bg-white p-2 rounded overflow-auto">
                {error}
              </pre>
            </details>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
