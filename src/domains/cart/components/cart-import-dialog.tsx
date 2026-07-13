'use client';

import { IconDownload } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';

import { AppDialog } from '@/components/app-dialog';
import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Textarea } from '@/components/ui/textarea';
import { Typography } from '@/components/ui/typography';
import {
  CART_SHARE_QUERY_KEY,
  extractCartShareCode,
  parseCartShareInput
} from '@/domains/cart/lib/cart-share';

type CartImportDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** e.g. close the cart sheet so the shared cart page is visible */
  onImported?: () => void;
};

export function CartImportDialog({
  open,
  onOpenChange,
  onImported
}: Readonly<CartImportDialogProps>) {
  const t = useTranslations('cart.import');
  const router = useRouter();
  const [value, setValue] = useState('');

  const handleOpenChange = (next: boolean) => {
    onOpenChange(next);
    if (!next) setValue('');
  };

  const handleImport = () => {
    const lines = parseCartShareInput(value);
    const code = extractCartShareCode(value);
    if (!lines || !code) {
      toast.error(t('invalid'));
      return;
    }

    onImported?.();
    handleOpenChange(false);
    toast.success(t('success', { count: lines.length }));
    router.push(`/cart?${CART_SHARE_QUERY_KEY}=${encodeURIComponent(code)}`);
  };

  return (
    <AppDialog
      open={open}
      onOpenChange={handleOpenChange}
      title={t('title')}
      description={t('description')}
      size='md'
      stacked
    >
      <Flex direction='column' spacing={4} className='w-full max-w-full min-w-0 pt-1'>
        <div className='w-full max-w-full min-w-0 space-y-2'>
          <Typography.Label className='text-sm font-medium'>{t('fieldLabel')}</Typography.Label>
          <Textarea
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder={t('placeholder')}
            className='field-sizing-fixed min-h-28 w-full max-w-full min-w-0 resize-y font-mono text-xs break-all'
            aria-label={t('fieldLabel')}
          />
          <Typography.Muted className='text-xs'>{t('hint')}</Typography.Muted>
        </div>

        <Button
          type='button'
          className='rounded-full'
          disabled={value.trim().length === 0}
          onClick={handleImport}
        >
          <IconDownload className='size-4' />
          {t('action')}
        </Button>
      </Flex>
    </AppDialog>
  );
}
