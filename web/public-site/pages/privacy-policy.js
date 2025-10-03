import Head from 'next/head';
import Layout from '../components/Layout';

export default function PrivacyPolicy() {
  return (
    <Layout>
      <Head>
        <title>Privacy Policy - Glad Labs Frontier</title>
      </Head>
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto prose prose-invert lg:prose-xl">
          <h1>Privacy Policy</h1>
          <p>This is a placeholder for your privacy policy. You should replace this with your own terms.</p>
        </div>
      </div>
    </Layout>
  );
}
