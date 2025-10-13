import Link from 'next/link';
import Image from 'next/image';
import { getStrapiURL } from '../lib/api';

const safeFormatDate = (value) => {
  if (!value) return '';
  const d = new Date(value);
  return isNaN(d.getTime()) ? '' : d.toLocaleDateString();
};

const PostCard = ({ post }) => {
  // Strapi schema uses lowercase field names
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

  return (
    <Link
      href={href}
      aria-disabled={!isClickable}
      className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
    >
      {imageUrl && (
        <div className="relative h-48">
          <Image
            src={imageUrl}
            alt={coverImage?.data?.attributes?.alternativeText || title}
            fill
            style={{ objectFit: 'cover' }}
          />
        </div>
      )}
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">{title}</h2>
        <p className="text-gray-600 mb-2">
          {safeFormatDate(date || publishedAt)}
        </p>
        <p className="text-gray-700">{excerpt}</p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {category?.data?.attributes?.slug && (
            <Link
              href={`/category/${category.data.attributes.slug}`}
              className="inline-block text-xs px-2 py-1 rounded bg-cyan-100 text-cyan-700 hover:bg-cyan-200"
            >
              {category.data.attributes.name}
            </Link>
          )}
          {Array.isArray(tags?.data) &&
            tags.data.slice(0, 3).map((tag) => (
              <Link
                key={tag.id}
                href={`/tag/${tag.attributes.slug}`}
                className="inline-block text-xs px-2 py-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                #{tag.attributes.name}
              </Link>
            ))}
        </div>
      </div>
    </Link>
  );
};

export default PostCard;
