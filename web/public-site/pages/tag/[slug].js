export default function TagPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold">Tag Page Deprecated</h1>
      <p>
        This tag page has been deprecated. Please visit the main{' '}
        <a href="/blog" className="text-cyan-400 hover:underline">
          blog
        </a>{' '}
        instead.
      </p>
    </div>
  );
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: false,
  };
}

export async function getStaticProps() {
  return {
    notFound: true,
  };
}
