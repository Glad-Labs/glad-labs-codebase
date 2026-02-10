import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie Policy - Glad Labs',
  description: 'Cookie Policy for Glad Labs',
};

export default function CookiePolicy() {
  const lastUpdated = new Date('2026-02-10').toLocaleDateString('en-US', {
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
        2.2 Performance & Optimization Cookies
      </h3>
      <p>
        These cookies collect information about how you interact with our
        website, including which pages you visit, how long you spend on pages,
        and any errors encountered. We use this information to improve website
        performance and optimize user experience. These cookies are placed under
        our <strong>legitimate interest</strong> (Article 6(1)(f) GDPR) in
        providing a better service and do not require explicit consent.
      </p>

      <h3 className="text-xl font-semibold text-cyan-200 mt-6 mb-3">
        2.3 Analytical Cookies
      </h3>
      <p>
        We use Google Analytics 4 (GA4) via Google Tag Manager to understand how
        visitors use our website. GA4 places cookies on your browser to collect
        usage data including pages visited, time spent, and user interactions.
        This helps us understand user behavior and improve our content and user
        experience.
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
              <td className="px-3 py-2">Google Analytics 4</td>
              <td className="px-3 py-2">Stores a unique user identifier</td>
              <td className="px-3 py-2">2 years</td>
            </tr>
            <tr className="border-b border-gray-700">
              <td className="px-3 py-2">_ga_*</td>
              <td className="px-3 py-2">Google Analytics 4</td>
              <td className="px-3 py-2">
                Groups analytics events by measurement ID
              </td>
              <td className="px-3 py-2">2 years</td>
            </tr>
            <tr className="border-b border-gray-700">
              <td className="px-3 py-2">_gat_gtag_*</td>
              <td className="px-3 py-2">Google Analytics 4</td>
              <td className="px-3 py-2">Throttles request rate</td>
              <td className="px-3 py-2">1 minute</td>
            </tr>
            <tr>
              <td className="px-3 py-2">Advertising IDs</td>
              <td className="px-3 py-2">Google AdSense</td>
              <td className="px-3 py-2">Ad personalization and ad serving</td>
              <td className="px-3 py-2">Varies</td>
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
        We provide a cookie consent banner when you first visit our website. By
        interacting with the banner, you can:
      </p>
      <ul className="list-disc list-inside space-y-2 mb-4">
        <li>
          <strong>Accept All:</strong> Consent to all cookies (essential,
          analytics, and advertising)
        </li>
        <li>
          <strong>Reject All:</strong> Only essential cookies are enabled; you
          opt-out of analytics and advertising
        </li>
        <li>
          <strong>Customize:</strong> Choose which types of cookies to accept
        </li>
      </ul>
      <p className="mt-4 text-gray-300">
        <strong>Important:</strong> Essential cookies are always enabled as they
        are required for the website to function. Your consent choices are saved
        in your browser's local storage and remain valid for one year.
      </p>

      <h2 className="text-2xl font-bold text-cyan-300 mt-8 mb-4">
        7. Your Rights Under GDPR & CCPA
      </h2>
      <p>
        <strong>For EU Residents (GDPR):</strong> You have the following rights:
      </p>
      <ul className="list-disc list-inside space-y-2 mb-4">
        <li>
          <strong>Right to be informed:</strong> See this policy for how we use
          cookies
        </li>
        <li>
          <strong>Right to withdraw consent:</strong> You can change your cookie
          preferences at any time without penalty
        </li>
        <li>
          <strong>Right of access:</strong> Request a copy of the personal data
          we hold about you
        </li>
        <li>
          <strong>Right to erasure:</strong> Request deletion of your data (with
          exceptions for legal obligations)
        </li>
        <li>
          <strong>Right to restrict processing:</strong> Ask us to limit how we
          use your data
        </li>
        <li>
          <strong>Right to rectification:</strong> Correct inaccurate personal
          data
        </li>
        <li>
          <strong>Right to data portability:</strong> Receive your data in a
          machine-readable format
        </li>
        <li>
          <strong>Right to object:</strong> Object to specific processing based
          on legitimate interest
        </li>
        <li>
          <strong>Right to lodge a complaint:</strong> Contact your supervisory
          authority (Data Protection Authority) if you believe your rights are
          violated
        </li>
      </ul>

      <p className="mt-4">
        <strong>For California Residents (CCPA):</strong> You have the right to
        know, delete, and opt-out of the sale of your personal information.
      </p>

      <h2 className="text-2xl font-bold text-cyan-300 mt-8 mb-4">
        8. Data Processors & Third Parties
      </h2>
      <p>
        When you use our website, your data may be shared with the following
        third parties who act as data processors:
      </p>
      <ul className="list-disc list-inside space-y-2 mb-4">
        <li>
          <strong>Google LLC</strong> (Analytics 4 & AdSense) - Processes data
          in the United States under Standard Contractual Clauses
        </li>
        <li>
          <strong>Vercel, Inc.</strong> (Hosting) - Hosts our website and may
          process IP addresses for analytics and security
        </li>
        <li>
          <strong>Social Media Platforms</strong> - If you interact with
          embedded content from social networks
        </li>
      </ul>

      <h2 className="text-2xl font-bold text-cyan-300 mt-8 mb-4">
        9. International Data Transfers
      </h2>
      <p>
        Our service providers process data in the United States. We ensure
        adequate protection through Standard Contractual Clauses (SCCs) and
        other legal mechanisms approved by the EU adequate decision or UK
        adequacy decision, as applicable.
      </p>

      <h2 className="text-2xl font-bold text-cyan-300 mt-8 mb-4">
        10. Withdrawing Consent
      </h2>
      <p>You can withdraw your consent to cookies at any time by:</p>
      <ul className="list-disc list-inside space-y-2 mb-4">
        <li>
          Clicking the cookie consent banner at the bottom of the page and
          adjusting your preferences
        </li>
        <li>Clearing cookies from your browser settings</li>
        <li>Contacting us directly at privacy@gladlabs.ai</li>
      </ul>
      <p className="mt-4 text-gray-300">
        <strong>Note:</strong> Withdrawing consent will not affect the
        lawfulness of processing before consent was withdrawn.
      </p>

      <h2 className="text-2xl font-bold text-cyan-300 mt-8 mb-4">
        11. Legal Basis for Processing
      </h2>
      <p>Under GDPR, we process data based on the following legal bases:</p>
      <ul className="list-disc list-inside space-y-2 mb-4">
        <li>
          <strong>Consent (Article 6(1)(a)):</strong> Analytics and advertising
          cookies
        </li>
        <li>
          <strong>Contract Performance (Article 6(1)(b)):</strong> Session
          cookies for website functionality
        </li>
        <li>
          <strong>Legal Obligation (Article 6(1)(c)):</strong> Security and
          fraud prevention
        </li>
        <li>
          <strong>Legitimate Interest (Article 6(1)(f)):</strong> Website
          optimization and user experience
        </li>
      </ul>

      <h2 className="text-2xl font-bold text-cyan-300 mt-8 mb-4">
        12. Performance & Optimization Cookies (Legitimate Interest)
      </h2>
      <p>
        Some performance cookies may be enabled under our legitimate interest in
        optimizing website performance and user experience, even without
        explicit consent. These are limited to technical data (page load times,
        error tracking) and do not identify you personally.
      </p>

      <h2 className="text-2xl font-bold text-cyan-300 mt-8 mb-4">
        13. External Links
      </h2>
      <p>
        This website may contain links to external websites. We are not
        responsible for the cookie practices of external sites. Please review
        their cookie policies before interacting with their content.
      </p>

      <h2 className="text-2xl font-bold text-cyan-300 mt-8 mb-4">
        14. Updates to This Policy
      </h2>
      <p>
        We may update this Cookie Policy from time to time. Changes will be
        posted on this page with an updated "Last Modified" date. Your continued
        use of the website constitutes your acceptance of the updated policy.
      </p>

      <h2 className="text-2xl font-bold text-cyan-300 mt-8 mb-4">
        15. Data Protection Officer & Contact
      </h2>
      <p>
        If you have questions about our Cookie Policy or wish to exercise your
        rights, please contact us at:
      </p>
      <div className="bg-gray-800 p-4 rounded-lg mt-4 mb-4">
        <p>
          <strong>Glad Labs, LLC</strong>
          <br />
          Email: privacy@gladlabs.ai
          <br />
          Website: https://gladlabs.io
          <br />
          <br />
          <strong>EU Data Representative (Article 27 GDPR):</strong>
          <br />
          For GDPR inquiries, submit a data subject request via our{' '}
          <a
            href="/legal/data-requests"
            className="text-cyan-400 hover:text-cyan-300"
          >
            Data Request Portal
          </a>
        </p>
      </div>

      <p className="mt-4 text-gray-300 text-sm">
        <strong>Supervisory Authority:</strong> If you believe your rights have
        been violated, you have the right to lodge a complaint with your local
        Data Protection Authority without filing a complaint with us first.
      </p>
    </div>
  );
}
