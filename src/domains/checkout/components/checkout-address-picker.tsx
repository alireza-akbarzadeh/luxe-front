'use client';

import { IconCheck, IconMapPin, IconPlus } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

import { Flex } from '@/components/ui/flex';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';
import type { ModelsAddress } from '@/services/-addresses-get.schemas';

import { formatCheckoutAddressLabel } from '../lib/checkout-address';

const NEW_ADDRESS_VALUE = 'new';

interface CheckoutAddressPickerProps {
  addresses: ModelsAddress[];
  selectedId: number | null;
  onSelectAddress: (address: ModelsAddress) => void;
  onSelectNew: () => void;
}

/** Lets shoppers pick a saved shipping address or enter a new one. */
export function CheckoutAddressPicker({
  addresses,
  selectedId,
  onSelectAddress,
  onSelectNew
}: CheckoutAddressPickerProps) {
  const t = useTranslations('checkout.shipping');

  const radioValue = selectedId != null ? String(selectedId) : NEW_ADDRESS_VALUE;

  return (
    <Flex direction='column' spacing={3}>
      <Typography.Text variant='small' className='font-semibold'>
        {t('savedAddresses')}
      </Typography.Text>

      <RadioGroup
        value={radioValue}
        onValueChange={(value) => {
          if (value === NEW_ADDRESS_VALUE) {
            onSelectNew();
            return;
          }
          const address = addresses.find((item) => String(item.id) === value);
          if (address) onSelectAddress(address);
        }}
        className='w-full min-w-0 space-y-3'
      >
        {addresses.map((address) => {
          const isSelected = selectedId === address.id;
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
            </Label>
          );
        })}

        <Label
          htmlFor='checkout-address-new'
          className={cn(
            'flex w-full min-w-0 cursor-pointer items-start gap-3 rounded-xl border p-3 transition-colors sm:p-4',
            selectedId == null
              ? 'border-accent bg-accent/5'
              : 'border-border hover:border-accent/50'
          )}
        >
          <RadioGroupItem
            value={NEW_ADDRESS_VALUE}
            id='checkout-address-new'
            className='mt-0.5 shrink-0'
          />
          <Flex direction='row' align='center' spacing={2} className='min-w-0 flex-1'>
            <IconPlus className='text-muted-foreground h-4 w-4 shrink-0' />
            <Typography.Text variant='small' className='font-medium'>
              {t('useDifferentAddress')}
            </Typography.Text>
          </Flex>
        </Label>
      </RadioGroup>

      <Typography.Text variant='subtle'>{t('addressEditableHint')}</Typography.Text>
    </Flex>
  );
}
