import Link from 'next/link';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="relative bg-slate-950 border-t border-slate-800/50 mt-auto overflow-hidden"
      role="contentinfo"
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent pointer-events-none" />

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-1">
            <Link
              href="/"
              className="inline-block group mb-4"
            >
              <div className="text-3xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent group-hover:from-cyan-300 group-hover:to-blue-400 transition-all">
                GL
              </div>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Transforming digital innovation with AI-powered insights and autonomous intelligence.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              Explore
            </h3>
            <nav
              aria-label="Footer navigation"
              className="flex flex-col space-y-2"
            >
              <Link
                href="/archive/1"
                className="text-sm text-slate-400 hover:text-cyan-400 transition-colors font-medium"
              >
                All Articles
              </Link>
              <Link
                href="/"
                className="text-sm text-slate-400 hover:text-cyan-400 transition-colors font-medium"
              >
                Latest Posts
import Link from 'next/link';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="relative bg-slate-950 border-t border-slate-800/50 mt-auto overflow-hidden"
      role="contentinfo"
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent pointer-events-none" />

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-1">
            <Link
              href="/"
              className="inline-block group mb-4"
            >
              <div className="text-3xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent group-hover:from-cyan-300 group-hover:to-blue-400 transition-all">
                GL
              </div>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Transforming digital innovation with AI-powered insights and autonomous intelligence.
            </p>
          </div>

          {/* Explore Column */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              Explore
            </h3>
            <nav
              aria-label="Explore navigation"
              className="flex flex-col space-y-2"
            >
              <Link
                href="/archive/1"
                className="text-sm text-slate-400 hover:text-cyan-400 transition-colors font-medium"
              >
                All Articles
              </Link>
              <Link
                href="/"
                className="text-sm text-slate-400 hover:text-cyan-400 transition-colors font-medium"
              >
                Latest Posts
              </Link>
            </nav>
          </div>

          {/* Legal Column */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              Legal
            </h3>
            <nav className="flex flex-col space-y-2">
              <Link
                href="/legal/privacy"
                className="text-sm text-slate-400 hover:text-cyan-400 transition-colors font-medium"
              >
                Privacy Policy
              </Link>
              <Link
                href="/legal/terms"
                className="text-sm text-slate-400 hover:text-cyan-400 transition-colors font-medium"
              >
                Terms of Service
              </Link>
            </nav>
          </div>

          {/* Connect Column */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              Connect
            </h3>
            <p className="text-sm text-slate-400 mb-3">
              Join our community for insights and updates.
            </p>
            <Link
              href="/"
              className="inline-block px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 hover:border-cyan-400/60 text-cyan-400 hover:text-cyan-300 rounded font-medium text-sm transition-all"
            >
              Get Updates
            </Link>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-800/50 my-8 pt-8">
          {/* Bottom Footer */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-400">
            <p>
              &copy; {currentYear} Glad Labs. All rights reserved.
            </p>
            <p className="text-xs text-slate-500">
              Built for innovation, powered by AI.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border-width: 0;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
