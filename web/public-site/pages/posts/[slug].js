import { getPostBySlug, getAllPosts, getStrapiURL } from '../../lib/api';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import OptimizedImage from '../../components/OptimizedImage';
import RelatedPosts from '../../components/RelatedPosts';
import SEOHead from '../../components/SEOHead';
import { getReadingTimeDetails, formatDate } from '../../lib/content-utils';
import { getRelatedPosts } from '../../lib/related-posts';
import {
  generateBlogPostingSchema,
  generateBreadcrumbSchema,
  combineSchemas,
} from '../../lib/structured-data';
import {
  buildPostSEO,
  buildSEOTitle,
  generateCanonicalURL,
  generateImageAltText,
} from '../../lib/seo';
import {
  trackArticleView,
  setupReadingDepthTracking,
  setupTimeOnPageTracking,
  trackRelatedPostClick,
  isGA4Loaded,
} from '../../lib/analytics';

const PostMeta = ({ category, tags }) => (
  <div className="flex items-center space-x-4 text-gray-400">
    {category && (
      <Link href={`/category/${category.slug}`} className="hover:text-cyan-400">
        {category.name}
      </Link>
    )}
    {tags && tags.length > 0 && <span>|</span>}
    <div className="flex space-x-2">
      {tags &&
        tags.map((tag) => (
          <Link
            key={tag.id}
            href={`/tag/${tag.slug}`}
            className="hover:text-cyan-400"
          >
            #{tag.name}
          </Link>
        ))}
    </div>
  </div>
);

export default function Post({ post, relatedPosts = [] }) {
  if (!post) return <div>Loading...</div>;

  // Align with Strapi schema (lowercase fields)
  const {
    title,
    content,
    excerpt,
    coverImage,
    publishedAt,
    date,
    category,
    tags,
    slug,
    seo,
    id,
  } = post;

  // Analytics: Track article view and setup engagement tracking
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    // Check if GA4 is loaded before proceeding
    if (!isGA4Loaded()) {
      return;
    }

    // Track article view
    const readingTime = getReadingTimeDetails(content || '');
    trackArticleView(
      id || slug,
      title,
      category?.name || '',
      readingTime.minutes
    );

    // Setup reading depth tracking
    const cleanupReadingDepth = setupReadingDepthTracking(id || slug);

    // Setup time on page tracking
    const cleanupTimeOnPage = setupTimeOnPageTracking('post');

    // Cleanup on unmount
    return () => {
      cleanupReadingDepth?.();
      cleanupTimeOnPage?.();
    };
  }, [id, slug, title, category?.name, content]);

  const imageUrl = coverImage?.url ? getStrapiURL(coverImage.url) : null;
  const metaTitle = (seo && seo.metaTitle) || `${title} | Glad Labs Blog`;
  const metaDescription =
    (seo && seo.metaDescription) ||
    excerpt ||
    'Read this article on Glad Labs.';

  // Calculate reading time and word count
  const readingTimeDetails = getReadingTimeDetails(content || '');
  const publishDate = date || publishedAt;

  // Handler for related post clicks (analytics)
  const handleRelatedPostClick = (relatedPost) => {
    if (!isGA4Loaded()) return;
    trackRelatedPostClick(
      relatedPost.id || relatedPost.slug,
      relatedPost.title,
      id || slug
    );
  };

  // Build SEO data using utilities
  const baseURL = 'https://www.glad-labs.com';
  const canonicalURL = generateCanonicalURL(`/posts/${slug}`, baseURL);

  // Generate structured data schemas
  const blogPostSchema = generateBlogPostingSchema(
    {
      ...post,
      url: canonicalURL,
      publishedAt: publishDate,
    },
    baseURL
  );

  // Generate breadcrumb schema
  const breadcrumbSchema = generateBreadcrumbSchema(
    [
      { name: 'Home', url: baseURL },
      { name: 'Blog', url: `${baseURL}/posts` },
      {
        name: category?.name || 'Posts',
        url: category?.slug
          ? `${baseURL}/category/${category.slug}`
          : `${baseURL}/posts`,
      },
      { name: title, url: canonicalURL },
    ],
    baseURL
  );

  // Combine schemas
  const combinedSchema = combineSchemas([blogPostSchema, breadcrumbSchema]);

  return (
    <>
      <SEOHead
        title={metaTitle}
        description={metaDescription}
        canonical={canonicalURL}
        ogTags={{
          'og:title': metaTitle,
          'og:description': metaDescription,
          'og:image': imageUrl || `${baseURL}/og-image.png`,
          'og:image:width': '1200',
          'og:image:height': '630',
          'og:url': canonicalURL,
          'og:type': 'article',
        }}
        twitterTags={{
          'twitter:card': 'summary_large_image',
          'twitter:title': metaTitle,
          'twitter:description': metaDescription,
          'twitter:image': imageUrl || `${baseURL}/og-image.png`,
        }}
        schema={combinedSchema}
      />
      <div className="container mx-auto px-4 md:px-6 py-12">
        <article className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-cyan-300 mb-4 leading-tight">
              {title}
            </h1>

            {/* Reading Time & Meta Info */}
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400 mb-4">
              {publishDate && (
                <time dateTime={publishDate}>{formatDate(publishDate)}</time>
              )}
              <span>•</span>
              <span>{readingTimeDetails.displayText}</span>
            </div>

            {/* Category & Tags */}
            <PostMeta category={category} tags={tags} />
            <p className="text-sm text-gray-500 mt-2">
              Note: For categories and tags to appear, ensure you have set up
              the relations in your Strapi Post content type.
            </p>
          </div>

          {imageUrl && (
            <div className="relative h-96 mb-8 rounded-lg overflow-hidden">
              <OptimizedImage
                src={imageUrl}
                alt={generateImageAltText(title, 'Featured image for article')}
                fill
                className="rounded-lg object-cover"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 800px"
              />
            </div>
          )}

          <div className="prose prose-invert lg:prose-xl mx-auto">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>

          {/* Related Posts Section */}
          {relatedPosts && relatedPosts.length > 0 && (
            <RelatedPosts
              posts={relatedPosts}
              onPostClick={handleRelatedPostClick}
            />
          )}
        </article>
      </div>
    </>
  );
}

export async function getStaticPaths() {
  try {
    // Use getAllPosts to fetch all posts for path generation
    const posts = (await getAllPosts()) || [];
    const paths = posts
      .map((p) => p?.slug)
      .filter(Boolean)
      .map((slug) => ({ params: { slug } }));

    return {
      paths,
      fallback: 'blocking',
    };
  } catch (error) {
    console.warn(
      'Could not fetch posts for static paths during build:',
      error.message
    );
    return {
      paths: [],
      fallback: 'blocking',
    };
  }
}

export async function getStaticProps({ params }) {
  try {
    const post = await getPostBySlug(params.slug);

    // If no post is found for the given slug, return a 404 page
    if (!post) {
      return {
        notFound: true,
      };
    }

    // Fetch related posts
    let relatedPosts = [];
    try {
      relatedPosts = await getRelatedPosts(post, 3);
    } catch (error) {
      console.warn('Could not fetch related posts:', error.message);
      // Continue without related posts
    }

    return {
      props: { post, relatedPosts },
      revalidate: 60, // Re-generate the page every 60 seconds if needed
    };
  } catch (error) {
    console.warn(
      `Failed to generate post page for slug ${params.slug}:`,
      error.message
    );
    return {
      notFound: true,
      revalidate: 10,
    };
  }
}
