'use client';

import { useTranslations } from 'next-intl';

import { AppDialog } from '@/components/app-dialog';
import { AddressMapPickerDialog } from '@/domains/account/components/address-map-picker-dialog';

import { useCheckoutAddressEdit } from '../hooks/use-checkout-address-edit';
import { CheckoutAddressEditForm } from '../sections/checkout-address-edit-form';
import type { CheckoutAddressEditDialogProps } from '../types/checkout.types';

/** Quick-edit dialog for a saved checkout address with optional map picker. */
export function CheckoutAddressEditDialog({
  open,
  onOpenChange,
  address
}: CheckoutAddressEditDialogProps) {
  const t = useTranslations('checkout.shipping');
  const {
    editForm,
    isPending,
    isMapPickerOpen,
    setIsMapPickerOpen,
    mapPickerSeed,
    handleOpenMapPicker,
    handleMapConfirm,
    handleCancel
  } = useCheckoutAddressEdit({ open, onOpenChange, address });

  return (
    <>
      <AppDialog
        open={open}
        onOpenChange={onOpenChange}
        title={t('editAddressTitle')}
        description={t('editAddressDescription')}
        size='lg'
      >
        <CheckoutAddressEditForm
          form={editForm}
          isPending={isPending}
          onPickOnMap={handleOpenMapPicker}
          onCancel={handleCancel}
        />
      </AppDialog>

      <AddressMapPickerDialog
        open={isMapPickerOpen}
        onOpenChange={setIsMapPickerOpen}
        initialAddress={mapPickerSeed}
        onConfirm={handleMapConfirm}
      />
    </>
  );
}
