import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Data Access Requests - Glad Labs',
  description: 'Submit your GDPR data access, deletion, or portability request',
};

export default function DataRequestsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
