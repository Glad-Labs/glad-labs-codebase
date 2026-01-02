import Link from 'next/link';

export const metadata = {
  title: 'About Glad Labs - AI & Digital Innovation',
  description:
    'Learn about Glad Labs mission, values, and our commitment to advancing AI-powered digital solutions for businesses worldwide.',
  openGraph: {
    title: 'About Glad Labs',
    description:
      'Transforming digital innovation with AI-powered insights and autonomous intelligence',
    type: 'website',
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 bg-clip-text text-transparent">
              About Glad Labs
            </span>
          </h1>
          <p className="text-xl text-slate-300 mb-8 leading-relaxed">
            Transforming digital innovation through cutting-edge AI, autonomous
            agents, and intelligent automation.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            {/* Mission Content */}
            <div className="order-2 md:order-1">
              <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Our Mission
              </h2>
              <p className="text-slate-300 text-lg leading-relaxed mb-6">
                At Glad Labs, we're building the future of autonomous
                intelligence. We believe that AI-powered solutions should be
                accessible, practical, and transformative for businesses of all
                sizes.
              </p>
              <p className="text-slate-300 text-lg leading-relaxed mb-6">
                Our mission is to pioneer innovative AI technologies that
                empower organizations to automate complex workflows, gain deeper
                insights from data, and make smarter decisions faster.
              </p>
              <p className="text-slate-400 text-base">
                We're committed to creating intelligent systems that complement
                human expertise and drive meaningful business outcomes.
              </p>
            </div>

            {/* Mission Visual */}
            <div className="order-1 md:order-2">
              <div className="relative h-80 rounded-2xl overflow-hidden border border-cyan-500/30 bg-slate-800/50 backdrop-blur-sm flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10" />
                <div className="relative text-center">
                  <div className="text-6xl mb-4">🚀</div>
                  <p className="text-cyan-400 font-semibold">
                    AI-Powered Innovation
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div className="bg-gradient-to-r from-slate-800/30 to-slate-900/30 rounded-2xl border border-slate-700/50 p-8 md:p-12 mb-20">
            <h2 className="text-4xl font-bold mb-12 text-center bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Our Core Values
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Innovation */}
              <div className="bg-slate-800/40 rounded-xl p-6 border border-slate-700/50 hover:border-cyan-500/50 transition-colors">
                <div className="text-4xl mb-4">💡</div>
                <h3 className="text-xl font-bold text-white mb-3">
                  Innovation
                </h3>
                <p className="text-slate-400">
                  We continuously push the boundaries of what's possible with
                  AI, exploring new technologies and methodologies to solve
                  complex business challenges.
                </p>
              </div>

              {/* Quality */}
              <div className="bg-slate-800/40 rounded-xl p-6 border border-slate-700/50 hover:border-cyan-500/50 transition-colors">
                <div className="text-4xl mb-4">⭐</div>
                <h3 className="text-xl font-bold text-white mb-3">Quality</h3>
                <p className="text-slate-400">
                  Excellence is non-negotiable. We deliver robust, well-tested,
                  production-ready solutions that our clients can trust and rely
                  on.
                </p>
              </div>

              {/* Accessibility */}
              <div className="bg-slate-800/40 rounded-xl p-6 border border-slate-700/50 hover:border-cyan-500/50 transition-colors">
                <div className="text-4xl mb-4">🌍</div>
                <h3 className="text-xl font-bold text-white mb-3">
                  Accessibility
                </h3>
                <p className="text-slate-400">
                  Advanced AI shouldn't be exclusive. We believe in creating
                  intelligent solutions that are practical, implementable, and
                  beneficial for all.
                </p>
              </div>
            </div>
          </div>

          {/* What We Do Section */}
          <div className="mb-20">
            <h2 className="text-4xl font-bold mb-12 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              What We Do
            </h2>

            <div className="space-y-8">
              {/* AI Agents */}
              <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700/50 hover:border-cyan-500/50 transition-all duration-300 hover:bg-slate-800/70">
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500">
                      <span className="text-xl">🤖</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-3">
                      Autonomous AI Agents
                    </h3>
                    <p className="text-slate-300 text-lg">
                      We build intelligent, autonomous agents that can
                      understand context, make decisions, and take actions
                      autonomously. These agents can be customized for content
                      creation, market analysis, financial planning, compliance
                      management, and more.
                    </p>
                  </div>
                </div>
              </div>

              {/* Content Intelligence */}
              <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700/50 hover:border-cyan-500/50 transition-all duration-300 hover:bg-slate-800/70">
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500">
                      <span className="text-xl">📝</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-3">
                      Content Intelligence
                    </h3>
                    <p className="text-slate-300 text-lg">
                      Our self-critiquing content pipeline generates
                      high-quality, original content through a six-stage
                      process: research, creation, critique, refinement, visual
                      integration, and publication. Each piece is optimized for
                      quality, engagement, and search performance.
                    </p>
                  </div>
                </div>
              </div>

              {/* Multi-Provider Orchestration */}
              <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700/50 hover:border-cyan-500/50 transition-all duration-300 hover:bg-slate-800/70">
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500">
                      <span className="text-xl">⚙️</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-3">
                      Intelligent Model Routing
                    </h3>
                    <p className="text-slate-300 text-lg">
                      Our intelligent router automatically selects the optimal
                      AI model based on task requirements and cost. Seamlessly
                      fallback between Ollama (local), Claude, GPT-4, and Gemini
                      to optimize performance and budget.
                    </p>
                  </div>
                </div>
              </div>

              {/* Data & Persistence */}
              <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700/50 hover:border-cyan-500/50 transition-all duration-300 hover:bg-slate-800/70">
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500">
                      <span className="text-xl">💾</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-3">
                      Data Persistence & Management
                    </h3>
                    <p className="text-slate-300 text-lg">
                      PostgreSQL-backed persistence ensures all agent
                      activities, results, memories, and metrics are captured
                      and queryable. Full audit trails, compliance tracking, and
                      analytics on all AI operations.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tech Stack Section */}
          <div className="bg-gradient-to-r from-slate-800/30 to-slate-900/30 rounded-2xl border border-slate-700/50 p-8 md:p-12 mb-20">
            <h2 className="text-3xl font-bold mb-8 text-white">
              Our Technology Stack
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-cyan-400 mb-4">
                  Backend & AI
                </h3>
                <ul className="space-y-2 text-slate-300">
                  <li>
                    ✓ FastAPI (Python) - High-performance async API server
                  </li>
                  <li>✓ PostgreSQL - Enterprise-grade data persistence</li>
                  <li>✓ OpenAI & Anthropic APIs - Leading LLM models</li>
                  <li>✓ Ollama - Local LLM inference</li>
                  <li>✓ MCP Integration - Model Context Protocol</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-cyan-400 mb-4">
                  Frontend & Deployment
                </h3>
                <ul className="space-y-2 text-slate-300">
                  <li>✓ Next.js 15 - React framework with SSG</li>
                  <li>✓ React 18 - Component-based UI</li>
                  <li>✓ Tailwind CSS - Utility-first styling</li>
                  <li>✓ Vercel - Global deployment & edge functions</li>
                  <li>✓ Railway - Backend infrastructure</li>
                </ul>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-6 text-white">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Discover how Glad Labs' AI solutions can automate your workflows
              and unlock new opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/archive/1"
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300"
              >
                Explore Our Insights
              </Link>
              <Link
                href="/"
                className="px-8 py-4 border border-cyan-500/50 text-cyan-400 font-semibold rounded-xl hover:bg-cyan-500/10 transition-all duration-300"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
