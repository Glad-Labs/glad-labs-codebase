import Link from 'next/link';
import { getStrapiURL } from '../lib/api';
import OptimizedImage from './OptimizedImage';

const safeFormatDate = (value) => {
  if (!value) return '';
  const d = new Date(value);
  return isNaN(d.getTime()) ? '' : d.toLocaleDateString();
};

const PostCard = ({ post }) => {
  const {
    title,
    excerpt,
    slug,
    publishedAt,
    date,
    coverImage,
    category,
    tags,
  } = post;
  const imageUrl = coverImage?.data?.attributes?.url
    ? getStrapiURL(coverImage.data.attributes.url)
    : null;

  const href = slug ? `/posts/${slug}` : '#';
  const isClickable = Boolean(slug);
  const displayDate = safeFormatDate(date || publishedAt);
  const dateISO =
    date || publishedAt
      ? new Date(date || publishedAt).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0];

  return (
    <article
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden focus-within:ring-2 focus-within:ring-cyan-500"
      aria-labelledby={`post-title-${slug}`}
    >
      {/* Cover Image */}
      {imageUrl && (
        <div className="relative h-48 w-full">
          <OptimizedImage
            src={imageUrl}
            alt={
              coverImage?.data?.attributes?.alternativeText ||
              `Cover image for ${title}`
            }
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}

      {/* Card Content */}
      <div className="p-6 flex flex-col h-full">
        {/* Category - with appropriate semantic structure */}
        {category?.data?.attributes?.slug && (
          <div className="mb-3 flex items-center gap-1">
            <span className="sr-only">Category:</span>
            <Link
              href={`/category/${category.data.attributes.slug}`}
              className="text-xs px-2 py-1 rounded bg-cyan-100 text-cyan-700 hover:bg-cyan-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 transition-all"
              aria-label={`View articles in category: ${category.data.attributes.name}`}
            >
              {category.data.attributes.name}
            </Link>
          </div>
        )}

        {/* Post Title - Proper heading hierarchy */}
        <h3
          id={`post-title-${slug}`}
          className="text-xl font-bold mb-2 text-gray-800 leading-tight line-clamp-2"
        >
          <Link
            href={href}
            className="hover:text-cyan-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:rounded"
            tabIndex={isClickable ? 0 : -1}
            aria-disabled={!isClickable}
          >
            {title}
          </Link>
        </h3>

        {/* Published Date - Semantic time element */}
        <div className="mb-3 flex items-center gap-2 text-sm text-gray-500">
          <svg
            className="w-4 h-4"
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

        {/* Excerpt */}
        <p className="text-gray-700 mb-4 flex-grow line-clamp-3">{excerpt}</p>

        {/* Tags */}
        {Array.isArray(tags?.data) && tags.data.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-gray-200">
            <span className="sr-only">Tags:</span>
            {tags.data.slice(0, 3).map((tag) => (
              <Link
                key={tag.id}
                href={`/tag/${tag.attributes.slug}`}
                className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 transition-all"
                aria-label={`View articles tagged with: ${tag.attributes.name}`}
              >
                {tag.attributes.name}
              </Link>
            ))}
            {tags.data.length > 3 && (
              <span
                className="text-xs text-gray-500"
                aria-label={`and ${tags.data.length - 3} more tags`}
              >
                +{tags.data.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Read More Link - Semantic and accessible */}
        <div className="mt-4 pt-3 border-t border-gray-100">
          <Link
            href={href}
            className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-600 hover:text-cyan-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:rounded transition-all"
            aria-label={`Read full article: ${title}`}
          >
            Read Article
            <svg
              className="w-4 h-4 group-hover:translate-x-1 transition-transform"
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
        </div>
      </div>
    </article>
  );
};

export default PostCard;
