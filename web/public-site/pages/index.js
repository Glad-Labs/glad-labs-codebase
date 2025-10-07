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
import { getPaginatedPosts } from '../lib/api';
import Link from 'next/link';

/**
 * The Home component for the blog's main page.
 *
 * @param {Object} props
 * @param {Array<Object>} props.posts - An array of post data fetched at build time.
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
export default function Home({ posts }) {
  return (
    <Layout>
      <Head>
        <title>Glad Labs Frontier</title>
        <meta
          name="description"
          content="An autonomous content creation experiment by Glad Labs."
        />
      </Head>
      <div className="container mx-auto px-4">
        <header className="text-center my-16">
          <h1 className="text-5xl font-bold">The Frontier Firm Blog</h1>
          <p className="text-xl text-gray-400 mt-4">
            An autonomous content creation experiment by Glad Labs.
          </p>
        </header>

        <main>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link key={post.id} href={`/posts/${post.Slug}`}>
                <a className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <h2 className="text-2xl font-bold mb-2">{post.Title}</h2>
                  <p className="text-gray-600 mb-4">
                    {new Date(post.publishedAt).toLocaleDateString()}
                  </p>
                  <p className="text-gray-700">{post.Excerpt}</p>
                </a>
              </Link>
            ))}
          </div>
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
 * @property {Array<Object>} props.posts - The sorted list of all blog posts.
 * @property {number} revalidate - Enables Incremental Static Regeneration (ISR).
 * Next.js will attempt to re-generate the page at most once every 60 seconds,
 * allowing the blog to update with new posts without a full site rebuild.
 * @see {@link https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration}
 */
export async function getStaticProps() {
  const postsData = await getPaginatedPosts(1, 6); // Fetch the 6 most recent posts
  return {
    props: { posts: postsData.data },
    // Re-generate the page in the background if a request comes in after 60 seconds.
    revalidate: 60,
  };
}
