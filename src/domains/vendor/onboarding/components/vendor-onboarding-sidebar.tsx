'use client';

import { IconCheck, IconRocket, IconShieldCheck, IconTrendingUp } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

const HIGHLIGHT_ICONS = [IconRocket, IconTrendingUp, IconShieldCheck] as const;

export function VendorOnboardingSidebar() {
  const t = useTranslations('vendor.onboarding.sidebar');

  const highlights = [
    { key: 'launch', Icon: HIGHLIGHT_ICONS[0] },
    { key: 'reach', Icon: HIGHLIGHT_ICONS[1] },
    { key: 'trust', Icon: HIGHLIGHT_ICONS[2] }
  ] as const;

  return (
    <div className='bg-gold/5 relative hidden flex-1 flex-col justify-between overflow-hidden p-10 xl:flex xl:max-w-md xl:p-12'>
      <div className='from-gold/10 to-gold/5 absolute inset-0 bg-linear-to-br via-transparent' />
      <div className='bg-gold/10 pointer-events-none absolute top-1/4 -left-8 h-56 w-56 rounded-full blur-3xl' />
      <div className='bg-gold/15 pointer-events-none absolute right-0 bottom-1/4 h-40 w-40 rounded-full blur-3xl' />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='relative z-10'
      >
        <p className='text-muted-foreground text-xs font-medium tracking-[0.2em] uppercase'>
          {t('eyebrow')}
        </p>
        <h2 className='mt-3 text-2xl font-semibold tracking-tight text-balance'>{t('title')}</h2>
        <p className='text-muted-foreground mt-3 text-sm leading-relaxed'>{t('description')}</p>
      </motion.div>

      <motion.ul
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className='relative z-10 mt-10 space-y-4'
      >
        {highlights.map(({ key, Icon }) => (
          <li key={key} className='flex gap-3'>
            <span className='bg-gold/15 text-gold flex size-9 shrink-0 items-center justify-center rounded-full'>
              <Icon className='size-4' aria-hidden />
            </span>
            <div>
              <p className='text-sm font-medium'>{t(`highlights.${key}.title`)}</p>
              <p className='text-muted-foreground text-xs leading-relaxed'>
                {t(`highlights.${key}.description`)}
              </p>
            </div>
          </li>
        ))}
      </motion.ul>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.25 }}
        className='border-border/50 bg-card/40 relative z-10 mt-10 rounded-2xl border p-4 backdrop-blur-sm'
      >
        <FlexRow>
          <IconCheck className='text-gold size-4 shrink-0' aria-hidden />
          <p className='text-muted-foreground text-xs leading-relaxed'>{t('savedProgress')}</p>
        </FlexRow>
      </motion.div>
    </div>
  );
}

function FlexRow({ children }: { children: React.ReactNode }) {
  return <div className='flex items-start gap-2.5'>{children}</div>;
}
