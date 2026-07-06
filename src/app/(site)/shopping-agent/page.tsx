import type { Metadata } from 'next';

import { PersonalShoppingAgentDomain } from '@/domains/personal-shopping-agent/personal-shopping-agent.domain';
import { buildPageMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = buildPageMetadata({
  title: 'Personal shopping agent',
  description: 'Your memory-aware AI agent for curated product discovery on Luxe.',
  path: '/shopping-agent'
});

export default function PersonalShoppingAgentPage() {
  return <PersonalShoppingAgentDomain />;
}
