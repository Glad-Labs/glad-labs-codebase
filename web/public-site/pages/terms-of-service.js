import Head from 'next/head';
import ReactMarkdown from 'react-markdown';

export async function getStaticProps() {
  try {
    const FASTAPI_URL =
      process.env.NEXT_PUBLIC_FASTAPI_URL || 'http://localhost:8000';
    const url = `${FASTAPI_URL}/api/terms-of-service?populate=*`;
    const res = await fetch(url);

    if (!res.ok) {
      return { props: { terms: null }, revalidate: 60 };
    }

    const json = await res.json();
    // FastAPI returns data directly, not nested in attributes
    const data = json?.data || null;

    return { props: { terms: data }, revalidate: 60 };
  } catch (e) {
    // FastAPI might be temporarily unavailable; do not 404 in dev
    return { props: { terms: null }, revalidate: 60 };
  }
}

export default function TermsOfService({ terms }) {
  const title = terms?.title || 'Terms of Service';
  const content = terms?.content || '';
  const seo = terms?.seo || {};
  const metaTitle = seo.metaTitle || `${title} | Glad Labs`;
  const metaDescription = seo.metaDescription || 'Glad Labs Terms of Service';

  // Fallback content if no data from FastAPI
  const fallbackContent = `
## Terms of Service

**Last Updated:** October 20, 2025

### 1. Agreement to Terms

By accessing and using this website and service, you accept and agree to be bound by the terms and provision of this agreement.

### 2. License & Limited Use

We grant you a limited, non-exclusive, and non-transferable license to use our services for your personal, non-commercial use, subject to the restrictions in these terms.

You may not:
- Reproduce, copy, or distribute any part of our services
- Attempt to reverse engineer or access any source code
- Use our services for any unlawful purpose
- Interfere with or disrupt the integrity or performance of our services
- Attempt to gain unauthorized access to our systems
- Scrape or automate access to our services
- Transfer your license without our written consent

### 3. User Accounts

If you create an account, you are responsible for:
- Maintaining the confidentiality of your password
- All activities under your account
- Providing accurate information during registration

### 4. Intellectual Property Rights

- All content and materials on our services are our property or our licensors'
- Your content remains your property, but you grant us a license to use it
- You may not use our intellectual property without permission

### 5. Limitations of Liability

**AS IS BASIS**: Our services are provided "as is" without warranties.

**WARRANTY DISCLAIMER**: We make no warranties, express or implied, regarding:
- Accuracy or reliability of the services
- Fitness for a particular purpose
- Uninterrupted or error-free operation

**LIABILITY LIMITS**: To the maximum extent permitted by law, we are not liable for:
- Indirect, incidental, or consequential damages
- Any damages exceeding the amount you paid us in the last 12 months
- Loss of data, revenue, or business opportunities

### 6. Indemnification

You agree to indemnify and hold us harmless from any claims arising from:
- Your use of our services
- Your breach of these terms
- Your violation of any law or regulation
- Your infringement of third-party rights

### 7. Payment Terms

- We may charge fees for our services
- You are responsible for any applicable taxes
- We may cancel service for non-payment
- Cancellation does not entitle you to refunds

### 8. Termination

- You may terminate your account at any time
- We may terminate your account for violating these terms
- Termination does not relieve you of payment obligations

### 9. Changes to These Terms

We reserve the right to modify these terms at any time. Your continued use constitutes acceptance of changes.

### 10. Governing Law

These terms are governed by the laws of California, without regard to conflict of laws.

### 11. Contact Information

For questions about these terms, contact us at: legal@gladlabs.com
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
