import Link from 'next/link';
import Image from 'next/image';

const PostCard = ({ post }) => {
  const { Title, Excerpt, Slug, publishedAt, FeaturedImage } = post;
  const imageUrl = FeaturedImage?.data?.url;

  return (
    <Link
      href={`/posts/${Slug}`}
      className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
    >
      {imageUrl && (
        <div className="relative h-48">
          <Image
            src={imageUrl}
            alt={FeaturedImage.data.alternativeText || Title}
            layout="fill"
            objectFit="cover"
          />
        </div>
      )}
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">{Title}</h2>
        <p className="text-gray-600 mb-4">
          {new Date(publishedAt).toLocaleDateString()}
        </p>
        <p className="text-gray-700">{Excerpt}</p>
      </div>
    </Link>
  );
};

export default PostCard;
