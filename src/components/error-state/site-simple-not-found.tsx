'use client';

import type { TablerIcon } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';

type SimpleNotFoundNamespace = 'errors.store' | 'errors.orderTracking' | 'errors.orderConfirmed';

export function SiteSimpleNotFound({
  namespace,
  Icon,
  primaryHref,
  primaryIcon: PrimaryIcon,
  compact = false
}: {
  namespace: SimpleNotFoundNamespace;
  Icon: TablerIcon;
  primaryHref: string;
  primaryIcon: TablerIcon;
  compact?: boolean;
}) {
  const t = useTranslations(namespace);
  const tCommon = useTranslations('errors.common');

  return (
    <div
      className={
        compact
          ? 'flex min-h-[60vh] items-center justify-center px-4 pt-24 pb-16'
          : 'bg-background flex min-h-screen items-center justify-center px-4'
      }
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='text-center'
      >
        {!compact && (
          <div className='bg-secondary mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full'>
            <Icon className='text-muted-foreground h-10 w-10' />
          </div>
        )}
        <h1 className={`mb-2 font-bold ${compact ? 'text-2xl' : 'text-3xl'}`}>
          {t('notFoundTitle')}
        </h1>
        <p className={`text-muted-foreground mb-6 max-w-md ${compact ? 'text-sm' : ''}`}>
          {t('notFoundDescription')}
        </p>
        <div className='flex items-center justify-center gap-3'>
          <Button asChild variant='outline' className='gap-2 rounded-full'>
            <Link href={primaryHref}>
              <PrimaryIcon className='h-4 w-4' />
              {t('primaryAction')}
            </Link>
          </Button>
          <Button asChild variant={compact ? 'link' : 'default'} className='gap-2'>
            <Link href='/'>{tCommon('goHome')}</Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
