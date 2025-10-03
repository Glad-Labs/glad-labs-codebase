import Link from 'next/link';

const PostList = ({ posts }) => {
  if (!posts || posts.length === 0) {
    return <p className="text-gray-500">No posts found.</p>;
  }

  return (
    <div className="grid gap-10 md:gap-12">
      {posts.map(({ Slug, Title, publishedAt, MetaDescription }) => (
        <article key={Slug} className="group bg-gray-800/30 p-6 rounded-lg border border-transparent hover:border-cyan-400/50 transition-all duration-300">
          <h2 className="text-3xl font-bold text-cyan-300 group-hover:text-cyan-200 transition-colors">
            <Link href={`/posts/${Slug}`}>
              {Title}
            </Link>
          </h2>
          <p className="text-gray-500 text-sm mt-2">{new Date(publishedAt).toLocaleDateString()}</p>
          <p className="text-gray-300 mt-4 text-lg">{MetaDescription}</p>
          <Link href={`/posts/${Slug}`} className="text-cyan-400 hover:text-cyan-300 mt-6 inline-block font-semibold">
            Read Full Article &rarr;
          </Link>
        </article>
      ))}
    </div>
  );
};

export default PostList;
