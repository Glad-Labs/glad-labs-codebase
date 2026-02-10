import Link from 'next/link';

export default function TopNavigation() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 border-b border-slate-800/50 backdrop-blur-xl">
      <nav className="container mx-auto px-4 md:px-6 py-4 md:py-5 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-cyan-400">
          GL
        </Link>
        <div className="flex gap-8">
          <Link href="/archive/1" className="text-slate-300 hover:text-cyan-300">
            Articles
          </Link>
          <Link href="/about" className="text-slate-300 hover:text-cyan-300">
            About
          </Link>
        </div>
        <Link href="/archive/1" className="px-6 py-2.5 bg-cyan-600 text-white rounded-lg">
          Explore
        </Link>
      </nav>
    </header>
  );
}