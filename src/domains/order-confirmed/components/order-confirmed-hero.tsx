'use client';

import { IconCheckbox, IconClock, IconHeart } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

import { Sparkles } from '@/components/effects/sparkles';
import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';

interface OrderConfirmedHeroProps {
  paymentComplete: boolean;
  isFreshCheckout: boolean;
  pendingTitle: string;
  pendingDescription: string;
}

/** Celebration header with sparkles and status-aware messaging. */
export function OrderConfirmedHero({
  paymentComplete,
  isFreshCheckout,
  pendingTitle,
  pendingDescription
}: OrderConfirmedHeroProps) {
  const t = useTranslations('orderConfirmed.hero');

  const title = paymentComplete
    ? isFreshCheckout
      ? t('confirmedTitle')
      : t('receivedTitle')
    : pendingTitle;

  const subtitle = paymentComplete
    ? isFreshCheckout
      ? t('thanksFresh')
      : t('thanksDefault')
    : pendingDescription;

  return (
    <Flex direction='column' align='center' className='relative mb-10 text-center'>
      {paymentComplete ? (
        <div className='pointer-events-none absolute inset-x-0 -top-8 h-56'>
          <Sparkles particleColor='#c9a96e' particleDensity={72} className='h-full w-full' />
        </div>
      ) : null}

      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 220, damping: 18 }}
        className='relative mb-6'
      >
        <div
          className={cn(
            'relative flex h-24 w-24 items-center justify-center rounded-full',
            paymentComplete ? 'bg-green-500/10' : 'bg-amber-500/10'
          )}
        >
          {paymentComplete ? (
            <>
              <motion.span
                animate={{ scale: [1, 1.35, 1], opacity: [0.35, 0, 0.35] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut' }}
                className='absolute inset-0 rounded-full border-2 border-green-500/40'
              />
              <div className='flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20 shadow-[0_0_32px_rgba(34,197,94,0.35)]'>
                <IconCheckbox className='h-9 w-9 text-green-500' stroke={2.5} />
              </div>
            </>
          ) : (
            <div className='flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/20'>
              <IconClock className='h-9 w-9 text-amber-600' stroke={2} />
            </div>
          )}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12 }}
        className='relative max-w-xl'
      >
        <Typography.H2 as='h1' className='mb-2 text-3xl md:text-4xl'>
          {title}
          {paymentComplete && isFreshCheckout ? (
            <span className='text-accent ml-1 inline-block'>!</span>
          ) : null}
        </Typography.H2>

        <Flex direction='row' align='center' justify='center' gap={1} className='mb-2'>
          <Typography.Muted className='text-base'>{subtitle}</Typography.Muted>
          {paymentComplete && isFreshCheckout ? (
            <IconHeart className='text-accent size-4 fill-current' aria-hidden />
          ) : null}
        </Flex>

        {paymentComplete ? (
          <Typography.Muted className='mx-auto max-w-md text-sm leading-relaxed'>
            {t('paymentReceived')}
          </Typography.Muted>
        ) : null}
      </motion.div>
    </Flex>
  );
}
