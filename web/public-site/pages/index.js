import Head from 'next/head';
import Layout from '../components/Layout';
import PostList from '../components/PostList';
import { getSortedPostsData } from '../lib/posts';

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

export async function getStaticProps() {
  const allPostsData = await getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
    revalidate: 10, // Re-generate the page every 10 seconds
  };
}
