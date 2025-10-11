import Head from 'next/head';
import { getAboutPage } from '../lib/api';
import { BlocksRenderer } from '@strapi/blocks-react-renderer';

export default function About({ content }) {
  const isBlocksArray = Array.isArray(content);
  const blocksFromObject =
    content && typeof content === 'object' && Array.isArray(content.blocks)
      ? content.blocks
      : null;
  return (
    <>
      <Head>
        <title>About - Glad Labs Frontier</title>
        <meta
          name="description"
          content="Learn about the mission and technology behind the Glad Labs autonomous content creation experiment."
        />
        {/* Open Graph */}
        <meta property="og:title" content="About - Glad Labs Frontier" />
        <meta
          property="og:description"
          content="Learn about the mission and technology behind the Glad Labs autonomous content creation experiment."
        />
        <meta
          property="og:image"
          content="https://www.glad-labs.com/og-image.jpg"
        />
        <meta property="og:url" content="https://www.glad-labs.com/about" />
        <meta property="og:type" content="website" />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About - Glad Labs Frontier" />
        <meta
          name="twitter:description"
          content="Learn about the mission and technology behind the Glad Labs autonomous content creation experiment."
        />
        <meta
          name="twitter:image"
          content="https://www.glad-labs.com/og-image.jpg"
        />
      </Head>
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="max-w-4xl mx-auto prose prose-invert lg:prose-xl">
          {content ? (
            isBlocksArray ? (
              <BlocksRenderer content={content} />
            ) : blocksFromObject ? (
              <BlocksRenderer content={blocksFromObject} />
            ) : typeof content === 'string' ? (
              <div dangerouslySetInnerHTML={{ __html: content }} />
            ) : null
          ) : (
            <>
              <h1>About Glad Labs</h1>
              <p>This content should be editable in the Strapi CMS.</p>
              <p>
                To set this up, create a new &ldquo;Single Type&rdquo; in Strapi
                called &ldquo;About&rdquo; with a &ldquo;Rich Text&rdquo; field
                named &ldquo;Content&rdquo;.
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export async function getStaticProps() {
  const aboutPageData = await getAboutPage();

  // Support common field names: Content (blocks), content (blocks), body, bodyContent, html
  const content =
    aboutPageData?.Content ??
    aboutPageData?.content ??
    aboutPageData?.BodyContent ??
    aboutPageData?.bodyContent ??
    aboutPageData?.html ??
    null;

  return {
    props: {
      content,
    },
    revalidate: 60,
  };
}
