import Head from 'next/head';
import { getTags, getTagBySlug, getPostsByTag } from '../../lib/api';
import Link from 'next/link';

export default function TagPage({ tag, posts }) {
  return (
    <>
      <Head>
        <title>{tag.Name} - Glad Labs Frontier</title>
        <meta name="description" content={`Posts tagged with: ${tag.Name}`} />
      </Head>
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-cyan-400 mb-8">
            Tag: {tag.Name}
          </h1>
          <div className="space-y-8">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/posts/${post.Slug}`}
                className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <h2 className="text-2xl font-bold mb-2">{post.Title}</h2>
                <p className="text-gray-600 mb-4">
                  {new Date(post.publishedAt).toLocaleDateString()}
                </p>
                <p className="text-gray-700">{post.Excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export async function getStaticPaths() {
  const tags = await getTags();
  const paths = tags.map((tag) => ({
    params: { slug: tag.Slug },
  }));

  return {
    paths,
    fallback: 'blocking',
  };
}

export async function getStaticProps({ params }) {
  const tag = await getTagBySlug(params.slug);
  const posts = await getPostsByTag(params.slug);

  if (!tag) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      tag,
      posts,
    },
    revalidate: 60,
  };
}
