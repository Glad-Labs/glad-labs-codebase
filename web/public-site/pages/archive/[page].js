import Head from 'next/head';
import { getPaginatedPosts } from '../../lib/api';
import Link from 'next/link';
import Pagination from '../../components/Pagination';
import PostCard from '../../components/PostCard';

const POSTS_PER_PAGE = 10;

export default function ArchivePage({ posts, pagination }) {
  return (
    <>
      <Head>
        <title>Archive - Page {pagination.page} - Glad Labs Frontier</title>
        <meta
          name="description"
          content={`Page ${pagination.page} of the content archive from the Glad Labs Frontier blog.`}
        />
      </Head>
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-cyan-400 mb-8">
            Content Archive
          </h1>
          <div className="space-y-8">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
          <Pagination pagination={pagination} basePath="/archive" />
        </div>
      </div>
    </>
  );
}

export async function getStaticPaths() {
  try {
    const postsData = await getPaginatedPosts(1, 1); // Fetch one post to get pagination info
    const pageCount = postsData.meta?.pagination?.pageCount || 1;
    const paths = Array.from({ length: Math.min(pageCount, 10) }, (_, i) => ({
      params: { page: (i + 1).toString() },
    }));

    return {
      paths,
      fallback: 'blocking',
    };
  } catch (error) {
    console.error('Error fetching pagination data:', error);
    // Fallback: generate paths 1-5 if API is unavailable
    return {
      paths: Array.from({ length: 5 }, (_, i) => ({
        params: { page: (i + 1).toString() },
      })),
      fallback: 'blocking',
    };
  }
}

export async function getStaticProps({ params }) {
  try {
    const page = parseInt(params.page, 10) || 1;
    const postsData = await getPaginatedPosts(page, POSTS_PER_PAGE);

    if (!postsData || !postsData.data || !postsData.data.length) {
      return {
        notFound: true,
        revalidate: 60,
      };
    }

    return {
      props: {
        posts: postsData.data,
        pagination: postsData.meta?.pagination || { page, pageSize: POSTS_PER_PAGE, pageCount: 1 },
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error(`Error fetching posts for page ${params.page}:`, error);
    // Return fallback page on error instead of failing the build
    return {
      props: {
        posts: [],
        pagination: { page: parseInt(params.page, 10) || 1, pageSize: POSTS_PER_PAGE, pageCount: 1 },
      },
      revalidate: 10, // Retry sooner if there's an error
    };
  }
}
