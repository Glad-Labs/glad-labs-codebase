import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie Policy - Glad Labs',
  description: 'Cookie Policy for Glad Labs Blog',
};

export default function CookiePolicy() {
  const lastUpdated = new Date('2025-12-19').toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="prose prose-invert max-w-none">
      <h1 className="text-4xl font-bold text-cyan-400 mb-4">Cookie Policy</h1>

      <p className="text-gray-400 mb-8">
        <strong>Last Updated:</strong> {lastUpdated}
      </p>

      <h2 className="text-2xl font-bold text-cyan-300 mt-8 mb-4">
        1. What Are Cookies?
      </h2>
      <p>
        Cookies are small text files that are placed on your computer or mobile
        device when you visit a website. They are widely used to make websites
        work, or work more efficiently, and to provide information to the
        website owners.
      </p>

      <h2 className="text-2xl font-bold text-cyan-300 mt-8 mb-4">
        2. How We Use Cookies
      </h2>
      <p>
        Glad Labs uses cookies to enhance your browsing experience and for
        analytics purposes:
      </p>

      <h3 className="text-xl font-semibold text-cyan-200 mt-6 mb-3">
        2.1 Essential Cookies
      </h3>
      <p>
        These cookies are necessary for the website to function properly. They
        enable core functionality such as security, network management, and
        accessibility features. The website cannot function properly without
        these cookies.
      </p>

      <h3 className="text-xl font-semibold text-cyan-200 mt-6 mb-3">
        2.2 Performance Cookies
      </h3>
      <p>
        These cookies collect information about how you interact with our
        website, including which pages you visit, how long you spend on pages,
        and any errors encountered. We use this information to improve website
        performance.
      </p>

      <h3 className="text-xl font-semibold text-cyan-200 mt-6 mb-3">
        2.3 Analytical Cookies
      </h3>
      <p>
        We use Google Analytics to understand how visitors use our website.
        Google places cookies on your browser to collect usage data. This helps
        us understand user behavior and improve our content.
      </p>

      <h3 className="text-xl font-semibold text-cyan-200 mt-6 mb-3">
        2.4 Advertising Cookies
      </h3>
      <p>
        Google AdSense uses cookies to serve advertisements that are relevant to
        your interests. These cookies allow Google to track your interests
        across websites and deliver personalized ads.
      </p>

      <h2 className="text-2xl font-bold text-cyan-300 mt-8 mb-4">
        3. Cookie Names and Purposes
      </h2>
      <div className="overflow-x-auto my-4">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-600">
              <th className="px-3 py-2">Cookie Name</th>
              <th className="px-3 py-2">Provider</th>
              <th className="px-3 py-2">Purpose</th>
              <th className="px-3 py-2">Duration</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-700">
              <td className="px-3 py-2">_ga</td>
              <td className="px-3 py-2">Google Analytics</td>
              <td className="px-3 py-2">Tracks user interactions</td>
              <td className="px-3 py-2">2 years</td>
            </tr>
            <tr className="border-b border-gray-700">
              <td className="px-3 py-2">_gid</td>
              <td className="px-3 py-2">Google Analytics</td>
              <td className="px-3 py-2">Stores user ID</td>
              <td className="px-3 py-2">24 hours</td>
            </tr>
            <tr className="border-b border-gray-700">
              <td className="px-3 py-2">NID</td>
              <td className="px-3 py-2">Google AdSense</td>
              <td className="px-3 py-2">Ad personalization</td>
              <td className="px-3 py-2">6 months</td>
            </tr>
            <tr>
              <td className="px-3 py-2">ANID</td>
              <td className="px-3 py-2">Google AdSense</td>
              <td className="px-3 py-2">Ad preferences</td>
              <td className="px-3 py-2">1 year</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl font-bold text-cyan-300 mt-8 mb-4">
        4. Third-Party Cookies
      </h2>
      <p>
        Third-party cookies are placed by services other than Glad Labs,
        including:
      </p>
      <ul className="list-disc list-inside space-y-2 mb-4">
        <li>
          <strong>Google Analytics:</strong> Analyzes website traffic
        </li>
        <li>
          <strong>Google AdSense:</strong> Serves and personalizes
          advertisements
        </li>
        <li>
          <strong>Social Media Platforms:</strong> If embedded content is
          present
        </li>
      </ul>

      <h2 className="text-2xl font-bold text-cyan-300 mt-8 mb-4">
        5. Your Cookie Preferences
      </h2>
      <p>
        Most web browsers allow you to control cookies through their settings.
        You can:
      </p>
      <ul className="list-disc list-inside space-y-2 mb-4">
        <li>Delete existing cookies</li>
        <li>Block all cookies</li>
        <li>Allow only certain cookies</li>
        <li>Be notified when a cookie is being set</li>
      </ul>
      <p className="mt-4 text-gray-300">
        <strong>Note:</strong> Blocking cookies may affect website
        functionality. Essential cookies cannot be disabled as they are required
        for the website to operate.
      </p>

      <h2 className="text-2xl font-bold text-cyan-300 mt-8 mb-4">
        6. Cookie Consent
      </h2>
      <p>
        By continuing to use this website, you consent to our use of cookies as
        described in this policy. If you do not consent to our cookie usage,
        please disable cookies in your browser settings or discontinue use of
        the website.
      </p>

      <h2 className="text-2xl font-bold text-cyan-300 mt-8 mb-4">
        7. GDPR & CCPA Compliance
      </h2>
      <p>
        If you are located in the EU, you have rights under the General Data
        Protection Regulation (GDPR). If you are in California, you have rights
        under the California Consumer Privacy Act (CCPA). We comply with these
        regulations and allow you to:
      </p>
      <ul className="list-disc list-inside space-y-2 mb-4">
        <li>Access your data</li>
        <li>Delete your data</li>
        <li>Opt-out of data collection</li>
        <li>Portability of your data</li>
      </ul>

      <h2 className="text-2xl font-bold text-cyan-300 mt-8 mb-4">
        8. External Links
      </h2>
      <p>
        This website may contain links to external websites. We are not
        responsible for the cookie practices of external sites. Please review
        their cookie policies before interacting with their content.
      </p>

      <h2 className="text-2xl font-bold text-cyan-300 mt-8 mb-4">
        9. Updates to This Policy
      </h2>
      <p>
        We may update this Cookie Policy from time to time. Changes will be
        posted on this page with an updated "Last Modified" date. Your continued
        use of the website constitutes your acceptance of the updated policy.
      </p>

      <h2 className="text-2xl font-bold text-cyan-300 mt-8 mb-4">
        10. Contact Us
      </h2>
      <p>
        If you have questions about our Cookie Policy, please contact us at:
      </p>
      <div className="bg-gray-800 p-4 rounded-lg mt-4 mb-4">
        <p>
          <strong>Glad Labs, LLC</strong>
          <br />
          Email: hello@gladlabs.io
          <br />
          Website: https://gladlabs.io
        </p>
      </div>
    </div>
  );
}
