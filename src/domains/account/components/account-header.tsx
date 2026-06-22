'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

import { useAuth } from '@/components/providers/auth-provider';

export function AccountHeader() {
  const { user } = useAuth();
  const t = useTranslations('account.header');

  if (!user) return;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className='mb-6 sm:mb-8'
    >
      <h1 className='mb-2 text-2xl font-bold sm:text-3xl'>{t('title')}</h1>
      <p className='text-muted-foreground text-sm sm:text-base'>
        {t('welcome', { name: user.first_name ?? '' })}
      </p>
    </motion.div>
  );
}
