'use client';

import { useTranslations } from 'next-intl';

import { AppDialog } from '@/components/app-dialog';
import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import type { ModelsAddress } from '@/services/-addresses-get.schemas';

import { formatCheckoutAddressLabel } from '../lib/checkout-address';

interface CheckoutAddressDeleteDialogProps {
  address: ModelsAddress | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (address: ModelsAddress) => void;
  isDeleting?: boolean;
}

/** Confirms deletion of a saved checkout address; shows the address label. */
export function CheckoutAddressDeleteDialog({
  address,
  open,
  onOpenChange,
  onConfirm,
  isDeleting = false
}: CheckoutAddressDeleteDialogProps) {
  const t = useTranslations('checkout.shipping');
  const tCommon = useTranslations('account.common');

  const label = address ? formatCheckoutAddressLabel(address).title : '';

  const handleConfirm = () => {
    if (!address) return;
    onConfirm(address);
  };

  return (
    <AppDialog
      open={open}
      onOpenChange={onOpenChange}
      title={t('deleteAddressTitle')}
      description={t('deleteAddressDescription', { label })}
      size='sm'
    >
      {address ? (
        <Typography.Text variant='small' className='text-muted-foreground mb-4 block break-words'>
          {formatCheckoutAddressLabel(address).subtitle}
        </Typography.Text>
      ) : null}
      <Flex direction='row' justify='end' spacing={2}>
        <Button
          type='button'
          variant='outline'
          disabled={isDeleting}
          onClick={() => onOpenChange(false)}
        >
          {tCommon('cancel')}
        </Button>
        <Button
          type='button'
          variant='destructive'
          disabled={isDeleting || !address}
          onClick={handleConfirm}
        >
          {tCommon('delete')}
        </Button>
      </Flex>
    </AppDialog>
  );
}
