import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';

import { noIndexMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = noIndexMetadata('Wishlist', 'Your saved items');

export default function WishlistLayout({ children }: Readonly<PropsWithChildren>) {
  return children;
}
