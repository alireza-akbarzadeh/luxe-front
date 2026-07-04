'use client';

import { IconCheck, IconEdit, IconMapPin, IconPlus } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';
import type { ModelsAddress } from '@/services/-addresses-get.schemas';

import { formatCheckoutAddressLabel } from '../lib/checkout-address';

interface CheckoutAddressPickerProps {
  addresses: ModelsAddress[];
  selectedId: number | null;
  isManualSelected: boolean;
  onSelectAddress: (address: ModelsAddress) => void;
  onPickDifferentAddress: () => void;
  onEditAddress: (address: ModelsAddress) => void;
}

/** Lets shoppers pick a saved shipping address, quick-edit, or pick a new one on the map. */
export function CheckoutAddressPicker({
  addresses,
  selectedId,
  isManualSelected,
  onSelectAddress,
  onPickDifferentAddress,
  onEditAddress
}: CheckoutAddressPickerProps) {
  const t = useTranslations('checkout.shipping');
  const tCommon = useTranslations('account.common');

  const radioValue = selectedId != null ? String(selectedId) : '';

  return (
    <Flex direction='column' spacing={3}>
      <Typography.Text variant='small' className='font-semibold'>
        {t('savedAddresses')}
      </Typography.Text>

      <RadioGroup
        value={radioValue}
        onValueChange={(value) => {
          const address = addresses.find((item) => String(item.id) === value);
          if (address) onSelectAddress(address);
        }}
        className='w-full min-w-0 space-y-3'
      >
        {addresses.map((address) => {
          const isSelected = selectedId != null && Number(selectedId) === Number(address.id);
          const { title, subtitle } = formatCheckoutAddressLabel(address);

          return (
            <Label
              key={address.id}
              htmlFor={`checkout-address-${address.id}`}
              className={cn(
                'flex w-full min-w-0 cursor-pointer items-start gap-3 rounded-xl border p-3 transition-colors sm:p-4',
                isSelected ? 'border-accent bg-accent/5' : 'border-border hover:border-accent/50'
              )}
            >
              <RadioGroupItem
                value={String(address.id)}
                id={`checkout-address-${address.id}`}
                className='mt-0.5 shrink-0'
              />
              <Flex direction='column' spacing={1} className='min-w-0 flex-1 text-left'>
                <Flex direction='row' align='center' spacing={2} wrap='wrap' className='min-w-0'>
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
                <Typography.Text variant='subtle' className='line-clamp-3 text-start break-words'>
                  {subtitle}
                </Typography.Text>
              </Flex>
              <Button
                type='button'
                variant='ghost'
                size='icon'
                className='text-muted-foreground hover:text-foreground h-8 w-8 shrink-0'
                aria-label={tCommon('edit')}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  onEditAddress(address);
                }}
              >
                <IconEdit className='h-4 w-4' />
              </Button>
            </Label>
          );
        })}
      </RadioGroup>

      <button
        type='button'
        onClick={onPickDifferentAddress}
        className={cn(
          'flex w-full min-w-0 cursor-pointer items-center gap-3 rounded-xl border p-3 text-left transition-colors sm:p-4',
          isManualSelected ? 'border-accent bg-accent/5' : 'border-border hover:border-accent/50'
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
    </Flex>
  );
}
