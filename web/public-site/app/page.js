import Link from 'next/link';

export const metadata = {
  title: 'Home - Glad Labs | AI-Powered Digital Innovation',
  description:
    'Discover cutting-edge insights on AI, technology, and digital transformation. Glad Labs delivers forward-thinking analysis for the modern enterprise.',
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Hero Section - Premium Typography & Layout */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-4 md:px-0">
        <div className="container mx-auto max-w-5xl">
          {/* Premium Badge */}
          <div className="flex justify-center mb-8">
            <div className="px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full backdrop-blur-sm">
              <p className="text-sm font-medium text-cyan-300">
                ✨ Transforming Digital Innovation
              </p>
            </div>
          </div>

          {/* Main Headline */}
          <h1 className="text-center mb-8">
            <span className="block text-5xl md:text-7xl lg:text-8xl font-black mb-4 leading-tight">
              <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-violet-300 bg-clip-text text-transparent animate-gradient">
                Shape the Future
              </span>
            </span>
            <span className="block text-2xl md:text-4xl text-slate-300 font-light tracking-wide">
              With AI-Powered Insights
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-center text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed">
            Explore cutting-edge analysis on artificial intelligence, emerging
            technologies, and digital transformation. Insights from industry
            leaders shaping tomorrow's innovation landscape.
          </p>

          {/* Premium CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <Link
              href="/archive/1"
              className="group px-8 md:px-10 py-4 md:py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/50 hover:scale-105 text-center"
            >
              <span>Explore Articles</span>
              <span className="ml-2 inline-block group-hover:translate-x-1 transition-transform">
                →
              </span>
            </Link>
            <Link
              href="/legal/privacy"
              className="px-8 md:px-10 py-4 md:py-4 bg-slate-800/50 border border-slate-700 hover:border-slate-600 text-slate-200 hover:text-white font-semibold rounded-xl transition-all duration-300 backdrop-blur-sm hover:bg-slate-800 text-center"
            >
              Learn Our Philosophy
            </Link>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4 md:gap-8 pt-12 border-t border-slate-800">
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-cyan-300">
                50+
              </p>
              <p className="text-sm md:text-base text-slate-400 mt-2">
                Articles Published
              </p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-blue-300">
                100K+
              </p>
              <p className="text-sm md:text-base text-slate-400 mt-2">
                Monthly Readers
              </p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-violet-300">
                3M+
              </p>
              <p className="text-sm md:text-base text-slate-400 mt-2">
                Insights Delivered
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Sections - Premium Cards */}
      <section className="relative py-20 md:py-32 px-4 md:px-0">
        <div className="container mx-auto max-w-6xl">
          {/* Section Title */}
          <div className="text-center mb-16 md:mb-24">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Explore Our Expertise
            </h2>
            <p className="text-lg text-slate-400">
              Deep dives into the topics shaping modern innovation
            </p>
          </div>

          {/* Premium Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {/* Card 1: Latest Articles */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 p-8 hover:border-cyan-500/50 transition-all duration-300 backdrop-blur-sm hover:shadow-2xl hover:shadow-cyan-500/20">
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-blue-600/0 group-hover:from-cyan-500/10 group-hover:to-blue-600/10 transition-all duration-300" />

              {/* Icon */}
              <div className="relative mb-6 w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
                📰
              </div>

              {/* Content */}
              <div className="relative">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                  Latest Articles
                </h3>
                <p className="text-slate-400 mb-6 leading-relaxed">
                  Discover our most recent insights and deep analysis on AI,
                  technology, and business innovation. Stay ahead of industry
                  trends.
                </p>
                <Link
                  href="/archive/1"
                  className="inline-flex items-center text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
                >
                  Read more{' '}
                  <span className="ml-2 group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </Link>
              </div>
            </div>

            {/* Card 2: Technology */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 p-8 hover:border-blue-500/50 transition-all duration-300 backdrop-blur-sm hover:shadow-2xl hover:shadow-blue-500/20">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-violet-600/0 group-hover:from-blue-500/10 group-hover:to-violet-600/10 transition-all duration-300" />

              <div className="relative mb-6 w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500/20 to-violet-600/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
                ⚙️
              </div>

              <div className="relative">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                  Technology Stack
                </h3>
                <p className="text-slate-400 mb-6 leading-relaxed">
                  Deep dives into emerging technologies, frameworks, and tools
                  shaping the future of software development and AI.
                </p>
                <Link
                  href="/archive/1"
                  className="inline-flex items-center text-blue-400 hover:text-blue-300 font-semibold transition-colors"
                >
                  Explore{' '}
                  <span className="ml-2 group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </Link>
              </div>
            </div>

            {/* Card 3: Insights */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 p-8 hover:border-violet-500/50 transition-all duration-300 backdrop-blur-sm hover:shadow-2xl hover:shadow-violet-500/20">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/0 to-pink-600/0 group-hover:from-violet-500/10 group-hover:to-pink-600/10 transition-all duration-300" />

              <div className="relative mb-6 w-12 h-12 rounded-lg bg-gradient-to-br from-violet-500/20 to-pink-600/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
                💡
              </div>

              <div className="relative">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                  Strategic Insights
                </h3>
                <p className="text-slate-400 mb-6 leading-relaxed">
                  Strategic analysis and business intelligence from our team of
                  domain experts and industry leaders.
                </p>
                <Link
                  href="/archive/1"
                  className="inline-flex items-center text-violet-400 hover:text-violet-300 font-semibold transition-colors"
                >
                  Discover{' '}
                  <span className="ml-2 group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 md:py-32 px-4 md:px-0">
        <div className="container mx-auto max-w-4xl">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-800/50 via-slate-900/50 to-slate-800/50 border border-slate-700/50 p-12 md:p-16 backdrop-blur-sm">
            {/* Gradient background */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-500/5" />

            <div className="relative text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Join Our Community
              </h2>
              <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
                Get exclusive insights delivered to your inbox. Stay informed
                about the latest trends in AI, technology, and digital
                innovation.
              </p>
              <Link
                href="/archive/1"
                className="inline-block px-10 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/50 hover:scale-105"
              >
                Start Reading Today
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
