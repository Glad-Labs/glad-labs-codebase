import Layout from '../../components/Layout';
import { getAllPostSlugs, getPostData } from '../../lib/posts';
import Head from 'next/head';
import Image from 'next/image';
// Import the new blocks renderer
import { BlocksRenderer } from '@strapi/blocks-react-renderer';

export default function Post({ postData }) {
  const featuredImage = postData.FeaturedImage?.data?.attributes;

  return (
    <Layout>
      <Head>
        <title>{postData.Title} | GLAD Labs</title>
        <meta name="description" content={postData.Excerpt} />
      </Head>
      <div className="container mx-auto px-4 py-12">
        <article className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-cyan-300 mb-4 leading-tight">{postData.Title}</h1>
          <p className="text-lg text-gray-400 mb-8">{postData.Excerpt}</p>

          {featuredImage && (
            <Image
              src={featuredImage.url}
              width={featuredImage.width}
              height={featuredImage.height}
              alt={featuredImage.alternativeText || postData.Title}
              className="w-full h-auto object-cover rounded-lg shadow-lg mb-8"
            />
          )}

          <div className="prose prose-invert lg:prose-xl mx-auto prose-h1:text-cyan-300 prose-h2:text-cyan-300 prose-a:text-cyan-400 hover:prose-a:text-cyan-300">
            {/* Replace the dangerouslySetInnerHTML with the BlocksRenderer */}
            <BlocksRenderer content={postData.BodyContent} />
          </div>
        </article>
      </div>
    </Layout>
  );
}

export async function getStaticPaths() {
  const paths = await getAllPostSlugs();
  return {
    paths,
    fallback: 'blocking', // Allows for new pages to be generated on the fly
  };
}

export async function getStaticProps({ params }) {
  const postData = await getPostData(params.slug);

  if (!postData) {
    return {
      notFound: true,
    };
  }

  // The 'marked' processing is no longer needed.
  // We pass the raw 'BodyContent' (the blocks array) directly to the component.

  return {
    props: {
      // Pass postData directly without modification
      postData,
    },
    revalidate: 10, // In seconds
  };
}
