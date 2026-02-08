'use client';

import dynamic from 'next/dynamic';

const GiscusComments = dynamic(
  () => import('./GiscusComments'),
  { ssr: false }
);

interface GiscusWrapperProps {
  postSlug: string;
  postTitle: string;
}

export function GiscusWrapper({ postSlug, postTitle }: GiscusWrapperProps) {
  return <GiscusComments postSlug={postSlug} postTitle={postTitle} />;
}
