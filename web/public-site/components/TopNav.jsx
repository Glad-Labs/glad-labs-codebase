import Link from 'next/link';

export function TopNavigation() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 border-b border-slate-800/50 backdrop-blur-xl">
      <nav className="container mx-auto px-4 md:px-6 py-4 md:py-5 flex items-center justify-between">
        <Link
          href="/"
          className="group flex items-center space-x-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-lg px-2 py-1 transition-all"
        >
          <div className="text-2xl md:text-3xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 bg-clip-text text-transparent group-hover:opacity-80 transition-all duration-300">
            GL
          </div>
          <span className="hidden sm:inline text-sm font-semibold text-slate-300 group-hover:text-cyan-300 transition-colors duration-300">
            Glad Labs
          </span>
        </Link>

        <div className="hidden md:flex items-center space-x-12">
          <Link
            href="/archive/1"
            className="relative text-slate-300 hover:text-cyan-300 font-medium transition-colors duration-300 group"
          >
            <span className="relative z-10">Articles</span>
            <span className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-lg scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
          </Link>
          <Link
            href="/about"
            className="relative text-slate-300 hover:text-cyan-300 font-medium transition-colors duration-300 group"
          >
            <span className="relative z-10">About</span>
            <span className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-lg scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
          </Link>
        </div>

        <Link
          href="/archive/1"
          className="relative group px-6 py-2.5 font-semibold rounded-xl transition-all duration-300 overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-cyan-500/50" />
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 blur-md" />
          <span className="relative text-white flex items-center gap-2">
            <span className="hidden sm:inline">Explore</span>
            <span className="sm:hidden">Read</span>
            <span className="group-hover:translate-x-1 transition-transform duration-300">
              →
            </span>
          </span>
        </Link>
      </nav>
    </header>
  );
}

