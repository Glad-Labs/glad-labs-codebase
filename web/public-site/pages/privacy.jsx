import Head from 'next/head';
import Link from 'next/link';

/**
 * Privacy Policy Page
 * 
 * This page outlines how GLAD Labs collects, uses, and protects user data.
 * It covers GDPR, CCPA, and other privacy regulations.
 * 
 * Last Updated: October 20, 2025
 */
export default function PrivacyPolicy() {
  const lastUpdated = '2025-10-20';

  return (
    <>
      <Head>
        <title>Privacy Policy | GLAD Labs</title>
        <meta name="description" content="GLAD Labs Privacy Policy - Learn how we protect your data" />
        <meta name="robots" content="index, follow" />
      </Head>

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-gray-600">
            Last Updated: {lastUpdated}
          </p>
        </div>

        {/* Introduction */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
          <p className="text-gray-700 mb-4">
            GLAD Labs, Inc. ("we," "us," "our," or "Company") is committed to protecting your privacy. 
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
            when you visit our website https://gladlabs.io and use our services.
          </p>
          <p className="text-gray-700">
            Please read this privacy policy carefully. If you do not agree with our policies and practices, 
            please do not use our services.
          </p>
        </section>

        {/* Information Collection */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">2. Information We Collect</h2>
          
          <h3 className="text-xl font-bold mb-3">2.1 Information You Provide Directly</h3>
          <p className="text-gray-700 mb-4">
            We collect information you provide directly to us, including:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
            <li><strong>Account Information:</strong> Name, email address, password, company name, industry</li>
            <li><strong>Profile Information:</strong> Job title, company size, location, preferences</li>
            <li><strong>Communication Data:</strong> Messages, inquiries, support requests</li>
            <li><strong>Payment Information:</strong> Billing address, payment method (processed by third parties)</li>
            <li><strong>Content You Create:</strong> Notes, comments, custom reports</li>
          </ul>

          <h3 className="text-xl font-bold mb-3">2.2 Information Collected Automatically</h3>
          <p className="text-gray-700 mb-4">
            We automatically collect certain information about your device and how you interact with our services:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li><strong>Device Information:</strong> IP address, browser type, operating system, device identifiers</li>
            <li><strong>Usage Information:</strong> Pages visited, features used, time spent on site</li>
            <li><strong>Cookies and Tracking:</strong> Cookies, web beacons, pixel tags</li>
            <li><strong>Location Information:</strong> General location based on IP address</li>
          </ul>
        </section>

        {/* How We Use Information */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">3. How We Use Your Information</h2>
          <p className="text-gray-700 mb-4">
            We use the information we collect for various purposes:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Providing, maintaining, and improving our services</li>
            <li>Processing your account registration and transactions</li>
            <li>Sending you transactional emails (confirmations, updates)</li>
            <li>Responding to your inquiries and providing customer support</li>
            <li>Sending marketing communications (with your consent)</li>
            <li>Personalizing your experience</li>
            <li>Analytics and understanding how our services are used</li>
            <li>Detecting and preventing fraudulent activities</li>
            <li>Complying with legal obligations</li>
            <li>Enforcing our Terms of Service and other agreements</li>
          </ul>
        </section>

        {/* Data Protection */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">4. Data Protection & Security</h2>
          <p className="text-gray-700 mb-4">
            We implement appropriate technical and organizational measures to protect your personal data:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>SSL/TLS encryption for data transmission</li>
            <li>Secure server architecture and firewalls</li>
            <li>Regular security audits and penetration testing</li>
            <li>Limited access to personal data (need-to-know basis)</li>
            <li>Employee confidentiality agreements</li>
            <li>Incident response procedures</li>
          </ul>
          <p className="text-gray-700 mt-4">
            <strong>Note:</strong> While we implement strong security measures, no method of transmission 
            over the Internet is 100% secure. We cannot guarantee absolute security.
          </p>
        </section>

        {/* Data Sharing */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">5. Data Sharing & Third Parties</h2>
          
          <h3 className="text-xl font-bold mb-3">5.1 Third-Party Service Providers</h3>
          <p className="text-gray-700 mb-4">
            We share data with trusted service providers who assist us in operating our services:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
            <li><strong>Hosting Providers:</strong> Vercel, Railway, AWS</li>
            <li><strong>Payment Processors:</strong> Stripe, PayPal</li>
            <li><strong>Analytics:</strong> Google Analytics, Vercel Analytics</li>
            <li><strong>Email Services:</strong> SendGrid, Mailchimp</li>
            <li><strong>Support Software:</strong> Customer support platforms</li>
          </ul>

          <h3 className="text-xl font-bold mb-3">5.2 Legal Requirements</h3>
          <p className="text-gray-700 mb-4">
            We may disclose your information when required by law or when we believe in good faith that 
            disclosure is necessary to:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Comply with applicable laws or regulations</li>
            <li>Respond to legal process or government requests</li>
            <li>Protect our rights and the rights of others</li>
            <li>Prevent or investigate possible wrongdoing</li>
          </ul>
        </section>

        {/* User Rights */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">6. Your Privacy Rights</h2>
          
          <h3 className="text-xl font-bold mb-3">6.1 GDPR Rights (EU Users)</h3>
          <p className="text-gray-700 mb-4">
            If you are located in the EU, you have the following rights:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li><strong>Right to Access:</strong> Request a copy of your personal data</li>
            <li><strong>Right to Correction:</strong> Request corrections to inaccurate data</li>
            <li><strong>Right to Erasure:</strong> Request deletion of your data ("Right to be Forgotten")</li>
            <li><strong>Right to Restrict Processing:</strong> Limit how we use your data</li>
            <li><strong>Right to Data Portability:</strong> Receive your data in portable format</li>
            <li><strong>Right to Object:</strong> Object to certain processing activities</li>
            <li><strong>Right to Lodge Complaint:</strong> File a complaint with your data protection authority</li>
          </ul>

          <h3 className="text-xl font-bold mb-3 mt-6">6.2 CCPA Rights (California Users)</h3>
          <p className="text-gray-700 mb-4">
            If you are a California resident, you have the following rights:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li><strong>Right to Know:</strong> Request what personal data we collect</li>
            <li><strong>Right to Delete:</strong> Request deletion of your personal data</li>
            <li><strong>Right to Opt-Out:</strong> Opt out of the sale of your data</li>
            <li><strong>Right to Non-Discrimination:</strong> No discrimination for exercising CCPA rights</li>
          </ul>

          <h3 className="text-xl font-bold mb-3 mt-6">6.3 How to Exercise Your Rights</h3>
          <p className="text-gray-700">
            To exercise any of these rights, please contact us at privacy@gladlabs.io with:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Your name and email address</li>
            <li>Clear description of your request</li>
            <li>Your location (to apply relevant laws)</li>
          </ul>
          <p className="text-gray-700 mt-4">
            We will respond to your request within the timeframe required by applicable law (typically 30-45 days).
          </p>
        </section>

        {/* Cookies */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">7. Cookies & Tracking Technologies</h2>
          <p className="text-gray-700 mb-4">
            We use cookies and similar tracking technologies to:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
            <li>Remember your preferences and settings</li>
            <li>Track your usage for analytics</li>
            <li>Personalize your experience</li>
            <li>Manage sessions</li>
            <li>Prevent fraud</li>
          </ul>

          <h3 className="text-xl font-bold mb-3">7.1 Cookie Types</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li><strong>Essential Cookies:</strong> Required for site functionality</li>
            <li><strong>Performance Cookies:</strong> Analytics and usage tracking</li>
            <li><strong>Functional Cookies:</strong> Remember your preferences</li>
            <li><strong>Marketing Cookies:</strong> Track for advertising purposes</li>
          </ul>

          <h3 className="text-xl font-bold mb-3 mt-6">7.2 Managing Cookies</h3>
          <p className="text-gray-700">
            You can control cookies through your browser settings. Disabling cookies may affect functionality. 
            You can opt out of analytics cookies without affecting site usage.
          </p>
        </section>

        {/* Data Retention */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">8. Data Retention</h2>
          <p className="text-gray-700">
            We retain your personal data for as long as necessary to:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
            <li>Provide our services</li>
            <li>Comply with legal obligations</li>
            <li>Resolve disputes</li>
            <li>Enforce our agreements</li>
          </ul>
          <p className="text-gray-700">
            When your account is deleted, we retain anonymized data for analytics and legal compliance 
            as required by law (typically 3-7 years).
          </p>
        </section>

        {/* Third-Party Links */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">9. Third-Party Links & Services</h2>
          <p className="text-gray-700">
            Our website may contain links to third-party websites and services. We are not responsible for 
            their privacy practices. Please review their privacy policies before providing any personal information.
          </p>
        </section>

        {/* Contact */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">10. Contact Information</h2>
          <p className="text-gray-700 mb-4">
            If you have questions about this Privacy Policy or our data practices:
          </p>
          <div className="bg-gray-50 p-6 rounded-lg">
            <p className="mb-2"><strong>Email:</strong> privacy@gladlabs.io</p>
            <p className="mb-2"><strong>Mail:</strong> GLAD Labs, Inc., Privacy Team</p>
            <p className="mb-2">123 Innovation Drive, San Francisco, CA 94105</p>
            <p><strong>Response Time:</strong> We will respond within 10 business days</p>
          </div>
        </section>

        {/* Changes to Policy */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">11. Changes to This Privacy Policy</h2>
          <p className="text-gray-700">
            We may update this privacy policy from time to time. We will notify you of significant changes 
            by updating the "Last Updated" date or sending you an email notification. Your continued use of 
            our services constitutes your acceptance of the updated Privacy Policy.
          </p>
        </section>

        {/* Footer Navigation */}
        <div className="border-t pt-8 mt-12">
          <p className="text-gray-600 text-sm mb-4">
            Related Pages:
          </p>
          <div className="space-x-4">
            <Link href="/terms" className="text-blue-600 hover:underline">Terms of Service</Link>
            <Link href="/cookies" className="text-blue-600 hover:underline">Cookie Policy</Link>
            <Link href="/contact" className="text-blue-600 hover:underline">Contact Us</Link>
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
