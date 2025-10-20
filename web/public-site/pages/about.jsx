import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

/**
 * About Page
 * 
 * Showcases GLAD Labs' mission, vision, values, and team.
 * Provides context about the company and its commitment to frontier firms.
 */
export default function About() {
  const team = [
    {
      name: 'Founder & CEO',
      title: 'Vision & Strategy',
      bio: 'Leading GLAD Labs with a passion for empowering frontier firms.',
    },
    {
      name: 'CTO & Co-Founder',
      title: 'Technology & Product',
      bio: 'Building intelligent systems to serve the world\'s most innovative companies.',
    },
    {
      name: 'Head of Operations',
      title: 'Execution & Growth',
      bio: 'Ensuring GLAD Labs scales responsibly and sustainably.',
    },
  ];

  return (
    <>
      <Head>
        <title>About GLAD Labs | Empowering Frontier Firms</title>
        <meta 
          name="description" 
          content="Learn about GLAD Labs' mission to empower frontier firms with AI-powered intelligence and insights."
        />
        <meta property="og:title" content="About GLAD Labs" />
        <meta 
          property="og:description" 
          content="Discover our mission, vision, and the team driving innovation at GLAD Labs."
        />
      </Head>

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">About GLAD Labs</h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Empowering frontier firms with AI-powered market intelligence, regulatory insights, 
              and competitive analysis to help them lead their industries.
            </p>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h2 className="text-4xl font-bold mb-6 text-gray-900">Our Mission</h2>
                <p className="text-lg text-gray-700 mb-4">
                  At GLAD Labs, we empower frontier firms—innovative companies tackling the world's 
                  biggest challenges—with world-class intelligence and insights.
                </p>
                <p className="text-lg text-gray-700">
                  We believe that access to quality market intelligence, regulatory insights, and 
                  competitive analysis should not be limited to Fortune 500 companies. Every frontier 
                  firm deserves the tools to compete confidently and innovate fearlessly.
                </p>
              </div>
              <div className="bg-blue-50 p-8 rounded-lg">
                <h3 className="text-2xl font-bold mb-4 text-blue-900">Why We Exist</h3>
                <ul className="space-y-4 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-blue-600 font-bold mr-3">✓</span>
                    <span>Frontier firms drive innovation but lack enterprise-grade intelligence tools</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 font-bold mr-3">✓</span>
                    <span>Market data is fragmented across multiple sources</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 font-bold mr-3">✓</span>
                    <span>Regulatory complexity creates barriers to market entry</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 font-bold mr-3">✓</span>
                    <span>AI can democratize access to insights previously available only to the largest firms</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="bg-green-50 p-8 rounded-lg">
                <h3 className="text-2xl font-bold mb-4 text-green-900">Our Impact</h3>
                <ul className="space-y-4 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-green-600 font-bold mr-3">→</span>
                    <span>Empower founders with better market insights</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 font-bold mr-3">→</span>
                    <span>Accelerate decision-making with real-time data</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 font-bold mr-3">→</span>
                    <span>Reduce risk through proactive compliance monitoring</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 font-bold mr-3">→</span>
                    <span>Enable frontier firms to compete with established players</span>
                  </li>
                </ul>
              </div>
              <div>
                <h2 className="text-4xl font-bold mb-6 text-gray-900">Our Vision</h2>
                <p className="text-lg text-gray-700 mb-4">
                  We envision a world where innovation is powered by intelligence. Where small, 
                  ambitious teams have access to the same insights as large organizations. Where 
                  frontier firms shape the future of their industries.
                </p>
                <p className="text-lg text-gray-700">
                  By 2030, GLAD Labs will be the intelligence platform of choice for 10,000+ 
                  frontier firms globally, enabling them to raise $50B+ in total funding and create 
                  1M+ high-quality jobs.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="bg-gray-50 py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-4xl font-bold mb-12 text-center">Our Core Values</h2>
            <div className="grid md:grid-cols-4 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition">
                <div className="text-4xl mb-4">🚀</div>
                <h3 className="text-xl font-bold mb-3">Innovation</h3>
                <p className="text-gray-600">
                  We constantly push the boundaries of what's possible with AI, data, and technology 
                  to create meaningful solutions.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition">
                <div className="text-4xl mb-4">🤝</div>
                <h3 className="text-xl font-bold mb-3">Empowerment</h3>
                <p className="text-gray-600">
                  We empower our users—often founders and decision-makers—to take control of their 
                  futures through better information.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-xl font-bold mb-3">Excellence</h3>
                <p className="text-gray-600">
                  We are committed to delivering the highest quality insights, tools, and support 
                  to our users.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition">
                <div className="text-4xl mb-4">🌍</div>
                <h3 className="text-xl font-bold mb-3">Impact</h3>
                <p className="text-gray-600">
                  We are driven by the belief that frontier firms will solve the world's most 
                  pressing challenges.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-4xl font-bold mb-12 text-center">Leadership Team</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {team.map((member, idx) => (
                <div key={idx} className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition border">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mb-4 mx-auto"></div>
                  <h3 className="text-xl font-bold text-center mb-2">{member.name}</h3>
                  <p className="text-blue-600 font-semibold text-center mb-4">{member.title}</p>
                  <p className="text-gray-600 text-center">{member.bio}</p>
                </div>
              ))}
            </div>
            <p className="text-center text-gray-600 mt-12">
              We're hiring! <Link href="/careers" className="text-blue-600 hover:underline">View open positions</Link>
            </p>
          </div>
        </section>

        {/* Company Stats */}
        <section className="bg-blue-600 text-white py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-4xl font-bold mb-12 text-center">By The Numbers</h2>
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-5xl font-bold mb-2">2025</div>
                <p className="text-blue-100">Founded</p>
              </div>
              <div>
                <div className="text-5xl font-bold mb-2">1M+</div>
                <p className="text-blue-100">Data Points Processed Daily</p>
              </div>
              <div>
                <div className="text-5xl font-bold mb-2">50+</div>
                <p className="text-blue-100">Countries Covered</p>
              </div>
              <div>
                <div className="text-5xl font-bold mb-2">24/7</div>
                <p className="text-blue-100">Monitoring Active</p>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-3xl">
            <h2 className="text-4xl font-bold mb-12 text-center">Our Journey</h2>
            <div className="space-y-8">
              <div className="flex gap-8">
                <div className="flex flex-col items-center">
                  <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                  <div className="w-1 h-24 bg-blue-200 mt-2"></div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">2025: Founding</h3>
                  <p className="text-gray-600">
                    GLAD Labs is founded with a mission to democratize access to business intelligence 
                    for frontier firms.
                  </p>
                </div>
              </div>
              <div className="flex gap-8">
                <div className="flex flex-col items-center">
                  <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                  <div className="w-1 h-24 bg-blue-200 mt-2"></div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Q1 2026: Beta Launch</h3>
                  <p className="text-gray-600">
                    Public beta release with core features including market intelligence and competitive analysis.
                  </p>
                </div>
              </div>
              <div className="flex gap-8">
                <div className="flex flex-col items-center">
                  <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                  <div className="w-1 h-24 bg-blue-200 mt-2"></div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Q4 2026: Expansion</h3>
                  <p className="text-gray-600">
                    Expand regulatory monitoring, add new markets, and reach 1,000 active users.
                  </p>
                </div>
              </div>
              <div className="flex gap-8">
                <div className="flex flex-col items-center">
                  <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">2027+: Global Scale</h3>
                  <p className="text-gray-600">
                    Build the essential intelligence platform for frontier firms worldwide.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gray-900 text-white py-16 px-4">
          <div className="container mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join frontier firms using GLAD Labs to stay ahead of the competition and make better decisions.
            </p>
            <div className="flex gap-4 justify-center">
              <Link 
                href="/signup" 
                className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition"
              >
                Get Started Free
              </Link>
              <Link 
                href="/contact" 
                className="inline-block px-8 py-3 bg-gray-700 text-white rounded-lg font-bold hover:bg-gray-600 transition"
              >
                Talk to Sales
              </Link>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Get In Touch</h2>
            <p className="text-gray-600 mb-6">
              Have questions? We'd love to hear from you.
            </p>
            <p className="text-lg">
              <strong>Email:</strong> <a href="mailto:hello@gladlabs.io" className="text-blue-600 hover:underline">hello@gladlabs.io</a>
            </p>
          </div>
        </section>
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
