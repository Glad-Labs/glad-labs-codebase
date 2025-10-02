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

        <div className="grid gap-10 md:gap-12">
          {allPostsData.map(({ attributes: { slug, title, publishedAt, excerpt } }) => (
            <article key={slug} className="group bg-gray-800/30 p-6 rounded-lg border border-transparent hover:border-cyan-400/50 transition-all duration-300">
              <h2 className="text-3xl font-bold text-cyan-300 group-hover:text-cyan-200 transition-colors">
                <Link href={`/posts/${slug}`}>
                  {title}
                </Link>
              </h2>
              <p className="text-gray-500 text-sm mt-2">{new Date(publishedAt).toLocaleDateString()}</p>
              <p className="text-gray-300 mt-4 text-lg">{excerpt}</p>
              <Link href={`/posts/${slug}`} className="text-cyan-400 hover:text-cyan-300 mt-6 inline-block font-semibold">
                Read Full Article &rarr;
              </Link>
            </article>
          ))}
        </div>
      </div>
    </Layout>
  );
}
