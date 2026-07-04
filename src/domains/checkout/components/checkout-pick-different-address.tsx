'use client';

import { IconMapPin, IconPlus } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';

interface CheckoutPickDifferentAddressProps {
  isActive: boolean;
  onClick: () => void;
}

/** Always rendered last in the saved-address list — opens the map picker. */
export function CheckoutPickDifferentAddress({
  isActive,
  onClick
}: CheckoutPickDifferentAddressProps) {
  const t = useTranslations('checkout.shipping');

  return (
    <button
      type='button'
      onClick={onClick}
      className={cn(
        'flex w-full min-w-0 cursor-pointer items-center gap-3 rounded-xl border p-3 text-left transition-colors sm:p-4',
        isActive ? 'border-accent bg-accent/5' : 'border-border hover:border-accent/50'
      )}
    >
      <IconPlus className='text-muted-foreground h-4 w-4 shrink-0' />
      <Flex direction='column' spacing={0.5} className='min-w-0 flex-1'>
        <Typography.Text variant='small' className='font-medium'>
          {t('useDifferentAddress')}
        </Typography.Text>
        <Typography.Text variant='subtle'>{t('useDifferentAddressHint')}</Typography.Text>
      </Flex>
      <IconMapPin className='text-muted-foreground h-4 w-4 shrink-0' />
    </button>
  );
}
