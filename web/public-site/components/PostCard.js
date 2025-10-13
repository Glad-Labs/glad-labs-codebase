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
  const { title, excerpt, slug, publishedAt, date, coverImage } = post;
  const imageUrl = coverImage?.data?.attributes?.url
    ? getStrapiURL(coverImage.data.attributes.url)
    : null;

  return (
    <Link
      href={`/posts/${slug}`}
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
        <p className="text-gray-600 mb-4">
          {safeFormatDate(date || publishedAt)}
        </p>
        <p className="text-gray-700">{excerpt}</p>
      </div>
    </Link>
  );
};

export default PostCard;
