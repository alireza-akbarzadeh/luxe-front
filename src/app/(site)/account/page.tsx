import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';

import { AccountDomain } from '@/domains/account/account.domain';
import { AccountPageSkeleton } from '@/domains/account/components/account-page-skeleton';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('account.meta');

  return {
    title: t('title'),
    description: t('description')
  };
}

export default function AccountPage() {
  return (
    <Suspense fallback={<AccountPageSkeleton />}>
      <AccountDomain />
    </Suspense>
  );
}
