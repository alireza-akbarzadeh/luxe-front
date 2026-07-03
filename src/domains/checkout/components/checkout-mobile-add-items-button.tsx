'use client';

import { IconPlus } from '@tabler/icons-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';

interface CheckoutMobileAddItemsButtonProps {
  onNavigate?: () => void;
  className?: string;
}

/** Links to shop so shoppers can add more items during checkout. */
export function CheckoutMobileAddItemsButton({
  onNavigate,
  className
}: CheckoutMobileAddItemsButtonProps) {
  const t = useTranslations('checkout.mobileSummary');

  return (
    <Button variant='outline' size='lg' className={className} asChild>
      <Link href='/shop' onClick={onNavigate}>
        <IconPlus className='size-4 shrink-0' aria-hidden />
        {t('addItems')}
      </Link>
    </Button>
  );
}
