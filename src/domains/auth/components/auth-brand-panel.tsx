'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';

import { Box } from '@/components/ui/box';
import { Flex } from '@/components/ui/flex';
import { Grid } from '@/components/ui/grid';
import { Typography } from '@/components/ui/typography';
import { getDirection, type Locale } from '@/i18n/config';
import { getHomeMarketingCopyParams } from '@/lib/i18n/marketing-copy-params';
import { cn } from '@/lib/utils';

type AuthBrandPanelProps = {
  /** Compact strip for mobile drawer; full panel for desktop split. */
  variant?: 'panel' | 'strip';
  className?: string;
};

/** Floating, breathing accent orbs that drift behind the content. */
function AuroraOrbs({ animate }: { animate: boolean }) {
  const orbs = [
    {
      className: 'bg-accent/20 top-[-5rem] left-[-3rem] size-64',
      motion: { x: [0, 30, -10, 0], y: [0, -20, 20, 0], scale: [1, 1.15, 0.95, 1] },
      duration: 16
    },
    {
      className: 'bg-accent/25 right-[-2rem] bottom-[-4rem] size-56',
      motion: { x: [0, -25, 15, 0], y: [0, 20, -15, 0], scale: [1, 1.1, 1.05, 1] },
      duration: 20
    },
    {
      className: 'bg-accent/15 top-1/3 right-1/4 size-48',
      motion: { x: [0, 20, -20, 0], y: [0, -25, 10, 0], scale: [1, 0.9, 1.2, 1] },
      duration: 24
    }
  ];

  return (
    <Box aria-hidden className='pointer-events-none absolute inset-0 overflow-hidden'>
      {orbs.map((orb, index) => (
        <motion.span
          key={index}
          className={cn('absolute rounded-full blur-3xl', orb.className)}
          animate={animate ? orb.motion : undefined}
          transition={{ duration: orb.duration, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </Box>
  );
}

/** Slow diagonal light sweep that glides across the panel like a sheen. */
function LightSweep({ animate }: { animate: boolean }) {
  if (!animate) return null;
  return (
    <motion.span
      aria-hidden
      className='via-foreground/10 pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 skew-x-12 bg-linear-to-r from-transparent to-transparent'
      animate={{ left: ['-50%', '150%'] }}
      transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', repeatDelay: 3 }}
    />
  );
}

/** Luxe-branded auth visual — sheer accent wash + animated blur orbs (login page + dialog). */
export function AuthBrandPanel({ variant = 'panel', className }: AuthBrandPanelProps) {
  const locale = useLocale() as Locale;
  const pageDir = getDirection(locale);
  const t = useTranslations('auth.sidebar.login');
  const authCopy = getHomeMarketingCopyParams().authSidebar;
  const prefersReduced = useReducedMotion();
  const animate = !prefersReduced;

  const stats = [
    {
      label: t('stats.secureCheckout'),
      value: t('stats.secureCheckoutValue', authCopy)
    },
    {
      label: t('stats.freeReturns'),
      value: t('stats.freeReturnsValue', authCopy)
    },
    {
      label: t('stats.support'),
      value: t('stats.supportValue', {
        hours: authCopy.hours,
        days: authCopy.daysSupport
      })
    }
  ];

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } }
  };
  const item: Variants = {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
  };

  if (variant === 'strip') {
    return (
      <Flex
        dir={pageDir}
        direction='column'
        gap={1}
        className={cn(
          'bg-accent/5 relative overflow-hidden border-b px-4 py-4 text-center',
          className
        )}
      >
        <div className='from-accent/15 absolute inset-0 bg-linear-to-b to-transparent' />
        <AuroraOrbs animate={animate} />
        <LightSweep animate={animate} />
        <Typography.Text className='font-display relative z-10 text-2xl font-bold tracking-tight'>
          LUXE
        </Typography.Text>
        <Typography.Muted className='relative z-10 text-xs'>{t('tagline')}</Typography.Muted>
      </Flex>
    );
  }

  return (
    <Box
      dir={pageDir}
      className={cn(
        'bg-accent/5 relative hidden flex-1 items-center justify-center overflow-hidden p-10 lg:flex',
        className
      )}
    >
      <div className='from-accent/10 to-accent/5 absolute inset-0 bg-linear-to-br via-transparent' />
      <AuroraOrbs animate={animate} />
      <LightSweep animate={animate} />
      <div className='bg-background/20 absolute inset-0 backdrop-blur-[2px]' />

      <motion.div
        variants={container}
        initial='hidden'
        animate='show'
        className='relative z-10 max-w-sm text-center'
      >
        <motion.div variants={item}>
          <Typography.Text className='font-display mb-6 text-5xl font-bold tracking-tight'>
            LUXE
          </Typography.Text>
        </motion.div>
        <motion.div variants={item}>
          <Typography.H2 className='mb-3 text-xl font-semibold'>{t('title')}</Typography.H2>
        </motion.div>
        <motion.div variants={item}>
          <Typography.Muted className='leading-relaxed'>{t('description')}</Typography.Muted>
        </motion.div>
        <motion.div variants={item}>
          <Typography.Text className='text-muted-foreground mt-6 text-sm font-medium'>
            {t('tagline')}
          </Typography.Text>
        </motion.div>

        <motion.div variants={item}>
          <Grid cols={3} gap={3} className='mt-10'>
            {stats.map((feature) => (
              <Flex
                key={feature.label}
                direction='column'
                gap={1}
                className='border-border/50 bg-background/30 hover:bg-background/50 rounded-2xl border px-2 py-3 text-center backdrop-blur-sm transition-colors duration-300'
              >
                <Typography.Text className='text-sm font-semibold'>{feature.value}</Typography.Text>
                <Typography.Muted className='text-[0.65rem]'>{feature.label}</Typography.Muted>
              </Flex>
            ))}
          </Grid>
        </motion.div>
      </motion.div>
    </Box>
  );
}
