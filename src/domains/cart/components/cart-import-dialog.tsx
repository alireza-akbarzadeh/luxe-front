'use client';

import { IconDownload } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';

import { AppDialog } from '@/components/app-dialog';
import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Textarea } from '@/components/ui/textarea';
import { Typography } from '@/components/ui/typography';
import { useCartShareQuery } from '@/domains/cart/hooks/use-cart-share-query';
import { extractCartShareCode, parseCartShareInput } from '@/domains/cart/lib/cart-share';

type CartImportDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CartImportDialog({ open, onOpenChange }: Readonly<CartImportDialogProps>) {
  const t = useTranslations('cart.import');
  const [, setShareCode] = useCartShareQuery();
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

    void setShareCode(code);
    toast.success(t('success', { count: lines.length }));
    handleOpenChange(false);
  };

  return (
    <AppDialog
      open={open}
      onOpenChange={handleOpenChange}
      title={t('title')}
      description={t('description')}
      size='md'
    >
      <Flex direction='column' spacing={4} className='pt-1'>
        <div className='space-y-2'>
          <Typography.Label className='text-sm font-medium'>{t('fieldLabel')}</Typography.Label>
          <Textarea
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder={t('placeholder')}
            className='min-h-28 font-mono text-xs'
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
