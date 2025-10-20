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
    const pageCount = postsData.meta.pagination.pageCount || 0;
    const paths = Array.from({ length: Math.max(1, pageCount) }, (_, i) => ({
      params: { page: (i + 1).toString() },
    }));

    return {
      paths,
      fallback: 'blocking',
    };
  } catch (error) {
    console.error('[Archive getStaticPaths] Error:', error.message);
    // Return first page on error; other pages will be generated on-demand
    return {
      paths: [{ params: { page: '1' } }],
      fallback: 'blocking',
    };
  }
}

export async function getStaticProps({ params }) {
  try {
    const page = parseInt(params.page, 10) || 1;
    const postsData = await getPaginatedPosts(page, POSTS_PER_PAGE);

    // Check if we have data or if it's the first page (return empty)
    if (!postsData.data.length && page > 1) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        posts: postsData.data,
        pagination: postsData.meta.pagination,
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error('[Archive getStaticProps] Error:', error.message);
    // Return empty posts on error but don't fail build
    return {
      props: {
        posts: [],
        pagination: {
          page: parseInt(params.page, 10) || 1,
          pageSize: POSTS_PER_PAGE,
          pageCount: 0,
          total: 0,
        },
      },
      revalidate: 60,
    };
  }
}
