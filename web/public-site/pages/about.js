import Head from 'next/head';
import { BlocksRenderer } from '@strapi/blocks-react-renderer';
import { getStrapiURL } from '../lib/api';
import Head from 'next/head';
import { getAboutPage } from '../lib/api';
import { BlocksRenderer } from '@strapi/blocks-react-renderer';

export default function About({ content }) {
  const isBlocksArray = Array.isArray(content);
  const blocksFromObject =
  const title = about?.title || 'About Glad Labs';
  const content = about?.content || [];

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div className="container mx-auto px-4 md:px-6 py-12">
        <h1 className="text-4xl md:text-5xl font-bold text-cyan-300 mb-8">
          {title}
        </h1>
        <div className="prose prose-invert max-w-none">
          <BlocksRenderer content={content} />
        </div>
      </div>
    </>
  );
}

export async function getStaticProps() {
  const res = await fetch(`${getStrapiURL('/api/about')}?populate=*`);
  if (!res.ok) {
    return { notFound: true };
  }
  const json = await res.json();
  const about = json?.data?.attributes || null;

  return {
    props: { about },
    revalidate: 60,
  };
}
