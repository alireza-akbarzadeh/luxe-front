'use client';

import { IconChevronDown, IconMapPin } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import { AddressMapPickerDialog } from '@/domains/account/components/address-map-picker-dialog';
import { cn } from '@/lib/utils';

import { useCheckoutShippingAddresses } from '../hooks/use-checkout-shipping-addresses';
import { formatCheckoutAddressLabel } from '../lib/checkout-address';
import { CheckoutManualAddressFields } from '../sections/checkout-manual-address-fields';
import { CheckoutAddressEditDialog } from './checkout-address-edit-dialog';
import { CheckoutAddressPicker } from './checkout-address-picker';
import { CheckoutPickDifferentAddress } from './checkout-pick-different-address';

interface CheckoutShippingAddressBlockProps {
  isAuthenticated: boolean;
}

/** Collapsible shipping address — default open; single section title. */
export function CheckoutShippingAddressBlock({
  isAuthenticated
}: CheckoutShippingAddressBlockProps) {
  const t = useTranslations('checkout.shipping');
  const [open, setOpen] = useState(true);

  const {
    form,
    shippingAddressId,
    isManualAddress,
    isLoadingAddresses,
    savedAddresses,
    activeSavedAddress,
    isMapPickerOpen,
    setIsMapPickerOpen,
    mapPickerSeed,
    editingAddress,
    setEditingAddress,
    closeEditDialog,
    deletingAddressId,
    selectSavedAddress,
    handlePickDifferentAddress,
    handleMapConfirm,
    handleDeleteAddress
  } = useCheckoutShippingAddresses({ isAuthenticated });

  const collapsedSummary = activeSavedAddress
    ? formatCheckoutAddressLabel(activeSavedAddress).title
    : t('address');

  return (
    <Collapsible open={open} onOpenChange={setOpen} className='w-full'>
      <Flex
        direction='column'
        className='border-border/70 bg-card/40 overflow-hidden rounded-2xl border shadow-sm'
      >
        <CollapsibleTrigger asChild>
          <button
            type='button'
            className='hover:bg-muted/30 flex w-full items-center gap-3 px-4 py-3.5 text-start transition-colors'
            aria-expanded={open}
          >
            <span className='bg-gold/15 text-gold flex size-9 shrink-0 items-center justify-center rounded-full'>
              <IconMapPin className='size-4' aria-hidden />
            </span>
            <Flex direction='column' align='start' gap={0.5} className='min-w-0 flex-1'>
              <Typography.Small weight='semibold'>{t('address')}</Typography.Small>
              <Typography.Muted className='truncate text-xs'>
                {open ? t('addressHint') : collapsedSummary}
              </Typography.Muted>
            </Flex>
            <IconChevronDown
              className={cn(
                'text-muted-foreground size-4 shrink-0 transition-transform',
                open && 'rotate-180'
              )}
              aria-hidden
            />
          </button>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <Flex direction='column' gap={4} className='border-border/50 border-t px-4 pt-4 pb-4'>
            {isAuthenticated && isLoadingAddresses ? (
              <Typography.Muted>{t('loadingAddresses')}</Typography.Muted>
            ) : savedAddresses.length > 0 ? (
              <CheckoutAddressPicker
                addresses={savedAddresses}
                selectedId={shippingAddressId}
                onSelectAddress={selectSavedAddress}
                onEditAddress={setEditingAddress}
                onDeleteAddress={handleDeleteAddress}
                isDeletingId={deletingAddressId}
              />
            ) : null}

            {activeSavedAddress && !isManualAddress ? (
              <Flex
                direction='column'
                gap={1}
                className='bg-muted/50 border-border/60 rounded-xl border px-4 py-3'
              >
                <Typography.Small weight='medium'>{t('deliveringTo')}</Typography.Small>
                <Typography.Muted className='text-sm leading-relaxed'>
                  {formatCheckoutAddressLabel(activeSavedAddress).subtitle}
                </Typography.Muted>
              </Flex>
            ) : null}

            {savedAddresses.length > 0 ? (
              <CheckoutPickDifferentAddress
                isActive={isManualAddress}
                onClick={handlePickDifferentAddress}
              />
            ) : null}

            {isManualAddress ? (
              <CheckoutManualAddressFields />
            ) : (
              <form.AppField name='phone'>
                {(field) => (
                  <field.InputPhone
                    label={t('phone')}
                    placeholder={t('phonePlaceholder')}
                    autoComplete='tel'
                  />
                )}
              </form.AppField>
            )}
          </Flex>
        </CollapsibleContent>
      </Flex>

      <AddressMapPickerDialog
        open={isMapPickerOpen}
        onOpenChange={setIsMapPickerOpen}
        initialAddress={mapPickerSeed}
        onConfirm={handleMapConfirm}
      />

      <CheckoutAddressEditDialog
        open={editingAddress != null}
        onOpenChange={(openChange) => {
          if (!openChange) closeEditDialog();
        }}
        address={editingAddress}
      />
    </Collapsible>
  );
}
