import Head from 'next/head';
import Link from 'next/link';

/**
 * Terms of Service Page
 *
 * This page outlines the legal terms and conditions for using Glad Labs services.
 * It covers user responsibilities, limitations of liability, and service policies.
 *
 * Last Updated: October 20, 2025
 */
export default function TermsOfService() {
  const lastUpdated = '2025-10-20';

  return (
    <>
      <Head>
        <title>Terms of Service | Glad Labs</title>
        <meta name="description" content="Glad Labs Terms of Service" />
        <meta name="robots" content="index, follow" />
      </Head>

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-gray-600">Last Updated: {lastUpdated}</p>
        </div>

        {/* Introduction */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">1. Agreement to Terms</h2>
          <p className="text-gray-700 mb-4">
            These Terms of Service (&quot;Terms&quot;) constitute a legal
            agreement between you and Glad Labs, Inc. (&quot;Company,&quot;
            &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) governing your
            use of our website https://gladlabs.io and related services
            (collectively, the &quot;Services&quot;).
          </p>
          <p className="text-gray-700 mb-4">
            By accessing, browsing, or using the Services, you acknowledge that
            you have read, understood, and agree to be bound by these Terms. If
            you do not agree to these Terms, please do not use our Services.
          </p>
          <p className="text-gray-700">
            <strong>Important:</strong> If you are accessing the Services on
            behalf of a company or organization, you represent that you have
            authority to bind that entity to these Terms.
          </p>
        </section>

        {/* Use License */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">2. License & Limited Use</h2>
          <p className="text-gray-700 mb-4">
            Subject to your compliance with these Terms, we grant you a
            non-exclusive, non-transferable, revocable license to access and use
            the Services for your internal business purposes.
          </p>
          <p className="text-gray-700 mb-4">
            <strong>License Restrictions:</strong> You may not:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>
              Reproduce, duplicate, copy, or sell the Services or its content
            </li>
            <li>
              Reverse engineer, decompile, or attempt to discover source code
            </li>
            <li>Rent, lease, or lend the Services</li>
            <li>Remove or modify any proprietary notices or labels</li>
            <li>Use the Services to build competing products or services</li>
            <li>
              Access the Services for benchmarking or competitive analysis
            </li>
            <li>Circumvent security features or access controls</li>
          </ul>
        </section>

        {/* User Responsibilities */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">
            3. User Accounts & Responsibilities
          </h2>

          <h3 className="text-xl font-bold mb-3">3.1 Account Registration</h3>
          <p className="text-gray-700 mb-4">
            To use certain features of the Services, you must create an account.
            You agree to:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Provide accurate, current, and complete information</li>
            <li>Maintain confidentiality of your password</li>
            <li>Notify us immediately of unauthorized access</li>
            <li>Accept responsibility for all activities under your account</li>
          </ul>

          <h3 className="text-xl font-bold mb-3 mt-6">3.2 Acceptable Use</h3>
          <p className="text-gray-700 mb-4">
            You agree not to use the Services to:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Violate any applicable laws or regulations</li>
            <li>Infringe intellectual property rights</li>
            <li>Transmit malware, viruses, or harmful code</li>
            <li>Engage in harassment, abuse, or threats</li>
            <li>Spam or send unsolicited communications</li>
            <li>
              Access or use the Services on behalf of others without
              authorization
            </li>
            <li>Attempt to gain unauthorized access to the Services</li>
            <li>Overload or disrupt system resources</li>
          </ul>
        </section>

        {/* Intellectual Property */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">
            4. Intellectual Property Rights
          </h2>

          <h3 className="text-xl font-bold mb-3">
            4.1 Our Intellectual Property
          </h3>
          <p className="text-gray-700 mb-4">
            All content, features, and functionality of the Services (including
            but not limited to software, code, design, text, images, and
            graphics) are owned by Glad Labs, our licensors, or other providers
            of such material and are protected by copyright, trademark, and
            other intellectual property laws.
          </p>

          <h3 className="text-xl font-bold mb-3">4.2 Your Content</h3>
          <p className="text-gray-700 mb-4">
            You retain ownership of any content you create or upload to the
            Services (&quot;Your Content&quot;). By uploading Your Content, you
            grant us a worldwide, non-exclusive, royalty-free license to:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
            <li>Use, reproduce, and display Your Content</li>
            <li>Create derivatives for improving our Services</li>
            <li>
              Aggregate Your Content with other users&apos; data for analytics
            </li>
          </ul>
          <p className="text-gray-700">
            You represent that you own or have sufficient rights to grant us
            this license.
          </p>
        </section>

        {/* Limitations */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">
            5. Limitations of Liability & Disclaimers
          </h2>

          <h3 className="text-xl font-bold mb-3">
            5.1 Disclaimer of Warranties
          </h3>
          <p className="text-gray-700 mb-4">
            <strong>
              THE SERVICES ARE PROVIDED &quot;AS-IS&quot; WITHOUT WARRANTIES OF
              ANY KIND.
            </strong>{' '}
            We disclaim all warranties, express, implied, or statutory,
            including:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>
              Warranties of merchantability, fitness for a particular purpose
            </li>
            <li>Non-infringement of third-party rights</li>
            <li>Accuracy, completeness, or reliability of the Services</li>
            <li>Uninterrupted or error-free access to the Services</li>
          </ul>

          <h3 className="text-xl font-bold mb-3 mt-6">
            5.2 Limitation of Liability
          </h3>
          <p className="text-gray-700 mb-4">
            <strong>TO THE MAXIMUM EXTENT PERMITTED BY LAW:</strong>
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>
              We shall not be liable for indirect, incidental, special,
              consequential, or punitive damages
            </li>
            <li>
              Our total liability shall not exceed the amount you paid us in the
              12 months prior
            </li>
            <li>
              These limitations apply even if we&apos;ve been advised of
              potential damages
            </li>
          </ul>

          <h3 className="text-xl font-bold mb-3 mt-6">
            5.3 User Responsibility
          </h3>
          <p className="text-gray-700">
            You assume all risk and responsibility for your use of the Services.
            This includes decisions made based on information provided by the
            Services.
          </p>
        </section>

        {/* Indemnification */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">6. Indemnification</h2>
          <p className="text-gray-700">
            You agree to indemnify, defend, and hold harmless Glad Labs, its
            officers, directors, employees, and agents from any claims, damages,
            or costs arising from:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Your violation of these Terms</li>
            <li>Your misuse of the Services</li>
            <li>Your violation of applicable laws</li>
            <li>Third-party claims related to Your Content</li>
            <li>Your infringement of intellectual property rights</li>
          </ul>
        </section>

        {/* Payment Terms */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">7. Payment Terms</h2>

          <h3 className="text-xl font-bold mb-3">7.1 Fees & Billing</h3>
          <p className="text-gray-700 mb-4">
            If you purchase a paid subscription or service:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
            <li>
              Fees are exclusive of taxes (you&apos;re responsible for
              applicable taxes)
            </li>
            <li>
              Billing occurs on the day of your subscription and recurring
              thereafter
            </li>
            <li>Prices may change upon 30 days&apos; written notice</li>
            <li>No refunds are provided except as required by law</li>
          </ul>

          <h3 className="text-xl font-bold mb-3">7.2 Cancellation</h3>
          <p className="text-gray-700">
            You may cancel your subscription at any time. Cancellation takes
            effect at the end of your current billing period.
          </p>
        </section>

        {/* Termination */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">8. Termination</h2>

          <h3 className="text-xl font-bold mb-3">8.1 Termination by User</h3>
          <p className="text-gray-700 mb-4">
            You may terminate your account at any time by contacting us or
            through your account settings.
          </p>

          <h3 className="text-xl font-bold mb-3">8.2 Termination by Company</h3>
          <p className="text-gray-700 mb-4">
            We may terminate or suspend your account immediately if you:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Violate these Terms or our policies</li>
            <li>Engage in illegal or harmful activities</li>
            <li>Fail to pay fees owed</li>
            <li>Use the Services for unauthorized purposes</li>
          </ul>

          <h3 className="text-xl font-bold mb-3 mt-6">
            8.3 Effect of Termination
          </h3>
          <p className="text-gray-700">
            Upon termination, your right to use the Services ends immediately.
            We may retain your data for compliance and legal purposes as
            required by applicable laws.
          </p>
        </section>

        {/* Privacy */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">9. Privacy</h2>
          <p className="text-gray-700">
            Your use of the Services is also governed by our{' '}
            <Link href="/privacy" className="text-blue-600 hover:underline">
              Privacy Policy
            </Link>
            . Please review it to understand our data practices.
          </p>
        </section>

        {/* Modifications */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">
            10. Modifications to Terms & Services
          </h2>
          <p className="text-gray-700 mb-4">
            We reserve the right to modify these Terms at any time. Significant
            changes will be communicated via email or prominent notice on the
            Services. Your continued use constitutes acceptance of modified
            Terms.
          </p>
          <p className="text-gray-700">
            We may also modify, suspend, or discontinue the Services (or any
            features) with or without notice. We are not liable for
            modifications or discontinuation.
          </p>
        </section>

        {/* Governing Law */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">
            11. Governing Law & Jurisdiction
          </h2>
          <p className="text-gray-700 mb-4">
            These Terms are governed by the laws of California, without regard
            to conflicts of law principles. Any legal action or proceeding shall
            be exclusively brought in the state or federal courts located in San
            Francisco, California, and you consent to jurisdiction there.
          </p>
        </section>

        {/* Dispute Resolution */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">12. Dispute Resolution</h2>

          <h3 className="text-xl font-bold mb-3">12.1 Informal Resolution</h3>
          <p className="text-gray-700 mb-4">
            Before pursuing legal action, we encourage you to contact us at
            legal@gladlabs.io to attempt to resolve disputes informally.
          </p>

          <h3 className="text-xl font-bold mb-3">12.2 Arbitration</h3>
          <p className="text-gray-700">
            Any disputes arising out of or relating to these Terms or the
            Services shall be resolved through binding arbitration under the
            rules of the American Arbitration Association (AAA), except for
            disputes concerning intellectual property infringement.
          </p>
        </section>

        {/* Severability */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">13. Severability</h2>
          <p className="text-gray-700">
            If any provision of these Terms is found invalid or unenforceable,
            that provision shall be modified to the minimum extent necessary to
            be enforceable, and the remaining provisions shall remain in full
            effect.
          </p>
        </section>

        {/* Contact */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">14. Contact Information</h2>
          <p className="text-gray-700 mb-4">
            For questions about these Terms or our Services:
          </p>
          <div className="bg-gray-50 p-6 rounded-lg">
            <p className="mb-2">
              <strong>Email:</strong> legal@gladlabs.io
            </p>
            <p className="mb-2">
              <strong>Mail:</strong> Glad Labs, Inc., Legal Team
            </p>
            <p className="mb-2">
              123 Innovation Drive, San Francisco, CA 94105
            </p>
            <p>
              <strong>Response Time:</strong> We will respond within 10 business
              days
            </p>
          </div>
        </section>

        {/* Footer Navigation */}
        <div className="border-t pt-8 mt-12">
          <p className="text-gray-600 text-sm mb-4">Related Pages:</p>
          <div className="space-x-4">
            <Link href="/privacy" className="text-blue-600 hover:underline">
              Privacy Policy
            </Link>
            <Link href="/cookies" className="text-blue-600 hover:underline">
              Cookie Policy
            </Link>
            <Link href="/contact" className="text-blue-600 hover:underline">
              Contact Us
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}

export async function getStaticProps() {
  return {
    props: {},
    revalidate: 86400, // Revalidate daily
  };
}
