'use client';

import { motion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';

import { getDirection, type Locale } from '@/i18n/config';
import { getHomeMarketingCopyParams } from '@/lib/i18n/marketing-copy-params';

export function LoginSidebar() {
  const locale = useLocale() as Locale;
  const pageDir = getDirection(locale);
  const t = useTranslations('auth.sidebar.login');

  const authCopy = getHomeMarketingCopyParams().authSidebar;

  const stats = [
    { label: t('stats.secureCheckout'), value: t('stats.secureCheckoutValue', authCopy) },
    { label: t('stats.freeReturns'), value: t('stats.freeReturnsValue', authCopy) },
    { label: t('stats.support'), value: t('stats.supportValue', { hours: authCopy.hours, days: authCopy.daysSupport }) }
  ];

  return (
    <div
      dir={pageDir}
      className='bg-accent/5 relative hidden flex-1 items-center justify-center overflow-hidden p-12 lg:flex'
    >
      <div className='from-accent/10 to-accent/5 absolute inset-0 bg-linear-to-br via-transparent' />
      <div className='bg-accent/10 absolute top-1/4 left-1/4 h-64 w-64 rounded-full blur-3xl' />
      <div className='bg-accent/20 absolute right-1/4 bottom-1/4 h-48 w-48 rounded-full blur-3xl' />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className='relative z-10 max-w-md text-center'
      >
        <div className='mb-8'>
          <span className='text-6xl font-bold tracking-tight'>LUXE</span>
        </div>
        <h2 className='mb-4 text-2xl font-semibold'>{t('title')}</h2>
        <p className='text-muted-foreground leading-relaxed'>{t('description')}</p>
        <div className='mt-12 grid grid-cols-3 gap-6'>
          {stats.map((feature) => (
            <div key={feature.label} className='text-center'>
              <p className='text-lg font-semibold'>{feature.value}</p>
              <p className='text-muted-foreground text-xs'>{feature.label}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
