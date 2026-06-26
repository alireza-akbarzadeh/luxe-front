import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';

import { noIndexMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = noIndexMetadata('Cart', 'Your shopping cart');

export default function CartLayout({ children }: Readonly<PropsWithChildren>) {
  return children;
}
