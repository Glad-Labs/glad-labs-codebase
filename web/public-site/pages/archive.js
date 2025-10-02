import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/Layout';
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
          <ul>
            {allPostsData.map(({ attributes: { slug, title, publishedAt } }) => (
              <li key={slug} className="mb-4">
                <Link href={`/posts/${slug}`} className="text-xl text-cyan-300 hover:text-cyan-200">
                  {title}
                </Link>
                <p className="text-sm text-gray-500">{new Date(publishedAt).toLocaleDateString()}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Layout>
  );
}
