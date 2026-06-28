'use client';

import { IconLock, IconRotate, IconTruck } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';

/** Compact trust signals shown during checkout (mobile-first). */
export function CheckoutTrustBadges() {
  const t = useTranslations('checkout.trust');

  const badges = [
    { icon: IconLock, label: t('secure') },
    { icon: IconTruck, label: t('shipping') },
    { icon: IconRotate, label: t('returns') }
  ] as const;

  return (
    <Flex
      direction='row'
      align='center'
      justify='between'
      wrap='wrap'
      spacing={2}
      className='bg-muted/30 border-border/50 mb-6 rounded-xl border px-3 py-3 sm:px-4'
    >
      {badges.map(({ icon: Icon, label }) => (
        <Flex key={label} direction='row' align='center' spacing={1.5} className='min-w-0 flex-1'>
          <Icon className='text-muted-foreground h-4 w-4 shrink-0' />
          <Typography.Text variant='subtle' className='truncate text-[11px] sm:text-xs'>
            {label}
          </Typography.Text>
        </Flex>
      ))}
    </Flex>
  );
}
