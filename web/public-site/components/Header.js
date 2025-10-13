import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-gray-800">
              GLAD Labs
            </Link>
          </div>
          <nav className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link href="/" className="text-gray-600 hover:text-gray-800">
                Home
              </Link>
              <Link href="/about" className="text-gray-600 hover:text-gray-800">
                About
              </Link>
              <Link
                href="/archive/1"
                className="text-gray-600 hover:text-gray-800"
              >
                Archive
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
