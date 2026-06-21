'use client';

import { motion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';

import { getDirection, type Locale } from '@/i18n/config';

export function VendorLoginSidebar() {
  const locale = useLocale() as Locale;
  const pageDir = getDirection(locale);
  const t = useTranslations('auth.vendor');
  const tSidebar = useTranslations('auth.vendor.sidebar');

  const features = [
    {
      label: tSidebar('stats.catalogLabel'),
      value: tSidebar('stats.catalogValue')
    },
    {
      label: tSidebar('stats.operationsLabel'),
      value: tSidebar('stats.operationsValue')
    },
    {
      label: tSidebar('stats.brandLabel'),
      value: tSidebar('stats.brandValue')
    }
  ];

  return (
    <div
      dir={pageDir}
      className='bg-gold/5 relative hidden flex-1 items-center justify-center overflow-hidden p-12 lg:flex'
    >
      <div className='from-gold/10 to-gold/5 absolute inset-0 bg-linear-to-br via-transparent' />
      <div className='bg-gold/10 absolute top-1/4 left-1/4 h-64 w-64 rounded-full blur-3xl' />
      <div className='bg-gold/20 absolute right-1/4 bottom-1/4 h-48 w-48 rounded-full blur-3xl' />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className='relative z-10 max-w-md text-center'
      >
        <div className='mb-8'>
          <span className='text-6xl font-bold tracking-tight'>LUXE</span>
          <p className='text-muted-foreground mt-2 text-sm font-medium tracking-[0.2em] uppercase'>
            {t('brandSuffix')}
          </p>
        </div>
        <h2 className='mb-4 text-2xl font-semibold'>{tSidebar('title')}</h2>
        <p className='text-muted-foreground leading-relaxed'>{tSidebar('description')}</p>
        <div className='mt-12 grid grid-cols-3 gap-6'>
          {features.map((feature) => (
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
