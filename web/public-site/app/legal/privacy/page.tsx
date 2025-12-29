import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - Glad Labs',
  description: 'Privacy Policy for Glad Labs Blog',
};

export default function PrivacyPolicy() {
  const lastUpdated = new Date('2025-12-19').toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="prose prose-invert max-w-none">
      <h1 className="text-4xl font-bold text-cyan-400 mb-4">Privacy Policy</h1>

      <p className="text-gray-400 mb-8">
        <strong>Last Updated:</strong> {lastUpdated}
      </p>

      <h2 className="text-2xl font-bold text-cyan-300 mt-8 mb-4">
        1. Introduction
      </h2>
      <p>
        Glad Labs ("we," "us," "our," or "Company") is committed to protecting
        your privacy. This Privacy Policy explains how we collect, use,
        disclose, and safeguard your information when you visit our website.
      </p>

      <h2 className="text-2xl font-bold text-cyan-300 mt-8 mb-4">
        2. Information We Collect
      </h2>
      <p>
        We may collect information about you in a variety of ways. The
        information we may collect on the site includes:
      </p>

      <h3 className="text-xl font-semibold text-cyan-200 mt-6 mb-3">
        2.1 Automatic Data Collection
      </h3>
      <ul className="list-disc list-inside space-y-2 mb-4">
        <li>
          <strong>Cookies & Tracking Technologies:</strong> We use cookies, web
          beacons, and similar technologies to track your activity on our
          website and store your preferences.
        </li>
        <li>
          <strong>Google Analytics:</strong> We use Google Analytics to
          understand how visitors interact with our website.
        </li>
        <li>
          <strong>Log Data:</strong> Our servers automatically log IP addresses,
          browser type, operating system, pages visited, and time spent on
          pages.
        </li>
      </ul>

      <h3 className="text-xl font-semibold text-cyan-200 mt-6 mb-3">
        2.2 Information from Third Parties
      </h3>
      <ul className="list-disc list-inside space-y-2 mb-4">
        <li>
          <strong>Google AdSense:</strong> We partner with Google AdSense to
          serve advertisements on our website. Google may use cookies to
          personalize ads based on your interests.
        </li>
        <li>
          <strong>Social Media:</strong> If you interact with our content on
          social platforms, those platforms may collect additional information.
        </li>
      </ul>

      <h2 className="text-2xl font-bold text-cyan-300 mt-8 mb-4">
        3. How We Use Your Information
      </h2>
      <p>We use the information we collect to:</p>
      <ul className="list-disc list-inside space-y-2 mb-4">
        <li>Personalize and improve your browsing experience</li>
        <li>Serve relevant advertisements through Google AdSense</li>
        <li>
          Analyze website traffic and user behavior (via Google Analytics)
        </li>
        <li>Ensure security and prevent fraudulent activity</li>
        <li>Comply with legal obligations</li>
      </ul>

      <h2 className="text-2xl font-bold text-cyan-300 mt-8 mb-4">
        4. Information Sharing & Disclosure
      </h2>
      <p>
        We do <strong>NOT</strong> sell, trade, or rent your personal
        information to third parties. However, we may share information with:
      </p>
      <ul className="list-disc list-inside space-y-2 mb-4">
        <li>
          <strong>Google Analytics & AdSense:</strong> Google receives data
          about your interactions on our website. Review Google's privacy policy
          for more details.
        </li>
        <li>
          <strong>Service Providers:</strong> We may share data with vendors who
          help us operate our website (hosting providers, analytics services).
        </li>
        <li>
          <strong>Legal Compliance:</strong> We may disclose information if
          required by law or when we believe in good faith that disclosure is
          necessary.
        </li>
      </ul>

      <h2 className="text-2xl font-bold text-cyan-300 mt-8 mb-4">
        5. Cookies & Tracking Technologies
      </h2>
      <p>
        Our website uses cookies to enhance your experience. Most browsers allow
        you to refuse cookies or alert you when cookies are being sent. However,
        blocking cookies may affect website functionality.
      </p>
      <p>
        <strong>Types of cookies we use:</strong>
      </p>
      <ul className="list-disc list-inside space-y-2 mb-4">
        <li>
          <strong>Essential Cookies:</strong> Required for website functionality
        </li>
        <li>
          <strong>Performance Cookies:</strong> Collect data on how visitors use
          our site
        </li>
        <li>
          <strong>Advertising Cookies:</strong> Used by Google AdSense to
          personalize ads
        </li>
      </ul>

      <h2 className="text-2xl font-bold text-cyan-300 mt-8 mb-4">
        6. Your Privacy Rights
      </h2>
      <p>Depending on your location, you may have the following rights:</p>
      <ul className="list-disc list-inside space-y-2 mb-4">
        <li>
          <strong>Right to Access:</strong> Request a copy of the data we hold
          about you
        </li>
        <li>
          <strong>Right to Deletion:</strong> Request that we delete your data
        </li>
        <li>
          <strong>Right to Opt-Out:</strong> Opt-out of certain data collection
          or marketing
        </li>
        <li>
          <strong>Right to Portability:</strong> Receive your data in a portable
          format
        </li>
      </ul>

      <h2 className="text-2xl font-bold text-cyan-300 mt-8 mb-4">
        7. Data Security
      </h2>
      <p>
        We implement appropriate technical and organizational measures to
        protect your information against unauthorized access, alteration,
        disclosure, or destruction. However, no method of transmission over the
        internet is 100% secure.
      </p>

      <h2 className="text-2xl font-bold text-cyan-300 mt-8 mb-4">
        8. Third-Party Links
      </h2>
      <p>
        Our website may contain links to third-party websites. We are not
        responsible for the privacy practices of external sites. Please review
        their privacy policies before providing any personal information.
      </p>

      <h2 className="text-2xl font-bold text-cyan-300 mt-8 mb-4">
        9. Children's Privacy
      </h2>
      <p>
        Our website is not directed toward children under 13. We do not
        knowingly collect personal information from children. If we become aware
        that we have collected information from a child under 13, we will
        promptly delete such information.
      </p>

      <h2 className="text-2xl font-bold text-cyan-300 mt-8 mb-4">
        10. Contact Us
      </h2>
      <p>
        If you have questions about this Privacy Policy or our privacy
        practices, please contact us at:
      </p>
      <div className="bg-gray-800 p-4 rounded-lg mt-4 mb-4">
        <p>
          <strong>Glad Labs, LLC</strong>
          <br />
          Email: hello@gladlabs.io
          <br />
          Website: https://yourdomain.com
        </p>
      </div>

      <h2 className="text-2xl font-bold text-cyan-300 mt-8 mb-4">
        11. Policy Updates
      </h2>
      <p>
        We may update this Privacy Policy from time to time. Changes will be
        posted on this page with an updated "Last Modified" date. Your continued
        use of our website following the posting of revised Privacy Policy means
        you accept and agree to the changes.
      </p>
    </div>
  );
}
