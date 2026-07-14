'use client';

import { IconCircleCheck, IconLayoutDashboard, IconPackage } from '@tabler/icons-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { GradientCtaLink } from '@/components/buttons/gradient-cta-link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';

export function VendorOnboardingSuccessDomain() {
  const t = useTranslations('vendor.onboarding.successPage');
  const searchParams = useSearchParams();
  const storeName = searchParams.get('store')?.trim();

  const nextSteps = [
    { key: 'catalog', Icon: IconPackage },
    { key: 'dashboard', Icon: IconLayoutDashboard }
  ] as const;

  return (
    <div className='mx-auto flex min-h-[calc(100vh-4.5rem)] max-w-2xl flex-col justify-center px-4 py-12 sm:px-6'>
      <Flex direction='column' spacing={6} align='center' className='text-center'>
        <span className='bg-gold/15 text-gold flex size-16 items-center justify-center rounded-full'>
          <IconCircleCheck className='size-9' aria-hidden />
        </span>

        <div>
          <Typography.H1 className='text-3xl font-semibold tracking-tight md:text-4xl'>
            {t('title')}
          </Typography.H1>
          <Typography.Muted className='mx-auto mt-3 max-w-lg text-base'>
            {storeName ? t('descriptionWithStore', { store: storeName }) : t('description')}
          </Typography.Muted>
        </div>

        <GradientCtaLink href='/vendor/panel' className='inline-flex items-center gap-2'>
          {t('openDashboard')}
        </GradientCtaLink>
      </Flex>

      <Card className='border-border/50 bg-card/60 mt-10 backdrop-blur-xl'>
        <CardHeader>
          <CardTitle>{t('nextSteps.title')}</CardTitle>
          <CardDescription>{t('nextSteps.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className='space-y-4'>
            {nextSteps.map(({ key, Icon }) => (
              <li key={key} className='flex gap-3'>
                <span className='bg-muted flex size-9 shrink-0 items-center justify-center rounded-lg'>
                  <Icon className='text-muted-foreground size-4' aria-hidden />
                </span>
                <div>
                  <p className='text-sm font-medium'>{t(`nextSteps.items.${key}.title`)}</p>
                  <p className='text-muted-foreground text-xs leading-relaxed'>
                    {t(`nextSteps.items.${key}.description`)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Flex direction='row' justify='center' spacing={3} className='mt-8'>
        <Button variant='outline' asChild>
          <Link href='/vendor'>{t('backToOverview')}</Link>
        </Button>
        <Button variant='ghost' asChild>
          <Link href='/help'>{t('getHelp')}</Link>
        </Button>
      </Flex>
    </div>
  );
}
