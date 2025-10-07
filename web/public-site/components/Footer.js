const Footer = () => {
  return (
    <footer className="bg-white border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-gray-600">
        <p>
          &copy; {new Date().getFullYear()} GLAD Labs, LLC. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
