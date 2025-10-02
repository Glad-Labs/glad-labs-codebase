import Head from 'next/head';
import { getAllPostSlugs, getPostData } from '../../lib/posts';

export async function getStaticPaths() {
  const paths = await getAllPostSlugs();
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const postData = await getPostData(params.slug);
  return {
    props: {
      postData,
    },
  };
}

export default function Post({ postData }) {
  return (
    <div className="bg-gray-900 min-h-screen text-white font-sans">
      <Head>
        <title>{postData.title}</title>
      </Head>
      <header className="py-8 border-b border-cyan-400/30">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold text-cyan-400">{postData.title}</h1>
          <p className="text-gray-400 mt-2">
            Published on {new Date(postData.publishedAt).toLocaleDateString()}
          </p>
        </div>
      </header>
      <main className="container mx-auto px-4 py-12">
        <article className="prose prose-invert lg:prose-xl mx-auto">
          <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
        </article>
      </main>
    </div>
  );
}
