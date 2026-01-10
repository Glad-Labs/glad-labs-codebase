'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { getFastAPIURL } from '@/lib/url';

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const fastApiUrl = getFastAPIURL();
        const response = await fetch(
          `${fastApiUrl}/api/posts?populate=*&status=published&limit=20`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }

        const data = await response.json();
        const posts = data.data || data || [];
        setPosts(posts);
        setError(null);
      } catch (err) {
        console.error('[Home Page] Error fetching posts:', err);
        setError(err instanceof Error ? err.message : 'Failed to load posts');
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? posts.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === posts.length - 1 ? 0 : prev + 1));
  };

  const currentPost = posts[currentIndex];
  const nextPost = posts[(currentIndex + 1) % posts.length];
  const prevPost = posts[(currentIndex - 1 + posts.length) % posts.length];

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Simplified Hero Section */}
      <section className="relative pt-20 pb-12 md:pt-32 md:pb-20 px-4 md:px-0">
        <div className="container mx-auto max-w-5xl text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
            Explore Our Latest Insights
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Deep dives into AI, technology, and digital transformation
          </p>
        </div>
      </section>

      {/* Featured Post Carousel */}
      {loading && (
        <section className="py-12 px-4 md:px-0">
          <div className="container mx-auto max-w-6xl">
            <div className="h-96 bg-slate-800 rounded-xl flex items-center justify-center">
              <p className="text-slate-400">Loading posts...</p>
            </div>
          </div>
        </section>
      )}

      {error && (
        <section className="py-12 px-4 md:px-0">
          <div className="container mx-auto max-w-6xl">
            <div className="h-96 bg-slate-800 rounded-xl flex items-center justify-center border border-red-500/30">
              <p className="text-red-400">
                Unable to load posts. Please try again later.
              </p>
            </div>
          </div>
        </section>
      )}

      {!loading && !error && posts.length > 0 && currentPost && (
        <section className="py-12 px-4 md:px-0">
          <div className="container mx-auto max-w-6xl">
            {/* Main Featured Post Card */}
            <div className="bg-gradient-to-b from-slate-800/50 to-slate-900/50 rounded-2xl overflow-hidden border border-cyan-500/20 hover:border-cyan-400/40 transition-colors">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
                {/* Featured Image */}
                <div className="relative aspect-video lg:aspect-auto h-full min-h-96 bg-slate-700 rounded-xl overflow-hidden">
                  {currentPost.featured_image_url ? (
                    <Image
                      src={currentPost.featured_image_url}
                      alt={currentPost.title}
                      fill
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      className="object-cover"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-cyan-500/20 to-violet-500/20 flex items-center justify-center">
                      <span className="text-slate-400">No image available</span>
                    </div>
                  )}
                </div>

                {/* Post Content */}
                <div className="flex flex-col justify-between">
                  {/* Category & Meta */}
                  <div>
                    {currentPost.category && (
                      <div className="inline-block mb-4">
                        <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-sm font-medium border border-cyan-500/30">
                          {currentPost.category.name || 'Featured'}
                        </span>
                      </div>
                    )}

                    {/* Title */}
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
                      {currentPost.title}
                    </h2>

                    {/* Excerpt */}
                    <p className="text-lg text-slate-300 mb-6 leading-relaxed">
                      {currentPost.excerpt ||
                        (currentPost.content
                          ? currentPost.content.substring(0, 200) + '...'
                          : 'Read this insightful article')}
                    </p>
                  </div>

                  {/* Meta Information & CTA */}
                  <div className="flex items-center justify-between pt-6 border-t border-slate-700/50">
                    <div className="text-sm text-slate-400">
                      {currentPost.published_at && (
                        <time dateTime={currentPost.published_at}>
                          {new Date(
                            currentPost.published_at
                          ).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </time>
                      )}
                    </div>

                    <Link
                      href={`/posts/${currentPost.slug}`}
                      className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
                    >
                      Read Article
                      <span className="text-xl">→</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center justify-between mt-8">
              {/* Previous/Next Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handlePrevious}
                  className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold transition-colors border border-slate-700 hover:border-cyan-500/50"
                  aria-label="Previous post"
                >
                  ← Previous
                </button>
                <button
                  onClick={handleNext}
                  className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold transition-colors border border-slate-700 hover:border-cyan-500/50"
                  aria-label="Next post"
                >
                  Next →
                </button>
              </div>

              {/* Post Counter */}
              <div className="text-slate-400 font-medium">
                {currentIndex + 1} / {posts.length}
              </div>
            </div>

            {/* Dot Indicators for first 5 posts */}
            <div className="flex gap-2 mt-6 justify-center flex-wrap">
              {posts.slice(0, 5).map((post, index) => (
                <button
                  key={post.id || index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentIndex
                      ? 'w-8 bg-cyan-400'
                      : 'w-2 bg-slate-700 hover:bg-slate-600'
                  }`}
                  aria-label={`Go to post ${index + 1}`}
                />
              ))}
            </div>

            {/* Preview Cards - Hidden on Mobile */}
            {posts.length > 1 && (
              <div className="hidden lg:grid grid-cols-2 gap-6 mt-12">
                {/* Previous Post Preview */}
                {prevPost && (
                  <div
                    className="p-6 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors cursor-pointer"
                    onClick={handlePrevious}
                  >
                    <p className="text-sm text-slate-400 mb-2">← Previous</p>
                    <h3 className="text-lg font-semibold text-white truncate hover:text-cyan-400 transition-colors">
                      {prevPost.title}
                    </h3>
                  </div>
                )}

                {/* Next Post Preview */}
                {nextPost && (
                  <div
                    className="p-6 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors cursor-pointer text-right"
                    onClick={handleNext}
                  >
                    <p className="text-sm text-slate-400 mb-2">Next →</p>
                    <h3 className="text-lg font-semibold text-white truncate hover:text-cyan-400 transition-colors">
                      {nextPost.title}
                    </h3>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Browse All Articles CTA */}
      <section className="py-16 px-4 md:px-0">
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Browse All Articles
          </h2>
          <p className="text-lg text-slate-400 mb-8">
            Explore our complete collection of insights and analyses
          </p>
          <Link
            href="/archive/1"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all text-lg"
          >
            View All Articles
            <span className="text-2xl">→</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
