/**
 * @file components/PostList.js
 * @description A component that renders a list of blog posts. It takes an array
 * of post objects and displays them with links to the individual post pages.
 *
 * @requires next/link - For client-side navigation to each post's page.
 */

import Link from 'next/link';

/**
 * The PostList component.
 *
 * @param {Object} props
 * @param {Array<Object>} props.posts - An array of post objects to be displayed.
 * Each post object should have `Slug`, `Title`, `publishedAt`, and `MetaDescription`.
 * @returns {JSX.Element} An unordered list of posts or a "not found" message.
 */
const PostList = ({ posts }) => {
  // Handle the case where there are no posts to display.
  if (!posts || posts.length === 0) {
    return (
      <p className="text-center text-gray-400">
        No posts found. Check back soon!
      </p>
    );
  }

  return (
    <ul className="space-y-8 max-w-4xl mx-auto">
      {posts.map((post) => (
        <li
          key={post.Slug}
          className="border-b border-gray-700 pb-4 last:border-b-0"
        >
          <Link href={`/posts/${post.Slug}`} className="group">
            <h2 className="text-3xl font-bold text-cyan-400 group-hover:text-cyan-300 transition-colors duration-200">
              {post.Title}
            </h2>
          </Link>
          <div className="text-gray-400 mt-2 text-sm">
            <span>
              {new Date(post.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
            {/* 
              @suggestion FUTURE_ENHANCEMENT: Add post categories or tags here.
              This would allow users to filter posts by topic. The data would need
              to be added to the post front-matter first.
              e.g., <span className="ml-4">| Category: {post.category}</span>
            */}
          </div>
          <p className="mt-4 text-lg text-gray-300">{post.MetaDescription}</p>
          <Link
            href={`/posts/${post.Slug}`}
            className="text-cyan-500 hover:text-cyan-400 mt-4 inline-block"
          >
            Read more &rarr;
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default PostList;
