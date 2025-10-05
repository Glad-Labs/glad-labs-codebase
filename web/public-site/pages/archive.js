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
// Correcting the import to use the function designed for the archive.
import { getAllPostsForArchive } from '../lib/posts';

/**
 * Fetches all post data at build time.
 * This function is run by Next.js on the server during the build process.
 *
 * @returns {Promise<Object>} An object containing the props to be passed to the Archive component.
 */
export async function getStaticProps() {
  // Using the correct function to fetch ALL posts for the archive page.
  const allPostsData = await getAllPostsForArchive();
  return {
    props: {
      allPostsData,
    },
    revalidate: 60, // Can be revalidated less frequently than the homepage.
  };
}

/**
 * The Archive component.
 * Renders a list of all blog posts.
 *
 * @param {Object} props
 * @param {Array<Object>} props.allPostsData - The complete, sorted list of posts from `getStaticProps`.
 * @returns {JSX.Element} The rendered archive page.
 *
 * @suggestion FUTURE_ENHANCEMENT: For a large number of posts, this page could become
 * very long. Consider grouping posts by year or month, or adding client-side
 * filtering and sorting options to improve usability.
 */
export default function Archive({ allPostsData }) {
  return (
    <Layout>
      <Head>
        <title>Archive - Glad Labs Frontier</title>
        <meta name="description" content="A complete archive of all articles from the Glad Labs Frontier blog." />
      </Head>
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-cyan-400 mb-8">Content Archive</h1>
          <PostList posts={allPostsData} />
        </div>
      </div>
    </Layout>
  );
}
