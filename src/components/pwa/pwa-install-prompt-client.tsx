'use client';

import dynamic from 'next/dynamic';

const PwaInstallPrompt = dynamic(
  () => import('@/components/pwa/install-prompt').then((m) => m.PwaInstallPrompt),
  { ssr: false }
);

/** Client-only wrapper — `ssr: false` dynamic imports must live in Client Components. */
export function PwaInstallPromptClient() {
  return <PwaInstallPrompt />;
}
