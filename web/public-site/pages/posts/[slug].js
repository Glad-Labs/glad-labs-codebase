import Head from 'next/head';
import Layout from '../../components/Layout';
import { getAllPostSlugs, getPostData } from '../../lib/posts';
import { marked } from 'marked';

export default function Post({ postData }) {
  if (!postData) {
    return <div>Post not found.</div>; // Or a proper 404 component
  }
  
  // The featuredImage is now a direct attribute
  const featuredImage = postData.FeaturedImage;

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
          
          {featuredImage && (
            <img 
              src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${featuredImage.url}`}
              alt={featuredImage.alternativeText || postData.Title}
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

export async function getStaticPaths() {
  const paths = await getAllPostSlugs();
  return {
    paths,
    fallback: 'blocking', // Allows for new pages to be generated on the fly
  };
}

export async function getStaticProps({ params }) {
  const postDataFromApi = await getPostData(params.slug);

  if (!postDataFromApi) {
    return {
      notFound: true,
    };
  }

  // Strapi's 'blocks' field type returns an array of block objects.
  // We must iterate through all blocks and join their text content
  // to reconstruct the full markdown string.
  const markdownText = (postDataFromApi.BodyContent || [])
    .map(block => 
      (block.children || [])
        .map(child => child.text)
        .join('')
    )
    .join('\n\n'); // Join paragraphs with double newlines for proper markdown spacing

  const contentHtml = marked(markdownText);
  
  const postData = {
    ...postDataFromApi,
    contentHtml,
  };

  return {
    props: {
      postData,
    },
    revalidate: 10, // In seconds
  };
}
