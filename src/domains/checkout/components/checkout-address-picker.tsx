'use client';

import { IconCheck, IconEdit, IconMapPin, IconTrash } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Typography } from '@/components/ui/typography';
import { isShippingDefaultAddress } from '@/domains/account/address-form-utils';
import { cn } from '@/lib/utils';
import type { ModelsAddress } from '@/services/-addresses-get.schemas';

import { formatCheckoutAddressLabel } from '../lib/checkout-address';
import { CheckoutAddressDeleteDialog } from './checkout-address-delete-dialog';

interface CheckoutAddressPickerProps {
  addresses: ModelsAddress[];
  selectedId: number | null;
  onSelectAddress: (address: ModelsAddress) => void;
  onEditAddress: (address: ModelsAddress) => void;
  onDeleteAddress: (address: ModelsAddress) => void;
  isDeletingId?: number | null;
}

/** Radio list of saved shipping addresses (default first). */
export function CheckoutAddressPicker({
  addresses,
  selectedId,
  onSelectAddress,
  onEditAddress,
  onDeleteAddress,
  isDeletingId = null
}: CheckoutAddressPickerProps) {
  const t = useTranslations('checkout.shipping');
  const tCommon = useTranslations('account.common');
  const [addressToDelete, setAddressToDelete] = useState<ModelsAddress | null>(null);

  const sortedAddresses = [...addresses].sort((a, b) => {
    const aDefault = isShippingDefaultAddress(a) ? 1 : 0;
    const bDefault = isShippingDefaultAddress(b) ? 1 : 0;
    if (aDefault !== bDefault) return bDefault - aDefault;
    return Number(a.id) - Number(b.id);
  });

  const radioValue = selectedId != null ? String(selectedId) : '';
  const isDeleteDialogOpen = addressToDelete != null;
  const isDeletingSelected =
    addressToDelete?.id != null &&
    isDeletingId != null &&
    Number(addressToDelete.id) === Number(isDeletingId);

  const handleDeleteConfirm = (address: ModelsAddress) => {
    onDeleteAddress(address);
    setAddressToDelete(null);
  };

  return (
    <>
      <Flex direction='column' spacing={3}>
        <Typography.Text variant='small' className='font-semibold'>
          {t('savedAddresses')}
        </Typography.Text>

        <RadioGroup
          value={radioValue}
          onValueChange={(value) => {
            const address = sortedAddresses.find((item) => String(item.id) === value);
            if (address) onSelectAddress(address);
          }}
          className='w-full min-w-0 space-y-3'
        >
          {sortedAddresses.map((address) => {
            const isSelected = selectedId != null && Number(selectedId) === Number(address.id);
            const { title, subtitle } = formatCheckoutAddressLabel(address);
            const isDeleting = isDeletingId != null && Number(isDeletingId) === Number(address.id);

            return (
              <div
                key={address.id}
                className={cn(
                  'flex w-full min-w-0 items-start gap-3 rounded-xl border p-3 transition-colors sm:p-4',
                  isSelected ? 'border-accent bg-accent/5' : 'border-border hover:border-accent/50'
                )}
              >
                <Label
                  htmlFor={`checkout-address-${address.id}`}
                  className='flex min-w-0 flex-1 cursor-pointer items-start gap-3'
                >
                  <RadioGroupItem
                    value={String(address.id)}
                    id={`checkout-address-${address.id}`}
                    className='mt-0.5 shrink-0'
                  />
                  <Flex direction='column' spacing={1} className='min-w-0 flex-1 text-left'>
                    <Flex
                      direction='row'
                      align='center'
                      spacing={2}
                      wrap='wrap'
                      className='min-w-0'
                    >
                      <IconMapPin className='text-muted-foreground h-4 w-4 shrink-0' />
                      <Typography.Text variant='small' className='min-w-0 font-medium break-words'>
                        {title}
                      </Typography.Text>
                      {address.is_default ? (
                        <span className='text-accent flex shrink-0 items-center gap-1 text-xs font-medium'>
                          <IconCheck className='h-3 w-3' />
                          {t('defaultAddress')}
                        </span>
                      ) : null}
                    </Flex>
                    <Typography.Text
                      variant='subtle'
                      className='line-clamp-3 text-start break-words'
                    >
                      {subtitle}
                    </Typography.Text>
                  </Flex>
                </Label>
                <Flex direction='row' align='center' spacing={0} className='shrink-0'>
                  <Button
                    type='button'
                    variant='ghost'
                    size='icon'
                    className='text-muted-foreground hover:text-foreground h-8 w-8'
                    aria-label={tCommon('edit')}
                    disabled={isDeleting}
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      onEditAddress(address);
                    }}
                  >
                    <IconEdit className='h-4 w-4' />
                  </Button>
                  <Button
                    type='button'
                    variant='ghost'
                    size='icon'
                    className='text-muted-foreground h-8 w-8 hover:bg-red-50 hover:text-red-600'
                    aria-label={tCommon('delete')}
                    disabled={isDeleting}
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      setAddressToDelete(address);
                    }}
                  >
                    <IconTrash className='h-4 w-4' />
                  </Button>
                </Flex>
              </div>
            );
          })}
        </RadioGroup>
      </Flex>

      <CheckoutAddressDeleteDialog
        address={addressToDelete}
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          if (!open) setAddressToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeletingSelected}
      />
    </>
  );
}
