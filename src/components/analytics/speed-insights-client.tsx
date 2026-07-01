'use client';

import dynamic from 'next/dynamic';

const SpeedInsights = dynamic(
  () => import('@vercel/speed-insights/next').then((m) => m.SpeedInsights),
  { ssr: false }
);

/** Client-only wrapper — `ssr: false` dynamic imports must live in Client Components. */
export function SpeedInsightsClient() {
  return <SpeedInsights />;
}
