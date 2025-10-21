import Head from 'next/head';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { getStrapiURL } from '../lib/api';

/**
 * Privacy Policy Page - Combined Layout + Strapi Integration
 *
 * Comprehensive privacy policy covering GDPR, CCPA, and data protection.
 * Fetches content from Strapi with beautiful fallback markdown.
 */
export default function PrivacyPolicy({ policy }) {
  const title = policy?.title || 'Privacy Policy';
  const content = policy?.content || '';
  const seo = policy?.seo || {};
  const metaTitle = seo.metaTitle || 'Privacy Policy | GLAD Labs';
  const metaDescription =
    seo.metaDescription ||
    'Learn how GLAD Labs protects your data and complies with privacy regulations.';
  const lastUpdated = '2025-10-20';

  // Fallback content if no data from Strapi
  const fallbackContent = `
## Privacy Policy

**Last Updated:** ${lastUpdated}

### 1. Introduction

GLAD Labs, Inc. ("we," "us," "our," or "Company") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website https://gladlabs.io and use our services.

Please read this privacy policy carefully. If you do not agree with our policies and practices, please do not use our services.

### 2. Information We Collect

#### 2.1 Information You Provide Directly

We collect information you provide directly to us, including:

- **Account Information:** Name, email address, password, company name, industry
- **Profile Information:** Job title, company size, location, preferences
- **Communication Data:** Messages, inquiries, support requests
- **Payment Information:** Billing address, payment method (processed by third parties)
- **Content You Create:** Notes, comments, custom reports

#### 2.2 Information Collected Automatically

We automatically collect certain information about your device and how you interact with our services:

- **Device Information:** IP address, browser type, operating system, device identifiers
- **Usage Information:** Pages visited, features used, time spent on site
- **Cookies and Tracking:** Cookies, web beacons, pixel tags
- **Location Information:** General location based on IP address

### 3. How We Use Your Information

We use the information we collect for various purposes:

- Providing, maintaining, and improving our services
- Processing your account registration and transactions
- Sending you transactional emails (confirmations, updates)
- Responding to your inquiries and providing customer support
- Sending marketing communications (with your consent)
- Personalizing your experience
- Analytics and understanding how our services are used
- Detecting and preventing fraudulent activities
- Complying with legal obligations
- Enforcing our Terms of Service and other agreements

### 4. Data Protection & Security

We implement appropriate technical and organizational measures to protect your personal data:

- SSL/TLS encryption for data transmission
- Secure server architecture and firewalls
- Regular security audits and penetration testing
- Limited access to personal data (need-to-know basis)
- Employee confidentiality agreements
- Incident response procedures

**Note:** While we implement strong security measures, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute security.

### 5. Data Sharing & Third Parties

#### 5.1 Third-Party Service Providers

We share data with trusted service providers who assist us in operating our services:

- **Hosting Providers:** Vercel, Railway, AWS
- **Payment Processors:** Stripe, PayPal
- **Analytics:** Google Analytics, Vercel Analytics
- **Email Services:** SendGrid, Mailchimp
- **Support Software:** Customer support platforms

#### 5.2 Legal Requirements

We may disclose your information when required by law or when we believe in good faith that disclosure is necessary to:

- Comply with applicable laws or regulations
- Respond to legal process or government requests
- Protect our rights and the rights of others
- Prevent or investigate possible wrongdoing

### 6. Your Privacy Rights

#### 6.1 GDPR Rights (EU Users)

If you are located in the EU, you have the following rights:

- **Right to Access:** Request a copy of your personal data
- **Right to Correction:** Request corrections to inaccurate data
- **Right to Erasure:** Request deletion of your data ("Right to be Forgotten")
- **Right to Restrict Processing:** Limit how we use your data
- **Right to Data Portability:** Receive your data in portable format
- **Right to Object:** Object to certain processing activities
- **Right to Lodge Complaint:** File a complaint with your data protection authority

#### 6.2 CCPA Rights (California Users)

If you are a California resident, you have the following rights:

- **Right to Know:** Request what personal data we collect
- **Right to Delete:** Request deletion of your personal data
- **Right to Opt-Out:** Opt out of the sale of your data
- **Right to Non-Discrimination:** No discrimination for exercising CCPA rights

#### 6.3 How to Exercise Your Rights

To exercise any of these rights, please contact us at privacy@gladlabs.io with:

- Your name and email address
- Clear description of your request
- Your location (to apply relevant laws)

We will respond to your request within the timeframe required by applicable law (typically 30-45 days).

### 7. Cookies & Tracking Technologies

We use cookies and similar tracking technologies to:

- Remember your preferences and settings
- Track your usage for analytics
- Personalize your experience
- Manage sessions
- Prevent fraud

#### 7.1 Cookie Types

- **Essential Cookies:** Required for site functionality
- **Performance Cookies:** Analytics and usage tracking
- **Functional Cookies:** Remember your preferences
- **Marketing Cookies:** Track for advertising purposes

#### 7.2 Managing Cookies

You can control cookies through your browser settings. Disabling cookies may affect functionality. You can opt out of analytics cookies without affecting site usage.

### 8. Data Retention

We retain your personal data for as long as necessary to:

- Provide our services
- Comply with legal obligations
- Resolve disputes
- Enforce our agreements

When your account is deleted, we retain anonymized data for analytics and legal compliance as required by law (typically 3-7 years).

### 9. Third-Party Links & Services

Our website may contain links to third-party websites and services. We are not responsible for their privacy practices. Please review their privacy policies before providing any personal information.

### 10. Contact Information

If you have questions about this Privacy Policy or our data practices:

**Email:** privacy@gladlabs.io  
**Mail:** GLAD Labs, Inc., Privacy Team  
**Response Time:** We will respond within 10 business days

### 11. Changes to This Privacy Policy

We may update this privacy policy from time to time. We will notify you of significant changes by updating the "Last Updated" date or sending you an email notification. Your continued use of our services constitutes your acceptance of the updated Privacy Policy.
  `.trim();

  const displayContent = content || fallbackContent;

  return (
    <>
      <Head>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="robots" content="index, follow" />
      </Head>

      <main className="min-h-screen">
        {/* Header */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <h1 className="text-5xl font-bold mb-4">{title}</h1>
            <p className="text-blue-100">Last Updated: {lastUpdated}</p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <div
              className="prose prose-lg max-w-none 
              prose-headings:text-gray-900 
              prose-headings:font-bold
              prose-p:text-gray-700 
              prose-ul:text-gray-700 
              prose-li:text-gray-700 
              prose-strong:text-gray-900
              prose-a:text-blue-600
              prose-a:hover:underline"
            >
              <ReactMarkdown>{displayContent}</ReactMarkdown>
            </div>
          </div>
        </section>

        {/* Footer Navigation */}
        <section className="bg-gray-50 border-t py-12 px-4">
          <div className="container mx-auto max-w-4xl">
            <p className="text-gray-600 text-sm mb-6">Related Pages:</p>
            <div className="space-y-2">
              <Link
                href="/terms"
                className="text-blue-600 hover:underline block"
              >
                → Terms of Service
              </Link>
              <Link
                href="/contact"
                className="text-blue-600 hover:underline block"
              >
                → Contact Us
              </Link>
              <Link href="/" className="text-blue-600 hover:underline block">
                → Back to Home
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export async function getStaticProps() {
  try {
    const url = `${getStrapiURL('/api/privacy-policy')}?populate=*`;
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
      },
    });

    if (!res.ok) {
      return { props: { policy: null }, revalidate: 60 };
    }

    const json = await res.json();
    const data = json?.data || null;

    return { props: { policy: data }, revalidate: 60 };
  } catch (error) {
    console.error('[Privacy Policy getStaticProps] Error:', error.message);
    return { props: { policy: null }, revalidate: 60 };
  }
}
