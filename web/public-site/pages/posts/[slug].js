import Layout from '../../components/Layout';
import { getPostBySlug, getPaginatedPosts } from '../../lib/api';
import Head from 'next/head';
import Image from 'next/image';
// Import the new blocks renderer
import { BlocksRenderer } from '@strapi/blocks-react-renderer';

export default function Post({ post }) {
  if (!post) return <div>Loading...</div>;

  const { Title, BodyContent, publishedAt, FeaturedImage } = post.attributes;
  const imageUrl = FeaturedImage?.data?.attributes?.url;

  return (
    <Layout>
      <Head>
        <title>{Title} | GLAD Labs Blog</title>
      </Head>
      <div className="container mx-auto px-4 py-12">
        <article className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-cyan-300 mb-4 leading-tight">
            {Title}
          </h1>
          <p className="text-lg text-gray-400 mb-8">
            Published on {new Date(publishedAt).toLocaleDateString()}
          </p>

          {imageUrl && (
            <div className="relative h-96 mb-8">
              <Image
                src={imageUrl}
                alt={FeaturedImage.data.attributes.alternativeText || Title}
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>
          )}

          <div className="prose prose-invert lg:prose-xl mx-auto">
            {/* Replace the dangerouslySetInnerHTML with the BlocksRenderer */}
            <BlocksRenderer content={BodyContent} />
          </div>
        </article>
      </div>
    </Layout>
  );
}

export async function getStaticPaths() {
  const postsData = await getPaginatedPosts(1, 100); // Fetch all posts to generate paths
  const paths = postsData.data.map((post) => ({
    params: { slug: post.attributes.Slug },
  }));

  return { paths, fallback: 'blocking' };
}

export async function getStaticProps({ params }) {
  const post = await getPostBySlug(params.slug);
  return {
    props: { post },
    revalidate: 60,
  };
}
