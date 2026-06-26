import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';

import { buildPageMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = buildPageMetadata({
  title: 'Contact',
  description:
    'Reach the Luxe concierge team — order help, partnerships, press inquiries, and 24/7 support.',
  path: '/contact'
});

export default function ContactLayout({ children }: Readonly<PropsWithChildren>) {
  return children;
}
