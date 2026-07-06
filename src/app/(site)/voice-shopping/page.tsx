import type { Metadata } from 'next';
import { Suspense } from 'react';

import VoiceShoppingDomain from '@/domains/voice-shopping/voice-shopping.domain';
import { buildPageMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = buildPageMetadata({
  title: 'Voice shopping',
  description:
    'Speak naturally to Luxe’s AI shopping assistant — describe what you need and get curated product picks.',
  path: '/voice-shopping'
});

type VoiceShoppingPageProps = {
  searchParams: Promise<{ listen?: string }>;
};

async function VoiceShoppingPageContent({ searchParams }: VoiceShoppingPageProps) {
  const params = await searchParams;
  const autoStartVoice = params.listen === '1' || params.listen === 'true';

  return <VoiceShoppingDomain autoStartVoice={autoStartVoice} />;
}

export default function VoiceShoppingPage(props: VoiceShoppingPageProps) {
  return (
    <Suspense fallback={null}>
      <VoiceShoppingPageContent {...props} />
    </Suspense>
  );
}
