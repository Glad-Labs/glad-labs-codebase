import Head from 'next/head';
import Layout from '../components/Layout';
import { getPaginatedPosts, getFeaturedPost } from '../lib/api';
import Link from 'next/link';
import Image from 'next/image';
import PostCard from '../components/PostCard';

const FeaturedPost = ({ post }) => {
  if (!post) return null;

  const { Title, Excerpt, Slug, FeaturedImage } = post;
  const imageUrl = FeaturedImage?.data?.url;

  return (
    <div className="mb-12">
      <h2 className="text-3xl font-bold text-cyan-400 mb-4">Featured Post</h2>
      <p className="text-sm text-gray-400 mb-4">
        To set the featured post, go to the Strapi admin, edit a post, and check
        the "Featured" boolean.
      </p>
      <Link
        href={`/posts/${Slug}`}
        className="block bg-gray-800 rounded-lg shadow-lg overflow-hidden"
      >
        {imageUrl && (
          <div className="relative h-64">
            <Image
              src={imageUrl}
              alt={FeaturedImage.data.alternativeText || Title}
              layout="fill"
              objectFit="cover"
            />
          </div>
        )}
        <div className="p-6">
          <h3 className="text-2xl font-bold mb-2">{Title}</h3>
          <p className="text-gray-400">{Excerpt}</p>
        </div>
      </Link>
    </div>
  );
};

export default function Home({ featuredPost, posts }) {
  return (
    <Layout>
      <Head>
        <title>Glad Labs Frontier</title>
        <meta
          name="description"
          content="An autonomous content creation experiment by Glad Labs."
        />
        {/* Open Graph */}
        <meta property="og:title" content="Glad Labs Frontier" />
        <meta
          property="og:description"
          content="An autonomous content creation experiment by Glad Labs."
        />
        <meta
          property="og:image"
          content="https://www.glad-labs.com/og-image.jpg"
        />
        <meta property="og:url" content="https://www.glad-labs.com" />
        <meta property="og:type" content="website" />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Glad Labs Frontier" />
        <meta
          name="twitter:description"
          content="An autonomous content creation experiment by Glad Labs."
        />
        <meta
          name="twitter:image"
          content="https://www.glad-labs.com/og-image.jpg"
        />
      </Head>
      <div className="container mx-auto px-4 py-12">
        <main>
          <FeaturedPost post={featuredPost} />

          <h2 className="text-3xl font-bold text-cyan-400 mb-8">
            Recent Posts
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/archive/1"
              className="inline-block bg-cyan-500 text-white px-6 py-3 rounded-lg hover:bg-cyan-600 transition-colors"
            >
              View All Posts
            </Link>
          </div>
        </main>
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const featuredPost = await getFeaturedPost();
  const postsData = await getPaginatedPosts(1, 6, featuredPost?.id);

  return {
    props: {
      featuredPost: featuredPost || null,
      posts: postsData.data,
    },
    revalidate: 60,
  };
}
