import Head from 'next/head';
import {
  getCategories,
  getCategoryBySlug,
  getPostsByCategory,
} from '../../lib/api';
import Link from 'next/link';

export default function CategoryPage({ category, posts }) {
  return (
    <>
      <Head>
        <title>{category.Name} - Glad Labs Frontier</title>
        <meta
          name="description"
          content={`Posts in the category: ${category.Name}`}
        />
      </Head>
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-cyan-400 mb-2">
            Category: {category.Name}
          </h1>
          <p className="text-lg text-gray-400 mb-8">{category.Description}</p>
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
  const categories = await getCategories();
  const paths = categories.map((category) => ({
    params: { slug: category.Slug },
  }));

  return {
    paths,
    fallback: 'blocking',
  };
}

export async function getStaticProps({ params }) {
  const category = await getCategoryBySlug(params.slug);
  const posts = await getPostsByCategory(params.slug);

  if (!category) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      category,
      posts,
    },
    revalidate: 60,
  };
}
