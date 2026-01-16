'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_FASTAPI_URL ||
  'http://localhost:8000';

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featured_image_url?: string;
  cover_image_url?: string;
  author_id?: string;
  category_id?: string;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
  published_at?: string;
  created_at: string;
  view_count: number;
}

export default function PostPage() {
  const params = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        if (!params || !params.slug) {
          setLoading(false);
          return;
        }

        setLoading(true);
        const slug = params.slug as string;
        console.log('[Post Page] Fetching post with slug:', slug);

        // Fetch all posts and filter by slug since by-slug endpoint doesn't exist
        const response = await fetch(`${API_BASE}/api/posts?populate=*`);

        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }

        const data = await response.json();
        console.log('[Post Page] API Response:', data);

        // Find the post with matching slug
        const posts = data.data || data || [];
        console.log('[Post Page] Number of posts:', posts.length);
        if (posts.length > 0) {
          console.log('[Post Page] First post slug:', posts[0].slug);
          console.log(
            '[Post Page] Looking for slug match:',
            slug,
            'in',
            posts.map((p: any) => p.slug)
          );
        }

        const foundPost = posts.find((p: Post) => p.slug === slug);

        console.log('[Post Page] Found post:', foundPost ? 'YES' : 'NO');

        if (!foundPost) {
          throw new Error('Post not found');
        }

        setPost(foundPost);
        setError(null);
      } catch (err) {
        console.error('[Post Page] Error:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
        setPost(null);
      } finally {
        setLoading(false);
      }
    };

    if (params && params.slug) {
      fetchPost();
    }
  }, [params]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center pt-24">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading article...</p>
        </div>
      </main>
    );
  }

  if (error || !post) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">
              Article Not Found
            </h1>
            <p className="text-slate-400 mb-8">
              The article you&apos;re looking for doesn&apos;t exist.
            </p>
            <Link
              href="/archive/1"
              className="inline-block px-6 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-900 font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-400/50 transition-shadow"
            >
              Back to Archive
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const imageUrl = post.cover_image_url || post.featured_image_url;
  const publishDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : new Date(post.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Header with Featured Image */}
      <div className="pt-20 pb-12">
        {imageUrl && (
          <div className="relative w-full h-96 md:h-[500px] overflow-hidden">
            <Image
              src={imageUrl}
              alt={post.title}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>
          </div>
        )}

        {/* Title Section */}
        <div
          className={`px-4 sm:px-6 lg:px-8 ${imageUrl ? '-mt-24 relative z-10' : 'pt-12'}`}
        >
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
              {post.title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 text-slate-400 mb-8">
              <time dateTime={post.published_at || post.created_at}>
                {publishDate}
              </time>
              {post.view_count > 0 && (
                <>
                  <span>•</span>
                  <span>{post.view_count} views</span>
                </>
              )}
            </div>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                {post.excerpt}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-4xl mx-auto">
          <article
            className="prose prose-invert max-w-none
                       prose-headings:font-bold
                       prose-h1:text-4xl prose-h1:text-white prose-h1:mt-8 prose-h1:mb-4
                       prose-h2:text-3xl prose-h2:text-cyan-400 prose-h2:mt-8 prose-h2:mb-4
                       prose-h3:text-2xl prose-h3:text-blue-400 prose-h3:mt-6 prose-h3:mb-3
                       prose-p:text-slate-300 prose-p:leading-relaxed prose-p:mb-6
                       prose-strong:text-white prose-strong:font-semibold
                       prose-a:text-cyan-400 prose-a:hover:text-cyan-300 prose-a:underline
                       prose-code:text-cyan-300 prose-code:bg-slate-800 prose-code:px-2 prose-code:py-1 prose-code:rounded
                       prose-pre:bg-slate-800 prose-pre:border prose-pre:border-slate-700
                       prose-blockquote:border-l-4 prose-blockquote:border-cyan-400 prose-blockquote:pl-4 prose-blockquote:text-slate-400 prose-blockquote:not-italic
                       prose-ul:text-slate-300 prose-ol:text-slate-300
                       prose-li:text-slate-300 prose-li:marker:text-cyan-400
                       prose-img:rounded-lg prose-img:my-6
                       prose-hr:border-slate-700"
          >
            <div
              dangerouslySetInnerHTML={{
                __html: post.content,
              }}
            />
          </article>

          {/* Bottom Navigation */}
          <div className="mt-12 pt-8 border-t border-slate-700">
            <Link
              href="/archive/1"
              className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Archive
            </Link>
          </div>
        </div>
      </div>

      {/* AdSense Placeholder */}
      <div className="px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-4xl mx-auto bg-slate-800/50 border border-slate-700 rounded-lg p-8 text-center">
          <p className="text-slate-400 text-sm">Advertisement</p>
        </div>
      </div>
    </main>
  );
}
