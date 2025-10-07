/**
 * @file pages/archive.js
 * @description The archive page, which displays a complete list of all blog posts.
 * This page is generated at build time using Static Site Generation (SSG).
 *
 * @requires next/head
 * @requires ../components/Layout
 * @requires ../components/PostList
 * @requires ../lib/posts
 */

import Head from 'next/head';
import Layout from '../components/Layout';
import PostList from '../components/PostList';
import { getPaginatedPosts } from '../lib/api';
import Link from 'next/link';

/**
 * Fetches all post data at build time.
 * This function is run by Next.js on the server during the build process.
 *
 * @returns {Promise<Object>} An object containing the props to be passed to the Archive component.
 */
export async function getStaticProps() {
  const postsData = await getPaginatedPosts(1, 100); // Fetch all posts
  return {
    props: {
      posts: postsData.data,
      pagination: postsData.meta.pagination,
    },
    revalidate: 60,
  };
}

/**
 * The Archive component.
 * Renders a list of all blog posts.
 *
 * @param {Object} props
 * @param {Array<Object>} props.posts - The complete, sorted list of posts from `getStaticProps`.
 * @returns {JSX.Element} The rendered archive page.
 *
 * @suggestion FUTURE_ENHANCEMENT: For a large number of posts, this page could become
 * very long. Consider grouping posts by year or month, or adding client-side
 * filtering and sorting options to improve usability.
 */
export default function Archive({ posts, pagination }) {
  return (
    <Layout>
      <Head>
        <title>Archive - Glad Labs Frontier</title>
        <meta
          name="description"
          content="A complete archive of all articles from the Glad Labs Frontier blog."
        />
      </Head>
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-cyan-400 mb-8">
            Content Archive
          </h1>
          <div className="space-y-8">
            {posts.map((post) => (
              <Link key={post.id} href={`/posts/${post.attributes.Slug}`}>
                <a className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <h2 className="text-2xl font-bold mb-2">
                    {post.attributes.Title}
                  </h2>
                  <p className="text-gray-600 mb-4">
                    {new Date(post.attributes.publishedAt).toLocaleDateString()}
                  </p>
                  <p className="text-gray-700">{post.attributes.Excerpt}</p>
                </a>
              </Link>
            ))}
          </div>
          {/* Add pagination controls here in the future */}
        </div>
      </div>
    </Layout>
  );
}
