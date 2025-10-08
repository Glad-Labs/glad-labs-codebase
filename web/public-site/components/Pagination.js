import Link from 'next/link';

export default function Pagination({ pagination, basePath = '/archive' }) {
  const { page, pageCount } = pagination;

  if (pageCount <= 1) return null;

  const pages = Array.from({ length: pageCount }, (_, i) => i + 1);

  return (
    <div className="flex justify-center items-center space-x-4 py-8">
      {page > 1 && (
        <Link
          href={`${basePath}/${page - 1}`}
          className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
        >
          Previous
        </Link>
      )}

      {pages.map((p) => (
        <Link
          key={p}
          href={`${basePath}/${p}`}
          className={`px-4 py-2 rounded ${
            p === page
              ? 'bg-cyan-500 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          {p}
        </Link>
      ))}

      {page < pageCount && (
        <Link
          href={`${basePath}/${page + 1}`}
          className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
        >
          Next
        </Link>
      )}
    </div>
  );
}
