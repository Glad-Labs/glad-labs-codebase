import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-white border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-gray-600">
        <p className="mb-2">
          &copy; {new Date().getFullYear()} GLAD Labs, LLC. All rights reserved.
        </p>
        <p>
          <Link
            href="/privacy-policy"
            className="text-cyan-600 hover:text-cyan-500"
          >
            Privacy Policy
          </Link>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
