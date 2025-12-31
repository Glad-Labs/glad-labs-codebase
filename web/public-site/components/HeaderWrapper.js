'use client';

import dynamic from 'next/dynamic';

const HeaderComponent = dynamic(() => import('./Header.jsx'), {
  ssr: false,
  loading: () => <div className="h-16" />, // Placeholder while loading
});

export default function HeaderWrapper() {
  return <HeaderComponent />;
}
