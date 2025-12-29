import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
// import Layout from "../components/Layout"; // Remove this line
import PostCard from '../components/PostCard';
import SEOHead from '../components/SEOHead';
import { getFeaturedPost, getPaginatedPosts, getStrapiURL } from '../lib/api';
import {
  generateOrganizationSchema,
  generateWebsiteSchema,
  combineSchemas,
} from '../lib/structured-data';

const FeaturedPost = ({ post }) => {
  if (!post || !post.slug) return null;

  const { title, excerpt, slug, coverImage } = post;
  const imageUrl = coverImage?.data?.attributes?.url
    ? getStrapiURL(coverImage.data.attributes.url)
    : null;

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <h2 className="text-3xl font-bold text-cyan-400 mb-4">Featured Post</h2>
      <Link
        href={`/posts/${slug}`}
        className="block bg-gray-800 rounded-lg shadow-lg overflow-hidden"
      >
        {imageUrl && (
          <div className="relative h-64">
            <Image
              src={imageUrl}
              alt={coverImage?.data?.attributes?.alternativeText || title}
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>
        )}
        <div className="p-6">
          <h3 className="text-2xl font-bold mb-2">{title}</h3>
          <p className="text-gray-400">{excerpt}</p>
        </div>
      </Link>
    </div>
  );
};

export default function Home({ featuredPost, posts, pagination }) {
  const baseURL = 'https://www.glad-labs.com';

  // Generate structured data schemas for homepage
  const organizationSchema = generateOrganizationSchema(baseURL, {
    name: 'Glad Labs',
    logo: `${baseURL}/logo.png`,
    description:
      'Autonomous AI Co-Founder System - Content Generation, Business Intelligence, and Multi-Agent Orchestration',
    email: 'hello@glad-labs.com',
    sameAs: [
      'https://twitter.com/GladLabsAI',
      'https://linkedin.com/company/glad-labs',
      'https://github.com/glad-labs',
    ],
  });

  const websiteSchema = generateWebsiteSchema(baseURL);

  // Combine organization and website schemas
  const combinedSchema = combineSchemas([organizationSchema, websiteSchema]);

  return (
    // Remove the <Layout> wrapper from here
    <>
      <SEOHead
        title="Glad Labs | AI-Powered Content Generation & Business Intelligence"
        description="Explore insights on AI, business automation, and digital transformation with Glad Labs - your autonomous AI co-founder for content creation and market analysis."
        canonical={baseURL}
        ogTags={{
          'og:title': 'Glad Labs - AI Co-Founder System',
          'og:description':
            'Autonomous content generation, business intelligence, and market insights powered by AI',
          'og:image': `${baseURL}/og-image.png`,
          'og:url': baseURL,
          'og:type': 'website',
        }}
        twitterTags={{
          'twitter:card': 'summary_large_image',
          'twitter:title': 'Glad Labs - AI Co-Founder',
          'twitter:description':
            'Autonomous AI agents for content creation and business intelligence',
          'twitter:image': `${baseURL}/og-image.png`,
        }}
        schema={combinedSchema}
      />

      {featuredPost && <FeaturedPost post={featuredPost} />}

      <div className="container mx-auto px-4 md:px-6 py-12">
        <h2 className="text-3xl font-bold text-cyan-300 mb-8 text-center">
          Recent Posts
        </h2>
        {posts && posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400">No recent posts found.</p>
        )}
        <div className="text-center mt-12">
          <Link
            href="/archive/1"
            className="inline-block bg-cyan-500 text-white px-6 py-3 rounded-lg hover:bg-cyan-600 transition-colors"
          >
            View All Posts
          </Link>
        </div>
      </div>
    </>
    // And remove the closing </Layout> tag
  );
}

export async function getStaticProps() {
  // Get posts - featured post will be the most recent one
  const postsData = await getPaginatedPosts(
    1, // page
    13, // pageSize - get one extra for the featured post
    null // excludeId
  ).catch(() => {
    // Return null if fetch fails, page will show no posts but won't crash
    return null;
  });

  let posts = postsData ? postsData.data.filter((p) => Boolean(p.slug)) : [];

  // Use the most recent post as the featured post
  let featuredPost = null;
  if (posts && posts.length > 0) {
    featuredPost = posts[0]; // First post is most recent (sorted by date DESC)
    posts = posts.slice(1); // Remaining posts for the grid
  }

  // Ensure featured post has a slug
  if (featuredPost && !featuredPost.slug) {
    featuredPost = null;
  }

  return {
    props: {
      featuredPost,
      posts,
      pagination: postsData ? postsData.meta.pagination : null,
    },
    revalidate: process.env.NODE_ENV === 'production' ? 3600 : false, // Disable ISR in dev (false = static), 1 hour in prod
  };
}
