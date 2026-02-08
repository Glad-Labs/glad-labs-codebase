'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const GiscusComments = dynamic(
  () =>
    import('./GiscusComments').catch((err) => {
      console.error('Failed to load GiscusComments:', err);
      return { default: () => null };
    }),
  {
    ssr: false,
    loading: () => (
      <div className="text-slate-400 text-sm">Loading comments...</div>
    ),
  }
);

interface GiscusWrapperProps {
  postSlug: string;
  postTitle: string;
}

export function GiscusWrapper({ postSlug, postTitle }: GiscusWrapperProps) {
  return <GiscusComments postSlug={postSlug} postTitle={postTitle} />;
}
