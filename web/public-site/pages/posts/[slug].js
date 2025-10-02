import Head from 'next/head';
import Layout from '../../components/Layout';
import { getAllPostSlugs, getPostData } from '../../lib/posts';

export async function getStaticPaths() {
  const paths = await getAllPostSlugs();
  return {
    paths,
    fallback: 'blocking', // Allows for new pages to be generated on the fly
  };
}

export async function getStaticProps({ params }) {
  const postData = await getPostData(params.slug);
  return {
    props: {
      postData,
    },
    revalidate: 10,
  };
}

export default function Post({ postData }) {
  return (
    <Layout>
      <Head>
        <title>{postData.Title}</title>
        <meta name="description" content={postData.MetaDescription} />
      </Head>
      <div className="container mx-auto px-6 py-12">
        <article className="max-w-4xl mx-auto">
          <header className="mb-8 text-center">
            <h1 className="text-5xl font-bold text-cyan-400">{postData.Title}</h1>
            <p className="text-gray-400 mt-4">
              Published on {new Date(postData.publishedAt).toLocaleDateString()}
            </p>
          </header>
          
          {postData.FeaturedImage?.data && (
            <img 
              src={`${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}${postData.FeaturedImage.data.attributes.url}`}
              alt={postData.FeaturedImage.data.attributes.alternativeText || postData.Title}
              className="w-full h-auto object-cover rounded-lg shadow-lg mb-8"
            />
          )}

          <div 
            className="prose prose-invert lg:prose-xl mx-auto prose-h1:text-cyan-300 prose-h2:text-cyan-300 prose-a:text-cyan-400 hover:prose-a:text-cyan-300"
            dangerouslySetInnerHTML={{ __html: postData.contentHtml }} 
          />
        </article>
      </div>
    </Layout>
  );
}
