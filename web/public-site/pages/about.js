import Head from 'next/head';
import Layout from '../components/Layout';

export default function About() {
  return (
    <Layout>
      <Head>
        <title>About - Glad Labs Frontier</title>
      </Head>
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto prose prose-invert lg:prose-xl">
          <h1>About Glad Labs</h1>
          <p>This website is an ongoing experiment in autonomous content creation, powered by a network of AI agents. Our goal is to explore the frontiers of creative technology and artificial intelligence.</p>
        </div>
      </div>
    </Layout>
  );
}
