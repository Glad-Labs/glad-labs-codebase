import Head from 'next/head';
import Layout from '../components/Layout';
import { getAboutPage } from '../lib/api';
import { BlocksRenderer } from '@strapi/blocks-react-renderer';

export default function About({ content }) {
  return (
    <Layout>
      <Head>
        <title>About - Glad Labs Frontier</title>
        <meta
          name="description"
          content="Learn about the mission and technology behind the Glad Labs autonomous content creation experiment."
        />
        {/* Open Graph */}
        <meta property="og:title" content="About - Glad Labs Frontier" />
        <meta property="og:description" content="Learn about the mission and technology behind the Glad Labs autonomous content creation experiment." />
        <meta property="og:image" content="https://www.glad-labs.com/og-image.jpg" />
        <meta property="og:url" content="https://www.glad-labs.com/about" />
        <meta property="og:type" content="website" />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About - Glad Labs Frontier" />
        <meta name="twitter:description" content="Learn about the mission and technology behind the Glad Labs autonomous content creation experiment." />
        <meta name="twitter:image" content="https://www.glad-labs.com/og-image.jpg" />
      </Head>
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto prose prose-invert lg:prose-xl">
          {content ? (
            <BlocksRenderer content={content} />
          ) : (
            <>
              <h1>About Glad Labs</h1>
              <p>This content should be editable in the Strapi CMS.</p>
              <p>
                To set this up, create a new "Single Type" in Strapi called
                "About" with a "Rich Text" field named "Content".
              </p>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const aboutPageData = await getAboutPage();

  return {
    props: {
      content: aboutPageData?.Content || null,
    },
    revalidate: 60,
  };
}