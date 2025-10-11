import { getPostBySlug, getAllPosts } from '../../lib/api';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { BlocksRenderer } from '@strapi/blocks-react-renderer';

const PostMeta = ({ category, tags }) => (
  <div className="flex items-center space-x-4 text-gray-400">
    {category && (
      <Link
        href={`/category/${category.data.attributes.Slug}`}
        className="hover:text-cyan-400"
      >
        {category.data.attributes.Name}
      </Link>
    )}
    {tags && tags.data.length > 0 && <span>|</span>}
    <div className="flex space-x-2">
      {tags &&
        tags.data.map((tag) => (
          <Link
            key={tag.id}
            href={`/tag/${tag.attributes.Slug}`}
            className="hover:text-cyan-400"
          >
            #{tag.attributes.Name}
          </Link>
        ))}
    </div>
  </div>
);

export default function Post({ post }) {
  if (!post) return <div>Loading...</div>;

  const { Title, BodyContent, publishedAt, FeaturedImage, category, tags } =
    post;
  const imageUrl = FeaturedImage?.data?.attributes?.url;

  return (
    <>
      <Head>
        <title>{Title} | GLAD Labs Blog</title>
        <meta name="description" content={post.Excerpt} />
        {/* Open Graph */}
        <meta property="og:title" content={Title} />
        <meta property="og:description" content={post.Excerpt} />
        <meta property="og:image" content={imageUrl} />
        <meta
          property="og:url"
          content={`https://www.glad-labs.com/posts/${post.Slug}`}
        />
        <meta property="og:type" content="article" />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={Title} />
        <meta name="twitter:description" content={post.Excerpt} />
        <meta name="twitter:image" content={imageUrl} />
      </Head>
      <div className="container mx-auto px-4 md:px-6 py-12">
        <article className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-cyan-300 mb-4 leading-tight">
              {Title}
            </h1>
            <p className="text-lg text-gray-400 mb-4">
              Published on {new Date(publishedAt).toLocaleDateString()}
            </p>
            <PostMeta category={category} tags={tags} />
            <p className="text-sm text-gray-500 mt-2">
              Note: For categories and tags to appear, ensure you have set up
              the relations in your Strapi Post content type.
            </p>
          </div>

          {imageUrl && (
            <div className="relative h-96 mb-8">
              <Image
                src={imageUrl}
                alt={FeaturedImage?.data?.attributes?.alternativeText || Title}
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>
          )}

          <div className="prose prose-invert lg:prose-xl mx-auto">
            <BlocksRenderer content={BodyContent} />
          </div>
        </article>
      </div>
    </>
  );
}

export async function getStaticPaths() {
  // Use getAllPosts to fetch all posts for path generation
  const posts = (await getAllPosts()) || [];

  const paths = posts
    // Add a filter to ensure we only process valid post objects with slugs
    .filter((post) => post?.attributes?.slug)
    .map((post) => ({
      // This line is now safe because the filter removed any invalid posts
      params: { slug: post.attributes.slug },
    }));

  return {
    paths,
    fallback: 'blocking',
  };
}

export async function getStaticProps({ params }) {
  const post = await getPostBySlug(params.slug);

  // If no post is found for the given slug, return a 404 page
  if (!post) {
    return {
      notFound: true,
    };
  }

  return {
    props: { post },
    revalidate: 60, // Re-generate the page every 60 seconds if needed
  };
}
