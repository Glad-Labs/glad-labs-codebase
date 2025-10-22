import Head from 'next/head';
import ReactMarkdown from 'react-markdown';
import { getStrapiURL } from '../lib/api';

export async function getStaticProps() {
  try {
    const url = `${getStrapiURL('/api/privacy-policy')}?populate=*`;
    const res = await fetch(url);

    if (!res.ok) {
      return { props: { policy: null }, revalidate: 60 };
    }

    const json = await res.json();
    // Strapi v5: data fields are directly on json.data, not json.data.attributes
    const data = json?.data || null;

    return { props: { policy: data }, revalidate: 60 };
  } catch (e) {
    // Strapi might be rebooting; do not 404 in dev
    return { props: { policy: null }, revalidate: 60 };
  }
}

export default function PrivacyPolicy({ policy }) {
  const title = policy?.title || 'Privacy Policy';
  const content = policy?.content || '';
  const seo = policy?.seo || {};
  const metaTitle = seo.metaTitle || `${title} | GLAD Labs`;
  const metaDescription = seo.metaDescription || 'GLAD Labs Privacy Policy';

  // Fallback content if no data from Strapi
  const fallbackContent = `
## Privacy Policy

**Last Updated:** October 14, 2025  
**Effective Date:** October 1, 2025

### Introduction

GLAD Labs, LLC ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.

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
**Address:** GLAD Labs, LLC

### Changes to This Policy

We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
  `.trim();

  const displayContent = content || fallbackContent;

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
        <div className="prose prose-invert prose-lg max-w-none">
          <ReactMarkdown>{displayContent}</ReactMarkdown>
        </div>
      </div>
    </>
  );
}
