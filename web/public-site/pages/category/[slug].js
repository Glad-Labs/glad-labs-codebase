import Head from 'next/head';
import {
  getCategories,
  getCategoryBySlug,
  getPostsByCategory,
} from '../../lib/api';
import PostCard from '../../components/PostCard';

export default function CategoryPage({ category, posts }) {
  return (
    <>
      <Head>
        <title>{category.name} - Glad Labs Frontier</title>
        <meta
          name="description"
          content={`Posts in the category: ${category.name}`}
        />
      </Head>
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-cyan-400 mb-2">
            Category: {category.name}
          </h1>
          <p className="text-lg text-gray-400 mb-8">{category.description}</p>
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
    const categories = await getCategories();
    const paths = categories.map((category) => ({
      params: { slug: category.slug },
    }));

    return {
      paths,
      fallback: 'blocking',
    };
  } catch (error) {
    console.error('Error fetching categories:', error);
    // Return empty paths if API fails - fallback will handle requests
    return {
      paths: [],
      fallback: 'blocking',
    };
  }
}

export async function getStaticProps({ params }) {
  try {
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
  } catch (error) {
    console.error(`Error fetching category ${params.slug}:`, error);
    return {
      notFound: true,
      revalidate: 10,
    };
  }
}
