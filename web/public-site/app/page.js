import Link from 'next/link';

export const metadata = {
  title: 'Home - Glad Labs Blog',
  description:
    'Welcome to the Glad Labs AI blog. Exploring technology, innovation, and digital transformation.',
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 mb-6">
            Glad Labs
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
            Exploring the future of technology, AI, and digital innovation.
            Insights from the Glad Labs team.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/archive/1"
              className="px-8 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition-colors"
            >
              Read Latest Posts
            </Link>
            <Link
              href="/legal/privacy"
              className="px-8 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Content */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <article className="bg-gray-800/50 rounded-lg p-6 border border-gray-700 hover:border-cyan-500 transition">
            <h2 className="text-2xl font-bold text-white mb-3">
              Latest Articles
            </h2>
            <p className="text-gray-400">
              Discover our most recent insights and analysis on AI, technology,
              and business innovation.
            </p>
          </article>
          <article className="bg-gray-800/50 rounded-lg p-6 border border-gray-700 hover:border-cyan-500 transition">
            <h2 className="text-2xl font-bold text-white mb-3">Technology</h2>
            <p className="text-gray-400">
              Deep dives into emerging technologies, frameworks, and tools
              shaping the future.
            </p>
          </article>
          <article className="bg-gray-800/50 rounded-lg p-6 border border-gray-700 hover:border-cyan-500 transition">
            <h2 className="text-2xl font-bold text-white mb-3">Insights</h2>
            <p className="text-gray-400">
              Strategic analysis and business intelligence from our team of
              experts.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}
