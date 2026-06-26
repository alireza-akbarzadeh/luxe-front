import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';

import { noIndexMetadata } from '@/lib/seo/metadata';

type VendorGroupLayoutProps = Readonly<PropsWithChildren>;

export const metadata: Metadata = noIndexMetadata('Vendor');

/** Route group shell for vendor panel routes (URLs are not prefixed). */
export default function VendorGroupLayout({ children }: VendorGroupLayoutProps) {
  return children;
}
