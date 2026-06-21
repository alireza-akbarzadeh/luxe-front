'use client';

import { IconMoon, IconSun } from '@tabler/icons-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

import { useTheme } from '@/components/providers/client/theme';

export function ThemeMenuItem() {
  const t = useTranslations('nav.userProfile.theme');
  const { resolvedTheme, setTheme } = useTheme();

  const nextTheme = resolvedTheme === 'light' ? 'dark' : 'light';

  return (
    <button
      onClick={() => setTheme(nextTheme)}
      className='group hover:bg-accent/60 flex w-full cursor-pointer items-center gap-3 rounded-2xl p-3 transition-all'
    >
      <div className='bg-muted group-hover:bg-primary/10 flex h-9 w-9 items-center justify-center rounded-xl transition-colors'>
        <AnimatePresence mode='wait'>
          <motion.div
            key={resolvedTheme}
            initial={{ opacity: 0, rotate: -90, scale: 0.7 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 90, scale: 0.7 }}
            transition={{ duration: 0.2 }}
          >
            {resolvedTheme === 'dark' ? (
              <IconSun size={16} className='text-foreground' />
            ) : (
              <IconMoon size={16} className='text-foreground' />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className='flex-1 text-start'>
        <span className='text-sm font-medium'>{t('title')}</span>
        <span className='text-muted-foreground block text-xs'>{t('subtitle')}</span>
      </div>
    </button>
  );
}
