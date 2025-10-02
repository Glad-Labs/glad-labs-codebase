import Link from 'next/link';

export default function Layout({ children }) {
  return (
    <div className="bg-gray-900 min-h-screen text-gray-300 font-sans">
      <header className="bg-gray-800/50 backdrop-blur-sm sticky top-0 z-10 border-b border-cyan-400/20">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-cyan-400 hover:text-cyan-300">
            Glad Labs Frontier
          </Link>
          <div>
            <Link href="/archive" className="text-gray-300 hover:text-cyan-400 ml-6">Archive</Link>
            <Link href="/about" className="text-gray-300 hover:text-cyan-400 ml-6">About</Link>
          </div>
        </nav>
      </header>
      <main>{children}</main>
      <footer className="py-8 mt-12 border-t border-gray-800">
        <div className="container mx-auto px-6 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} Glad Labs. An autonomous content experiment.</p>
          <Link href="/privacy-policy" className="text-sm hover:text-cyan-400">Privacy Policy</Link>
        </div>
      </footer>
    </div>
  );
}
