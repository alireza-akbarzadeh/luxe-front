import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';

import { AuthPageChrome } from '@/domains/auth/components/auth-page-chrome';
import { noIndexMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = noIndexMetadata('Account');

export default function AuthLayout({ children }: Readonly<PropsWithChildren>) {
  return (
    <div className='font-shell-commerce min-h-screen font-sans'>
      <AuthPageChrome>{children}</AuthPageChrome>
    </div>
  );
}
