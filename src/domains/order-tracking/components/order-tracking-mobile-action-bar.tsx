'use client';

import { IconArrowRight, IconCopy, IconHeadset } from '@tabler/icons-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import { copyToClipboard } from '@/lib/utils';

interface OrderTrackingMobileActionBarProps {
  orderNumber: string;
}

/** Sticky actions on mobile — shop again, copy order #, get help. */
export function OrderTrackingMobileActionBar({ orderNumber }: OrderTrackingMobileActionBarProps) {
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
      spacing={2}
      className='bg-background/95 fixed inset-x-0 bottom-0 z-40 border-t p-4 backdrop-blur-md lg:hidden'
    >
      <Flex direction='row' align='center' spacing={2}>
        <Button
          type='button'
          variant='outline'
          size='lg'
          className='h-11 flex-1 rounded-full'
          onClick={() => void handleCopy()}
          disabled={!orderNumber}
        >
          <IconCopy className='mr-2 h-4 w-4' />
          {copied ? t('copied') : t('copyOrder')}
        </Button>
        <Button asChild size='lg' className='h-11 flex-1 rounded-full'>
          <Link href='/shop'>
            {t('continueShopping')}
            <IconArrowRight className='ml-2 h-4 w-4' />
          </Link>
        </Button>
      </Flex>
      <Button asChild variant='ghost' size='sm' className='text-muted-foreground h-9 w-full'>
        <Link href='/contact'>
          <IconHeadset className='mr-2 h-4 w-4' />
          {t('contactSupport')}
        </Link>
      </Button>
      {orderNumber ? (
        <Typography.Text variant='subtle' className='text-center text-[11px]'>
          {t('orderNumberLabel')}: <span className='font-mono'>{orderNumber}</span>
        </Typography.Text>
      ) : null}
    </Flex>
  );
}
