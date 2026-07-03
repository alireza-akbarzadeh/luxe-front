'use client';

import { IconArrowRight, IconCopy, IconHeadset } from '@tabler/icons-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { copyToClipboard } from '@/lib/utils';

interface OrderTrackingMobileActionsProps {
  orderNumber: string;
}

/** Inline quick actions on mobile — flows with page content (no fixed overlap with bottom nav). */
export function OrderTrackingMobileActions({ orderNumber }: OrderTrackingMobileActionsProps) {
  const t = useTranslations('orderTracking.mobile');
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!orderNumber) return;
    await copyToClipboard(orderNumber, t('orderNumberLabel'));
    setCopied(true);
    toast.success(t('copied'));
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Flex
      direction='column'
      spacing={3}
      className='bg-card border-border/60 mb-8 rounded-2xl border p-4 shadow-sm lg:hidden'
    >
      <Flex direction='row' align='center' spacing={2} className='w-full'>
        <Button
          type='button'
          variant='outline'
          size='lg'
          className='h-11 min-w-0 flex-1 rounded-full'
          onClick={() => void handleCopy()}
          disabled={!orderNumber}
        >
          <IconCopy className='mr-2 h-4 w-4 shrink-0' />
          <span className='truncate'>{copied ? t('copied') : t('copyOrder')}</span>
        </Button>
        <Button asChild size='lg' className='h-11 min-w-0 flex-1 rounded-full'>
          <Link href='/shop'>
            <span className='truncate'>{t('continueShopping')}</span>
            <IconArrowRight className='ml-2 h-4 w-4 shrink-0' />
          </Link>
        </Button>
      </Flex>
      <Button asChild variant='ghost' size='sm' className='text-muted-foreground h-9 w-full'>
        <Link href='/contact'>
          <IconHeadset className='mr-2 h-4 w-4' />
          {t('contactSupport')}
        </Link>
      </Button>
    </Flex>
  );
}
