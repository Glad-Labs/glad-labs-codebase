import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
// import Layout from "../components/Layout"; // Remove this line
import PostCard from '../components/PostCard';
import { getFeaturedPost, getPaginatedPosts } from '../lib/api';

const FeaturedPost = ({ post }) => {
  if (!post) return null;

  const { Title, Excerpt, Slug, FeaturedImage } = post;
  const imageUrl = FeaturedImage?.data?.url;

  return (
    <div className="mb-12">
      <h2 className="text-3xl font-bold text-cyan-400 mb-4">Featured Post</h2>
      <p className="text-sm text-gray-400 mb-4">
        To set the featured post, go to the Strapi admin, edit a post, and check
        the &ldquo;Featured&rdquo; boolean.
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

export default function Home({ featuredPost, posts, pagination }) {
  return (
    // Remove the <Layout> wrapper from here
    <>
      <Head>
        <title>GLAD Labs Frontier | Autonomous Content Generation</title>
        <meta
          name="description"
          content="GLAD Labs Frontier is an autonomous content generation experiment..."
        />
      </Head>

      {featuredPost && <FeaturedPost post={featuredPost} />}

      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-cyan-300 mb-8 text-center">
          Recent Posts
        </h2>
        {posts && posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <PostCard key={post.id} post={post.attributes} />
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
  const featuredPost = (await getFeaturedPost()) || null;

  const postsData = await getPaginatedPosts(
    1, // page
    6, // pageSize
    featuredPost ? featuredPost.id : null // excludeId
  );

  const posts = postsData ? postsData.data : null;

  return {
    props: {
      featuredPost,
      posts,
      pagination: postsData ? postsData.meta.pagination : null,
    },
    revalidate: 1,
  };
}
