import Head from 'next/head';
import { BlocksRenderer } from '@strapi/blocks-react-renderer';
import { getStrapiURL } from '../lib/api';

export default function About({ about }) {
  const title = about?.title || 'About Glad Labs';
  const content = about?.content ?? [];
  const seo = about?.seo || {};
  const metaTitle = seo.metaTitle || title;
  const metaDescription = seo.metaDescription || 'About GLAD Labs';

  const renderContent = () => {
    if (Array.isArray(content)) {
      return <BlocksRenderer content={content} />;
    }
    if (typeof content === 'string') {
      return <div dangerouslySetInnerHTML={{ __html: content }} />;
    }
    if (content && Array.isArray(content.blocks)) {
      return <BlocksRenderer content={content.blocks} />;
    }
    return null;
  };

  return (
    <>
      <Head>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
      </Head>
      <div className="container mx-auto px-4 md:px-6 py-12">
        <h1 className="text-4xl md:text-5xl font-bold text-cyan-300 mb-8">
          {title}
        </h1>
        <div className="prose prose-invert max-w-none">{renderContent()}</div>
      </div>
    </>
  );
}

export async function getStaticProps() {
  try {
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
  } catch (e) {
    // If Strapi is down during dev, avoid crashing the page
    return { notFound: false, props: { about: null }, revalidate: 60 };
  }
}
