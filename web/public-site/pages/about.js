import Head from 'next/head';
import ReactMarkdown from 'react-markdown';

export default function About({ about }) {
  const title = about?.title || 'About Glad Labs';
  const content = about?.content || '';
  const seo = about?.seo || {};
  const metaTitle = seo.metaTitle || title;
  const metaDescription =
    seo.metaDescription ||
    'About Glad Labs - AI-powered business co-founder system';

  // Fallback content if no data from Strapi
  const fallbackContent = `
## About Glad Labs

Glad Labs is revolutionizing the way businesses operate with our AI-powered Co-Founder system.

### Our Mission

To democratize access to intelligent business automation and strategic decision-making through advanced AI technology.

### What We Do

- **AI Co-Founder System**: Intelligent business partner providing strategic insights and operational support
- **Autonomous Content Creation**: Multi-agent content generation with research, writing, and quality assurance
- **Business Intelligence**: Real-time analytics and performance monitoring
- **Agent Orchestration**: Sophisticated multi-agent workflow management

### Technology Stack

Our platform is built on cutting-edge technologies including:
- Next.js & React for modern web experiences
- Python & FastAPI for AI orchestration
- OpenAI, Anthropic, and Google AI integrations
- Firebase & Strapi for data management

### Get Started

Ready to transform your business with AI? Contact us to learn more about our AI Co-Founder system.
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

export async function getStaticProps() {
  // Note: /api/about endpoint does not exist in FastAPI backend
  // Using fallback content for now. About page content can be updated in the
  // fallback content below or a dedicated About endpoint can be created.
  return {
    props: { about: null },
    revalidate: 3600, // Revalidate every hour
  };
}
