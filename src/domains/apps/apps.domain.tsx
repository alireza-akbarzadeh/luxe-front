'use client';

import { useTranslations } from 'next-intl';

import { Text } from '@/components/ui/typography';
import { SectionShell } from '@/domains/support/components/section-shell';
import { SupportPageHero } from '@/domains/support/components/support-page-hero';

import { PlatformCardsGrid } from './components/platform-cards-grid';

export function AppsDomain() {
  const t = useTranslations('platforms');

  return (
    <main className='pb-24'>
      <SupportPageHero
        eyebrow={t('hero.eyebrow')}
        title={t('hero.title')}
        description={t('hero.description')}
        breadcrumbs={[{ name: t('hero.home'), href: '/' }, { name: t('hero.current') }]}
      />

      <SectionShell className='mt-14'>
        <PlatformCardsGrid />
      </SectionShell>

      <SectionShell size='md' className='mt-10'>
        <Text variant='muted' align='center'>
          {t('footnote')}
        </Text>
      </SectionShell>
    </main>
  );
}
