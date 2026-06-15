import Link from 'next/link';
import type { ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import { SectionShell } from '@/domains/support/components/section-shell';
import { SupportPageHero } from '@/domains/support/components/support-page-hero';

interface StaticSitePageProps {
  eyebrow: string;
  title: string;
  description: string;
  breadcrumbs: Array<{ name: string; href?: string }>;
  children: ReactNode;
}

/** Shared layout for legal and marketing stub pages. */
export function StaticSitePage({
  eyebrow,
  title,
  description,
  breadcrumbs,
  children
}: StaticSitePageProps) {
  return (
    <main className='pb-24'>
      <SupportPageHero
        eyebrow={eyebrow}
        title={title}
        description={description}
        breadcrumbs={breadcrumbs}
      />
      <SectionShell size='md' className='mt-16'>
        <div className='border-border/60 bg-card/40 prose prose-neutral dark:prose-invert max-w-none rounded-3xl border p-8 backdrop-blur'>
          {children}
        </div>
      </SectionShell>
    </main>
  );
}

interface MarketingStubActionsProps {
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}

export function MarketingStubActions({
  primaryHref = '/shop',
  primaryLabel = 'Browse shop',
  secondaryHref = '/contact',
  secondaryLabel = 'Contact concierge'
}: MarketingStubActionsProps) {
  return (
    <div className='not-prose mt-8 flex flex-wrap gap-3'>
      <Button asChild className='rounded-full'>
        <Link href={primaryHref}>{primaryLabel}</Link>
      </Button>
      <Button asChild variant='outline' className='rounded-full'>
        <Link href={secondaryHref}>{secondaryLabel}</Link>
      </Button>
    </div>
  );
}
