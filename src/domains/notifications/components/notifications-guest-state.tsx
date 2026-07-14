'use client';

import { IconArrowRight, IconBell, IconChevronRight } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { DynamicBreadcrumb } from '@/components/breadcrumb-list';
import { Button } from '@/components/ui/button';

export function NotificationsGuestState() {
  const t = useTranslations('notifications.guest');

  return (
    <main className='app-container pt-24 pb-16'>
      <DynamicBreadcrumb
        items={[{ label: t('breadcrumb') }]}
        direction='column'
        separator={<IconChevronRight className='h-3 w-3' />}
        className='text-muted-foreground mb-8 text-xs'
        breadcrumbClassName='flex items-center gap-1.5'
      />

      <div className='mx-auto max-w-lg pb-16'>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className='bg-card rounded-3xl border p-8 text-center shadow-sm sm:p-12'
        >
          <div className='bg-secondary mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full'>
            <IconBell className='text-muted-foreground h-9 w-9' />
          </div>
          <h1 className='font-display mb-2 text-2xl font-semibold sm:text-3xl'>{t('title')}</h1>
          <p className='text-muted-foreground mb-8 text-sm leading-relaxed'>{t('description')}</p>
          <div className='flex flex-col gap-3 sm:flex-row sm:justify-center'>
            <Button asChild className='rounded-full' size='lg'>
              <Link href='/login?callbackUrl=/notifications'>
                {t('signIn')}
                <IconArrowRight className='ml-2 h-4 w-4' />
              </Link>
            </Button>
            <Button asChild variant='outline' className='rounded-full' size='lg'>
              <Link href='/shop'>{t('browseShop')}</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
