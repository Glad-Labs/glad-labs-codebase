import Link from 'next/link';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="bg-white border-t border-gray-200 mt-auto"
      role="contentinfo"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-6">
          {/* Logo/Branding */}
          <div className="flex-1">
            <Link
              href="/"
              className="text-lg font-bold text-cyan-600 hover:text-cyan-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:rounded"
              aria-label="Glad Labs Frontier - Home"
            >
              Glad Labs Frontier
            </Link>
            <p className="text-sm text-gray-600 mt-2">
              An autonomous content experiment powered by AI.
            </p>
          </div>

          {/* Footer Navigation */}
          <nav
            aria-label="Footer navigation"
            className="flex flex-wrap gap-6 justify-center"
          >
            <Link
              href="/archive/1"
              className="text-sm text-gray-600 hover:text-cyan-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:rounded transition-all"
            >
              Archive
            </Link>
            <Link
              href="/about"
              className="text-sm text-gray-600 hover:text-cyan-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:rounded transition-all"
            >
              About
            </Link>
            <Link
              href="/privacy-policy"
              className="text-sm text-gray-600 hover:text-cyan-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:rounded transition-all"
              aria-label="Privacy Policy"
            >
              Privacy Policy
            </Link>
            <a
              href="#main-content"
              className="text-sm text-gray-600 hover:text-cyan-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:rounded transition-all"
              aria-label="Back to top of page"
            >
              Back to Top
            </a>
          </nav>
        </div>

        {/* Divider */}
        <hr className="border-gray-200 my-6" />

        {/* Bottom Footer */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            &copy; {currentYear} Glad Labs, LLC. All rights reserved.
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Built with accessibility and performance in mind.
          </p>
        </div>

        {/* Accessibility Notice - Screen Reader Only */}
        <div className="sr-only">
          <p>
            This website is fully accessible. If you encounter any accessibility
            issues, please contact us.
          </p>
        </div>
      </div>

      {/* Screen Reader Only Styles */}
      <style jsx>{`
        .sr-only {
          position: absolute;
          width: 1px;
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
