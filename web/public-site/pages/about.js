import Head from 'next/head';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { getStrapiURL } from '../lib/api';

/**
 * About Page - Combined Layout + Strapi Integration
 *
 * Showcases GLAD Labs' mission, vision, values, and team.
 * Fetches content from Strapi with beautiful fallback markdown.
 */
export default function About({ about }) {
  const title = about?.title || 'About GLAD Labs';
  const content = about?.content || '';
  const seo = about?.seo || {};
  const metaTitle =
    seo.metaTitle || 'About GLAD Labs | Empowering Frontier Firms';
  const metaDescription =
    seo.metaDescription ||
    "Learn about GLAD Labs' mission to empower frontier firms with AI-powered intelligence and insights.";

  const team = [
    {
      name: 'Founder & CEO',
      title: 'Vision & Strategy',
      bio: 'Leading GLAD Labs with a passion for empowering frontier firms.',
    },
    {
      name: 'CTO & Co-Founder',
      title: 'Technology & Product',
      bio: "Building intelligent systems to serve the world's most innovative companies.",
    },
    {
      name: 'Head of Operations',
      title: 'Execution & Growth',
      bio: 'Ensuring GLAD Labs scales responsibly and sustainably.',
    },
  ];

  // Fallback content if no data from Strapi
  const fallbackContent = `
## About GLAD Labs

**Empowering frontier firms with AI-powered market intelligence, regulatory insights, and competitive analysis.**

### Our Mission

At GLAD Labs, we empower frontier firms—innovative companies tackling the world's biggest challenges—with world-class intelligence and insights.

We believe that access to quality market intelligence, regulatory insights, and competitive analysis should not be limited to Fortune 500 companies. Every frontier firm deserves the tools to compete confidently and innovate fearlessly.

### Why We Exist

- **Frontier firms drive innovation** but lack enterprise-grade intelligence tools
- **Market data is fragmented** across multiple sources
- **Regulatory complexity** creates barriers to market entry
- **AI can democratize access** to insights previously available only to the largest firms

### Our Vision

We envision a world where innovation is powered by intelligence. Where small, ambitious teams have access to the same insights as large organizations. Where frontier firms shape the future of their industries.

By 2030, GLAD Labs will be the intelligence platform of choice for 10,000+ frontier firms globally, enabling them to raise $50B+ in total funding and create 1M+ high-quality jobs.

### Our Impact

- **Empower founders** with better market insights
- **Accelerate decision-making** with real-time data
- **Reduce risk** through proactive compliance monitoring
- **Enable frontier firms** to compete with established players

### Our Core Values

- **🚀 Innovation**: We constantly push the boundaries of what's possible with AI, data, and technology
- **🤝 Empowerment**: We empower our users to take control of their futures through better information
- **🎯 Excellence**: We are committed to delivering the highest quality insights, tools, and support
- **🌍 Impact**: We are driven by the belief that frontier firms will solve the world's most pressing challenges
  `.trim();

  const displayContent = content || fallbackContent;

  return (
    <>
      <Head>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta property="og:title" content="About GLAD Labs" />
        <meta property="og:description" content={metaDescription} />
      </Head>

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">{title}</h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Empowering frontier firms with AI-powered market intelligence,
              regulatory insights, and competitive analysis to help them lead
              their industries.
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-ul:text-gray-700 prose-li:text-gray-700 prose-strong:text-gray-900">
              <ReactMarkdown>{displayContent}</ReactMarkdown>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="bg-gray-50 py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-4xl font-bold mb-12 text-center text-gray-900">
              Our Core Values
            </h2>
            <div className="grid md:grid-cols-4 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition">
                <div className="text-4xl mb-4">🚀</div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">
                  Innovation
                </h3>
                <p className="text-gray-600">
                  We constantly push the boundaries of what's possible with AI,
                  data, and technology to create meaningful solutions.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition">
                <div className="text-4xl mb-4">🤝</div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">
                  Empowerment
                </h3>
                <p className="text-gray-600">
                  We empower our users—often founders and decision-makers—to
                  take control of their futures through better information.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">
                  Excellence
                </h3>
                <p className="text-gray-600">
                  We are committed to delivering the highest quality insights,
                  tools, and support to our users.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition">
                <div className="text-4xl mb-4">🌍</div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Impact</h3>
                <p className="text-gray-600">
                  We are driven by the belief that frontier firms will solve the
                  world's most pressing challenges.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-4xl font-bold mb-12 text-center text-gray-900">
              Leadership Team
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {team.map((member, idx) => (
                <div
                  key={idx}
                  className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition border border-gray-200"
                >
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mb-4 mx-auto"></div>
                  <h3 className="text-xl font-bold text-center mb-2 text-gray-900">
                    {member.name}
                  </h3>
                  <p className="text-blue-600 font-semibold text-center mb-4">
                    {member.title}
                  </p>
                  <p className="text-gray-600 text-center">{member.bio}</p>
                </div>
              ))}
            </div>
            <p className="text-center text-gray-600 mt-12">
              We're hiring!{' '}
              <Link href="/careers" className="text-blue-600 hover:underline">
                View open positions
              </Link>
            </p>
          </div>
        </section>
      </main>
    </>
  );
}

export async function getStaticProps() {
  try {
    const url = getStrapiURL('/api/about?populate=*');

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch about page: ${response.status}`);
    }

    const json = await response.json();

    // Extract about data from Strapi v5 format
    if (!json.data) {
      throw new Error('No data in response');
    }

    const aboutData = json.data;

    return {
      props: {
        about: aboutData,
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error('[About getStaticProps] Error:', error.message);
    return {
      props: {
        about: null,
      },
      revalidate: 60,
    };
  }
}
