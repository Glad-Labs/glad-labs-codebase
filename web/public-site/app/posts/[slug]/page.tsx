import type { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

/**
 * Phase 1: Dynamic Metadata - SEO Handshake
 *
 * This file generates proper metadata for Google Search Console and AdSense.
 * Key features:
 * - Fetches post data from Postgres via FastAPI
 * - Maps og:image to Cloudinary URLs
 * - Auto-generates meta descriptions from post excerpt
 * - Sets canonical URLs to prevent indexing duplicates
 */

// Fetch post data from FastAPI
async function getPost(slug: string) {
  const FASTAPI_URL =
    process.env.NEXT_PUBLIC_FASTAPI_URL || 'http://localhost:8000';
  const API_BASE = `${FASTAPI_URL}/api`;

  try {
    const response = await fetch(`${API_BASE}/posts/${slug}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (!response.ok) return null;

    const data = await response.json();
    return data.data || null;
  } catch (error) {
    console.error(`Error fetching post ${slug}:`, error);
    return null;
  }
}

// Fetch all post slugs for generateStaticParams
async function getAllPostSlugs() {
  const FASTAPI_URL =
    process.env.NEXT_PUBLIC_FASTAPI_URL || 'http://localhost:8000';
  const API_BASE = `${FASTAPI_URL}/api`;

  try {
    let allSlugs: string[] = [];
    let skip = 0;
    const limit = 100;
    let hasMore = true;

    while (hasMore) {
      const response = await fetch(
        `${API_BASE}/posts?skip=${skip}&limit=${limit}&published_only=true`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          next: { revalidate: 3600 },
        }
      );

      if (!response.ok) break;

      const data = await response.json();
      const pageData = data.data || [];

      if (pageData.length === 0) {
        hasMore = false;
      } else {
        allSlugs = [...allSlugs, ...pageData.map((post: any) => post.slug)];
        skip += limit;
      }
    }

    return allSlugs;
  } catch (error) {
    console.error('Error fetching post slugs:', error);
    return [];
  }
}

// ============================================
// PHASE 1: Dynamic Metadata Generation
// ============================================

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = (await params).slug;
  const post = await getPost(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'This post could not be found.',
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com';
  const canonicalUrl = `${baseUrl}/posts/${post.slug}`;

  // Map coverImage to Cloudinary URL
  const imageUrl = post.coverImage
    ? post.coverImage.startsWith('http')
      ? post.coverImage
      : `${process.env.NEXT_PUBLIC_FASTAPI_URL || 'http://localhost:8000'}${post.coverImage}`
    : `${baseUrl}/og-default.jpg`;

  return {
    title: post.title || 'Blog Post',
    description: post.excerpt || post.description || 'Read this article',
    alternates: {
      canonical: canonicalUrl,
    },

    // Open Graph for Social Media
    openGraph: {
      title: post.title || 'Blog Post',
      description: post.excerpt || post.description || 'Read this article',
      url: canonicalUrl,
      type: 'article',
      authors: post.author ? [post.author] : [],
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.title || 'Post image',
        },
      ],
    },

    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title: post.title || 'Blog Post',
      description: post.excerpt || post.description || 'Read this article',
      images: [imageUrl],
    },

    // JSON-LD Structured Data (for Google)
    other: {
      'article:published_time': post.publishedAt || new Date().toISOString(),
      'article:modified_time': post.updatedAt || new Date().toISOString(),
    },
  };
}

// Generate static params for all published posts
export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

// ============================================
// Post Component
// ============================================

export default async function PostPage({ params }: Props) {
  const slug = (await params).slug;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com';
  const imageUrl = post.coverImage
    ? post.coverImage.startsWith('http')
      ? post.coverImage
      : `${process.env.NEXT_PUBLIC_FASTAPI_URL || 'http://localhost:8000'}${post.coverImage}`
    : null;

  return (
    <article className="min-h-screen bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4 md:px-6 max-w-3xl">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-gray-400">
          <Link href="/" className="hover:text-cyan-400">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span>{post.title}</span>
        </nav>

        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-cyan-400">
            {post.title}
          </h1>

          <div className="flex items-center space-x-4 text-gray-400 mb-6">
            {post.publishedAt && (
              <time dateTime={post.publishedAt}>
                {new Date(post.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            )}
            {post.author && <span>By {post.author}</span>}
          </div>

          {post.excerpt && (
            <p className="text-lg text-gray-300 italic">{post.excerpt}</p>
          )}
        </header>

        {/* Featured Image */}
        {imageUrl && (
          <div className="mb-8 rounded-lg overflow-hidden">
            <Image
              src={imageUrl}
              alt={post.title || 'Post image'}
              width={800}
              height={450}
              priority
              className="w-full h-auto"
            />
          </div>
        )}

        {/* Category & Tags */}
        {(post.category || post.tags?.length > 0) && (
          <div className="mb-8 flex flex-wrap gap-4 items-center text-sm">
            {post.category && (
              <Link
                href={`/category/${post.category.slug}`}
                className="px-3 py-1 bg-cyan-600 rounded-full hover:bg-cyan-500"
              >
                {post.category.name}
              </Link>
            )}
            {post.tags?.map((tag: any) => (
              <Link
                key={tag.id}
                href={`/tag/${tag.slug}`}
                className="px-3 py-1 bg-gray-700 rounded-full hover:bg-gray-600"
              >
                #{tag.name}
              </Link>
            ))}
          </div>
        )}

        {/* Content */}
        <div className="prose prose-invert max-w-none mb-8">
          <ReactMarkdown
            components={{
              h2: ({ node, ...props }) => (
                <h2
                  className="text-3xl font-bold text-cyan-400 mt-8 mb-4"
                  {...props}
                />
              ),
              h3: ({ node, ...props }) => (
                <h3
                  className="text-2xl font-bold text-cyan-300 mt-6 mb-3"
                  {...props}
                />
              ),
              p: ({ node, ...props }) => (
                <p className="text-gray-200 mb-4 leading-relaxed" {...props} />
              ),
              ul: ({ node, ...props }) => (
                <ul
                  className="list-disc list-inside text-gray-200 mb-4"
                  {...props}
                />
              ),
              ol: ({ node, ...props }) => (
                <ol
                  className="list-decimal list-inside text-gray-200 mb-4"
                  {...props}
                />
              ),
              code: ({ node, ...props }: any) => (
                <code
                  className="bg-gray-800 px-2 py-1 rounded text-cyan-300 text-sm"
                  {...props}
                />
              ),
              pre: ({ node, ...props }) => (
                <pre
                  className="bg-gray-800 p-4 rounded overflow-x-auto mb-4"
                  {...props}
                />
              ),
              a: ({ node, href, ...props }) => (
                <a
                  href={href}
                  className="text-cyan-400 hover:text-cyan-300 underline"
                  {...props}
                />
              ),
              blockquote: ({ node, ...props }) => (
                <blockquote
                  className="border-l-4 border-cyan-500 pl-4 italic text-gray-300 my-4"
                  {...props}
                />
              ),
              img: ({ node, src, alt, ...props }) => (
                <Image
                  src={src || ''}
                  alt={alt || ''}
                  width={800}
                  height={450}
                  className="rounded-lg my-4 w-full h-auto"
                  style={{ objectFit: 'cover' }}
                />
              ),
            }}
          >
            {post.content || ''}
          </ReactMarkdown>
        </div>

        {/* Footer CTA */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <p className="text-gray-400 mb-4">
            Found this helpful? Share it with others or subscribe for more
            insights.
          </p>
          <div className="flex gap-4">
            <Link
              href="/"
              className="px-6 py-2 bg-cyan-600 rounded-lg hover:bg-cyan-500 transition"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
