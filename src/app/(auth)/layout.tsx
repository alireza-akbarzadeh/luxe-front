import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';

import { noIndexMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = noIndexMetadata('Account');

export default function AuthLayout({ children }: Readonly<PropsWithChildren>) {
  return children;
}
