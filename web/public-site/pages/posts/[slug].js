import { getPostBySlug, getAllPosts, getStrapiURL } from '../../lib/api';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

const PostMeta = ({ category, tags }) => (
  <div className="flex items-center space-x-4 text-gray-400">
    {category && (
      <Link href={`/category/${category.slug}`} className="hover:text-cyan-400">
        {category.name}
      </Link>
    )}
    {tags && tags.length > 0 && <span>|</span>}
    <div className="flex space-x-2">
      {tags &&
        tags.map((tag) => (
          <Link
            key={tag.id}
            href={`/tag/${tag.slug}`}
            className="hover:text-cyan-400"
          >
            #{tag.name}
          </Link>
        ))}
    </div>
  </div>
);

export default function Post({ post }) {
  if (!post) return <div>Loading...</div>;

  // Align with Strapi schema (lowercase fields)
  const {
    title,
    content,
    excerpt,
    coverImage,
    publishedAt,
    date,
    category,
    tags,
    slug,
    seo,
  } = post;
  const imageUrl = coverImage?.url ? getStrapiURL(coverImage.url) : null;
  const metaTitle = (seo && seo.metaTitle) || `${title} | GLAD Labs Blog`;
  const metaDescription =
    (seo && seo.metaDescription) ||
    excerpt ||
    'Read this article on GLAD Labs.';

  return (
    <>
      <Head>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        {/* Open Graph */}
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        {imageUrl && <meta property="og:image" content={imageUrl} />}
        <meta
          property="og:url"
          content={`https://www.glad-labs.com/posts/${slug}`}
        />
        <meta property="og:type" content="article" />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
        {imageUrl && <meta name="twitter:image" content={imageUrl} />}
      </Head>
      <div className="container mx-auto px-4 md:px-6 py-12">
        <article className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-cyan-300 mb-4 leading-tight">
              {title}
            </h1>
            <p className="text-lg text-gray-400 mb-4">
              {publishedAt || date
                ? `Published on ${new Date(
                    date || publishedAt
                  ).toLocaleDateString()}`
                : ''}
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
                alt={coverImage?.alternativeText || title}
                fill
                style={{ objectFit: 'cover' }}
                className="rounded-lg"
              />
            </div>
          )}

          <div className="prose prose-invert lg:prose-xl mx-auto">
            <ReactMarkdown>{content}</ReactMarkdown>
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
    .map((p) => p?.slug)
    .filter(Boolean)
    .map((slug) => ({ params: { slug } }));

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
