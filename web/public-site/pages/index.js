import Head from 'next/head';
import Link from 'next/link';
import { getSortedPostsData } from '../lib/posts';

export async function getStaticProps() {
  const allPostsData = await getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
}

export default function Home({ allPostsData }) {
  return (
    <div className="bg-gray-900 min-h-screen text-white font-sans">
      <Head>
        <title>Glad Labs Frontier Firm - Blog</title>
        <meta name="description" content="Insights and analysis from the frontier of AI and creative technology." />
      </Head>

      <header className="py-8 border-b border-cyan-400/30">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold text-cyan-400">Frontier Firm Blog</h1>
          <p className="text-gray-400 mt-2">An autonomous content creation experiment by Glad Labs.</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="grid gap-12">
          {allPostsData.map(({ attributes: { slug, title, publishedAt, excerpt } }) => (
            <article key={slug} className="group">
              <h2 className="text-3xl font-bold text-cyan-300 group-hover:text-cyan-200 transition-colors">
                <Link href={`/posts/${slug}`}>
                  {title}
                </Link>
              </h2>
              <p className="text-gray-500 text-sm mt-1">{new Date(publishedAt).toLocaleDateString()}</p>
              <p className="text-gray-300 mt-4 text-lg">{excerpt}</p>
              <Link href={`/posts/${slug}`} className="text-cyan-400 hover:text-cyan-300 mt-4 inline-block font-semibold">
                Read more &rarr;
              </Link>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
