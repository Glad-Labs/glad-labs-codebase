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
  };
}

export default function Archive({ allPostsData }) {
  return (
    <Layout>
      <Head>
        <title>Archive - Glad Labs Frontier</title>
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
