import Head from 'next/head';
import { getTags, getTagBySlug, getPostsByTag } from '../../lib/api';
import PostCard from '../../components/PostCard';

export default function TagPage({ tag, posts }) {
  return (
    <>
      <Head>
        <title>{tag.name} - Glad Labs Frontier</title>
        <meta name="description" content={`Posts tagged with: ${tag.name}`} />
      </Head>
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-cyan-400 mb-8">
            Tag: {tag.name}
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts
              .filter((post) => Boolean(post.slug))
              .map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
          </div>
        </div>
      </div>
    </>
  );
}

export async function getStaticPaths() {
  try {
    const tags = await getTags();
    const paths = tags.map((tag) => ({
      params: { slug: tag.slug },
    }));

    return {
      paths,
      fallback: 'blocking',
    };
  } catch (error) {
    console.error('Error fetching tags:', error);
    // Return empty paths if API fails - fallback will handle requests
    return {
      paths: [],
      fallback: 'blocking',
    };
  }
}

export async function getStaticProps({ params }) {
  try {
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
  } catch (error) {
    console.error(`Error fetching tag ${params.slug}:`, error);
    return {
      notFound: true,
      revalidate: 10,
    };
  }
}
