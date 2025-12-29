import Head from 'next/head';
import Link from 'next/link';

export async function getStaticProps() {
  return {
    props: {},
    revalidate: 3600,
  };
}

export default function PrivacyPolicy() {
  const title = 'Privacy Policy';
  const metaTitle = `${title} | Glad Labs`;
  const metaDescription = 'Glad Labs Privacy Policy';

  const content = `
## Privacy Policy

**Last Updated:** October 14, 2025  
**Effective Date:** October 1, 2025

### Introduction

Glad Labs, LLC ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.

### Information We Collect

We collect information that you provide directly to us, including:

- **Personal Information**: Name, email address, company information
- **Usage Data**: How you interact with our services
- **Technical Data**: IP address, browser type, device information

### How We Use Your Information

We use the information we collect to:

- Provide, maintain, and improve our services
- Communicate with you about products, services, and updates
- Analyze usage patterns and optimize user experience
- Comply with legal obligations

### Data Security

We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.

### Third-Party Services

We may use third-party service providers to help us operate our business and provide services to you. These providers have access to your information only to perform specific tasks on our behalf.

## Privacy Policy

**Last Updated:** October 14, 2025  
**Effective Date:** October 1, 2025

### Introduction

Glad Labs, LLC ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.

### Information We Collect

We collect information that you provide directly to us, including:

- **Personal Information**: Name, email address, company information
- **Usage Data**: How you interact with our services
- **Technical Data**: IP address, browser type, device information

### Your Rights

You have the right to:

- Access your personal information
- Correct inaccurate data
- Request deletion of your data
- Object to processing of your data
- Export your data

### Contact Us

If you have questions about this Privacy Policy, please contact us at:

**Email:** privacy@gladlabs.com  
**Address:** Glad Labs, LLC

### Changes to This Policy

We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
  `;

  return (
    <>
      <Head>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
      </Head>
      <div className="container mx-auto px-4 md:px-6 py-12">
        <h1 className="text-4xl md:text-5xl font-bold text-cyan-300 mb-8">
          {title}
        </h1>
        <div className="max-w-4xl prose prose-invert">
          <div className="text-gray-300 leading-relaxed space-y-4">
            {content.split('\n\n').map((paragraph, i) => (
              <p key={i} className="whitespace-pre-wrap">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
        <div className="mt-8">
          <Link href="/" className="text-cyan-400 hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    </>
  );
}
