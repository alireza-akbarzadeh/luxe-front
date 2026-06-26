import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';

import { noIndexMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = noIndexMetadata('Checkout', 'Secure checkout');

export default function CheckoutLayout({ children }: Readonly<PropsWithChildren>) {
  return children;
}
