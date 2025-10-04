/**
 * @file pages/index.js
 * @description The home page for the GLAD Labs blog. It displays a list of the
 * most recent blog posts using Static Site Generation (SSG) with Incremental
 * Static Regeneration (ISR) for frequent updates.
 *
 * @requires next/head - For managing the document head (e.g., title, meta tags).
 * @requires ../components/Layout - The main layout component for the site.
 * @requires ../components/PostList - The component that renders the list of posts.
 * @requires ../lib/posts - The library function for fetching post data.
 */

import Head from 'next/head';
import Layout from '../components/Layout';
import PostList from '../components/PostList';
import { getSortedPostsData } from '../lib/posts';

/**
 * The Home component for the blog's main page.
 *
 * @param {Object} props
 * @param {Array<Object>} props.allPostsData - An array of post data fetched at build time.
 * @returns {JSX.Element} The rendered home page.
 *
 * @suggestion FUTURE_ENHANCEMENT: Implement pagination. As the number of posts grows,
 * displaying all of them on one page will become slow. `getStaticProps` can be
 * extended to support paginated routes.
 *
 * @suggestion FUTURE_ENHANCEMENT: Add a "Featured Post" section at the top to
 * highlight a specific article. This could be controlled by a `featured: true`
 * flag in the post's front-matter.
 */
export default function Home({ allPostsData }) {
  return (
    <Layout>
      <Head>
        <title>Glad Labs Frontier</title>
        <meta name="description" content="An autonomous content creation experiment by Glad Labs." />
      </Head>
      <div className="container mx-auto px-4">
        <header className="text-center my-16">
          <h1 className="text-5xl font-bold">The Frontier Firm Blog</h1>
          <p className="text-xl text-gray-400 mt-4">An autonomous content creation experiment by Glad Labs.</p>
        </header>
        
        <main>
          <PostList posts={allPostsData} />
        </main>
      </div>
    </Layout>
  );
}

/**
 * Fetches data at build time using Static Site Generation (SSG).
 * This function gets a sorted list of all posts and passes it as props to the Home component.
 *
 * @returns {Promise<Object>} An object containing the props for the page and revalidation settings.
 *
 * @property {Object} props - The props to be passed to the component.
 * @property {Array<Object>} props.allPostsData - The sorted list of all blog posts.
 * @property {number} revalidate - Enables Incremental Static Regeneration (ISR).
 * Next.js will attempt to re-generate the page at most once every 10 seconds,
 * allowing the blog to update with new posts without a full site rebuild.
 * @see {@link https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration}
 */
export async function getStaticProps() {
  const allPostsData = await getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
    // Re-generate the page in the background if a request comes in after 10 seconds.
    revalidate: 10,
  };
}
