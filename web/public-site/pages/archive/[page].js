import Head from 'next/head';
import Layout from '../../components/Layout';
import { getPaginatedPosts } from '../../lib/api';
import Link from 'next/link';
import Pagination from '../../components/Pagination';
import PostCard from '../../components/PostCard';

const POSTS_PER_PAGE = 10;

export default function ArchivePage({ posts, pagination }) {
  return (
    <Layout>
      <Head>
        <title>Archive - Page {pagination.page} - Glad Labs Frontier</title>
        <meta
          name="description"
          content={`Page ${pagination.page} of the content archive from the Glad Labs Frontier blog.`}
        />
      </Head>
      <div className="container mx-auto px-6 py-12">
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
    </Layout>
  );
}

export async function getStaticPaths() {
  const postsData = await getPaginatedPosts(1, 1); // Fetch one post to get pagination info
  const pageCount = postsData.meta.pagination.pageCount;
  const paths = Array.from({ length: pageCount }, (_, i) => ({
    params: { page: (i + 1).toString() },
  }));

  return {
    paths,
    fallback: 'blocking',
  };
}

export async function getStaticProps({ params }) {
  const page = parseInt(params.page, 10) || 1;
  const postsData = await getPaginatedPosts(page, POSTS_PER_PAGE);

  if (!postsData.data.length) {
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
}
