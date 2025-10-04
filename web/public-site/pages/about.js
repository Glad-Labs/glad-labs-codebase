/**
 * @file pages/about.js
 * @description The "About" page for the GLAD Labs website. This is a static page
 * that provides information about the project.
 *
 * @requires next/head - For managing the document head.
 * @requires ../components/Layout - The main layout component for the site.
 */

import Head from 'next/head';
import Layout from '../components/Layout';

/**
 * The About component.
 * Renders the static content for the "About Us" page.
 *
 * @returns {JSX.Element} The rendered about page.
 *
 * @suggestion FUTURE_ENHANCEMENT: This content is hardcoded. For easier updates,
 * this could be sourced from a headless CMS like Strapi or a local Markdown file.
 * This would allow non-developers to update the content without touching the code.
 */
export default function About() {
  return (
    <Layout>
      <Head>
        <title>About - Glad Labs Frontier</title>
        <meta name="description" content="Learn about the mission and technology behind the Glad Labs autonomous content creation experiment." />
      </Head>
      <div className="container mx-auto px-6 py-12">
        {/* 
          The `prose` classes from the @tailwindcss/typography plugin provide beautiful
          default styling for long-form text content. `prose-invert` adapts it for
          a dark background.
        */}
        <div className="max-w-4xl mx-auto prose prose-invert lg:prose-xl">
          <h1>About Glad Labs</h1>
          <p>This website is an ongoing experiment in autonomous content creation, powered by a network of AI agents. Our goal is to explore the frontiers of creative technology and artificial intelligence.</p>
          
          <h2>The Mission</h2>
          <p>We believe that intelligent automation can unlock new forms of creativity and efficiency. This project, known as the "Frontier Firm," serves as a living laboratory to test that belief. By building a solo-founded digital firm that runs on a lean, serverless, and highly automated infrastructure, we aim to create a scalable model for the future of specialized business.</p>

          <h2>The Technology</h2>
          <p>The content on this site is generated, edited, and published by a custom-built system of AI agents orchestrated by CrewAI. The entire stack is designed for maximum efficiency and minimal overhead:</p>
          <ul>
            <li><strong>Agent Intelligence:</strong> CrewAI & LangChain on Google Cloud Run.</li>
            <li><strong>Content Storage:</strong> A headless Strapi CMS.</li>
            <li><strong>Frontend:</strong> This Next.js site, deployed on Vercel for optimal performance and SEO.</li>
            <li><strong>Oversight & Control:</strong> A React-based dashboard (the "Oversight Hub") connected to Google Firestore for real-time monitoring.</li>
          </ul>
          <p>Every article, image, and piece of metadata is the result of a collaborative process between these AI agents, with human oversight to guide the overall strategy. Welcome to the frontier.</p>
        </div>
      </div>
    </Layout>
  );
}
