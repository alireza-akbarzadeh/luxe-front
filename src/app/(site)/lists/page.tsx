import type { Metadata } from 'next';

import { CommunityShoppingListsDomain } from '@/domains/community-shopping-lists/community-shopping-lists.domain';
import { buildPageMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = buildPageMetadata({
  title: 'Community Shopping Lists',
  description:
    'Browse community-curated shopping lists — practical edits from real shoppers you can add to cart in one tap.',
  path: '/lists'
});

export default function CommunityListsPage() {
  return <CommunityShoppingListsDomain />;
}
