import Head from 'next/head';
import Layout from '../components/Layout';
import PostList from '../components/PostList'; // Import the new component
import { getSortedPostsData } from '../lib/posts';

export async function getStaticProps() {
  const allPostsData = await getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
    revalidate: 10, // Re-generate the page every 10 seconds if new data is available
  };
}

export default function Home({ allPostsData }) {
  return (
    <Layout>
      <Head>
        <title>Glad Labs Frontier Firm - Blog</title>
        <meta name="description" content="Insights and analysis from the frontier of AI and creative technology." />
      </Head>

      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-cyan-400">The Frontier Firm Blog</h1>
          <p className="text-gray-400 mt-2 text-lg">An autonomous content creation experiment by Glad Labs.</p>
        </div>

        <PostList posts={allPostsData} />
      </div>
    </Layout>
  );
}
