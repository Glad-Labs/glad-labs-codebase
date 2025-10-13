import Head from 'next/head';
import { BlocksRenderer } from '@strapi/blocks-react-renderer';
import { getStrapiURL } from '../lib/api';

export async function getStaticProps() {
  // Fetch the single-type privacy policy
  const res = await fetch(`${getStrapiURL('/api/privacy-policy')}?populate=*`);
  if (!res.ok) {
    return { notFound: true };
  }
  const json = await res.json();
  const data = json?.data?.attributes || null;

  if (!data) return { notFound: true };

  return {
    props: { policy: data },
    revalidate: 60,
  };
}

export default function PrivacyPolicy({ policy }) {
  const title = policy?.title || 'Privacy Policy';
  const content = policy?.content ?? [];
  const seo = policy?.seo || {};
  const metaTitle = seo.metaTitle || `${title} | GLAD Labs`;
  const metaDescription = seo.metaDescription || 'GLAD Labs Privacy Policy';

  const renderContent = () => {
    if (Array.isArray(content)) return <BlocksRenderer content={content} />;
    if (typeof content === 'string')
      return <div dangerouslySetInnerHTML={{ __html: content }} />;
    if (content && Array.isArray(content.blocks))
      return <BlocksRenderer content={content.blocks} />;
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
