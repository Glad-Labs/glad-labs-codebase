import Link from 'next/link';

const PostList = ({ posts }) => {
  if (!posts || posts.length === 0) {
    return <p className="text-center text-gray-400">No posts found.</p>;
  }

  return (
    <ul className="space-y-8 max-w-4xl mx-auto">
      {posts.map((post) => (
        <li key={post.Slug} className="border-b border-gray-700 pb-4">
          <Link href={`/posts/${post.Slug}`}>
            <h2 className="text-3xl font-bold text-cyan-400 hover:text-cyan-300 transition-colors duration-200">
              {post.Title}
            </h2>
          </Link>
          <p className="text-gray-400 mt-2 text-sm">
            {new Date(post.publishedAt).toLocaleDateString()}
          </p>
          <p className="mt-4 text-lg text-gray-300">{post.MetaDescription}</p>
        </li>
      ))}
    </ul>
  );
};

export default PostList;
