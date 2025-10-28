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
 * Each post object should have `slug`, `title`, `publishedAt` or `date`, and `excerpt`.
 * @returns {JSX.Element} An unordered list of posts or a "not found" message.
 */
const PostList = ({ posts }) => {
  // Handle the case where there are no posts to display.
  if (!posts || posts.length === 0) {
    return (
      <div role="status" aria-live="polite" className="text-center py-8">
        <p className="text-center text-gray-400">
          No posts found. Check back soon!
        </p>
      </div>
    );
  }

  return (
    <ol
      className="space-y-8 max-w-4xl mx-auto list-none"
      role="feed"
      aria-label="Articles"
      aria-busy="false"
    >
      {posts
        .filter((post) => Boolean(post.slug))
        .map((post, index) => {
          const displayDate =
            post.publishedAt || post.date
              ? new Date(post.date || post.publishedAt).toLocaleDateString(
                  'en-US',
                  {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  }
                )
              : '';

          const dateISO =
            post.publishedAt || post.date
              ? new Date(post.date || post.publishedAt)
                  .toISOString()
                  .split('T')[0]
              : '';

          return (
            <li
              key={post.slug}
              className="border-b border-gray-700 pb-8 last:border-b-0 focus-within:ring-2 focus-within:ring-cyan-500 focus-within:rounded transition-all"
              role="article"
              aria-label={`Article: ${post.title}`}
            >
              {/* Article Title */}
              <div className="mb-3 flex items-start justify-between gap-4">
                <Link
                  href={`/posts/${post.slug}`}
                  className="group flex-1 focus:outline-none"
                >
                  <h2 className="text-2xl font-bold text-cyan-400 group-hover:text-cyan-300 group-focus-visible:ring-2 group-focus-visible:ring-cyan-500 group-focus-visible:rounded transition-all">
                    {post.title}
                  </h2>
                </Link>
                {/* Article Number for Screen Readers */}
                <span className="sr-only">Article {index + 1}</span>
              </div>

              {/* Publication Date */}
              <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
                <svg
                  className="w-4 h-4 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <time dateTime={dateISO} className="font-medium">
                  {displayDate}
                </time>
              </div>

              {/* Article Excerpt */}
              <p className="mt-3 text-lg text-gray-300 line-clamp-3">
                {post.excerpt}
              </p>

              {/* Read More Link */}
              <Link
                href={`/posts/${post.slug}`}
                className="inline-flex items-center gap-2 text-cyan-500 hover:text-cyan-400 mt-4 font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:rounded transition-all"
                aria-label={`Read full article: ${post.title}`}
              >
                <span>Read article</span>
                <svg
                  className="w-4 h-4 transition-transform group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
            </li>
          );
        })}
    </ol>
  );
};

export default PostList;
