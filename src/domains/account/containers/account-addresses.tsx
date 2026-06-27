'use client';

import { IconCheck, IconEdit, IconMapPin, IconPlus, IconTrash } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useEffect, useState, useTransition } from 'react';
import { toast } from 'sonner';

import { AppDialog } from '@/components/app-dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import type { GeocodedAddress, GeoCoordinates } from '@/lib/geocoding/types';
import { useAppForm } from '~/src/components/forms/useAppForm';
import { getGetAccountSummaryQueryKey } from '~/src/services/-account-summary-get';
import { usePatchAddressesIdDefault } from '~/src/services/-addresses-{id}-default-patch';
import { useDeleteAddressesId } from '~/src/services/-addresses-{id}-delete';
import { usePutAddressesId } from '~/src/services/-addresses-{id}-put';
import type { ModelsAddress } from '~/src/services/-addresses-default-get.schemas';
import { getGetAddressesQueryKey, useGetAddresses } from '~/src/services/-addresses-get';
import { usePostAddresses } from '~/src/services/-addresses-post';
import type {
  DtoCreateAddressRequest,
  DtoCreateAddressRequestAddressType
} from '~/src/services/-addresses-post.schemas';

import { addressFormSchema, type AddressFormValues } from '../account.schema';
import {
  addressModelToGeocodedSeed,
  addressToFormValues,
  EMPTY_ADDRESS_FORM_VALUES,
  formValuesToGeocodedSeed,
  hasValidGeoCoordinates,
  isShippingDefaultAddress,
  mergeGeocodedAddress
} from '../address-form-utils';
import { AddressMapPickerDialog } from '../components/address-map-picker-dialog';

export function AccountAddresses() {
  const queryClient = useQueryClient();
  const t = useTranslations('account.addresses');
  const tCommon = useTranslations('account.common');
  const tFields = useTranslations('auth.fields');
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [isMapPickerOpen, setIsMapPickerOpen] = useState(false);
  const [mapCoordinates, setMapCoordinates] = useState<GeoCoordinates | null>(null);
  const [mapPickerSeed, setMapPickerSeed] = useState<GeocodedAddress | null>(null);
  const [dialogInitialValues, setDialogInitialValues] =
    useState<AddressFormValues>(EMPTY_ADDRESS_FORM_VALUES);
  const [editingAddressId, setEditingAddressId] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  const { data: addressesResponse, isLoading, isError, refetch } = useGetAddresses();
  const addresses = addressesResponse?.data?.addresses || [];
  const defaultShippingAddress =
    addresses.find((address) => isShippingDefaultAddress(address)) ?? null;
  const otherAddresses = defaultShippingAddress
    ? addresses.filter((address) => address.id !== defaultShippingAddress.id)
    : addresses;

  const createAddress = usePostAddresses();
  const updateAddress = usePutAddressesId();
  const setDefaultAddress = usePatchAddressesIdDefault();
  const deleteAddress = useDeleteAddressesId();

  const form = useAppForm({
    defaultValues: EMPTY_ADDRESS_FORM_VALUES,
    validators: {
      onChange: addressFormSchema,
      onBlur: addressFormSchema
    },
    onSubmit: async ({ value }) => {
      startTransition(async () => {
        try {
          const recipientName = `${value.firstName} ${value.lastName}`.trim();

          const payload: DtoCreateAddressRequest = {
            address_type: value.address_type as DtoCreateAddressRequestAddressType,
            recipient_name: recipientName,
            phone: value.phone,
            address_line1: value.street,
            address_line2: value.apartment || '',
            city: value.city,
            state: value.state,
            postal_code: value.zipCode,
            country: value.country,
            is_default: value.isDefault,
            instructions: value.label
          };

          if (editingAddressId) {
            await updateAddress.mutateAsync({
              id: editingAddressId,
              data: payload
            });
            toast.success(t('updated'));
          } else {
            await createAddress.mutateAsync({ data: payload });
            toast.success(t('added'));
          }

          await queryClient.invalidateQueries({ queryKey: getGetAddressesQueryKey() });
          await queryClient.invalidateQueries({ queryKey: getGetAccountSummaryQueryKey() });

          setIsAddressDialogOpen(false);
          setEditingAddressId(null);
          setDialogInitialValues(EMPTY_ADDRESS_FORM_VALUES);
          form.reset();
        } catch (error: unknown) {
          const message =
            (error as { response?: { data?: { message?: string } } })?.response?.data?.message ??
            tCommon('somethingWrong');
          toast.error(message);
        }
      });
    }
  });

  useEffect(() => {
    if (!isAddressDialogOpen) return;
    form.reset(dialogInitialValues);
  }, [dialogInitialValues, form, isAddressDialogOpen]);

  const handleAddNewAddress = () => {
    setEditingAddressId(null);
    setDialogInitialValues(EMPTY_ADDRESS_FORM_VALUES);
    setMapCoordinates(null);
    setIsAddressDialogOpen(true);
  };

  const handleOpenMapPicker = () => {
    const values = form.state.values;
    const hasFormAddress = values.street.trim().length > 0;

    if (hasFormAddress) {
      setMapPickerSeed(formValuesToGeocodedSeed(values, mapCoordinates));
    } else if (defaultShippingAddress) {
      setMapPickerSeed(addressModelToGeocodedSeed(defaultShippingAddress));
    } else {
      setMapPickerSeed(null);
    }

    setIsMapPickerOpen(true);
  };

  const applyGeocodedAddress = (address: GeocodedAddress) => {
    const merged = mergeGeocodedAddress(form.state.values, address);

    form.setFieldValue('street', merged.street);
    form.setFieldValue('city', merged.city);
    form.setFieldValue('state', merged.state);
    form.setFieldValue('zipCode', merged.zipCode);
    form.setFieldValue('country', merged.country);
    setMapCoordinates({
      latitude: address.latitude,
      longitude: address.longitude
    });
    toast.success(t('locationUpdated'));
  };

  const handleEditAddress = (address: ModelsAddress) => {
    setEditingAddressId(address.id as number);
    setDialogInitialValues(addressToFormValues(address));
    const seed = addressModelToGeocodedSeed(address);
    setMapCoordinates(hasValidGeoCoordinates(seed) ? seed : null);
    setIsAddressDialogOpen(true);
  };

  const renderAddressCard = (address: ModelsAddress) => (
    <div
      key={address.id}
      className={`bg-card relative rounded-xl border p-6 ${
        address.is_default ? 'border-accent' : 'border-border'
      }`}
    >
      {address.is_default ? (
        <span className='text-accent absolute end-4 top-4 flex items-center gap-1 text-xs font-medium'>
          <IconCheck className='h-3 w-3' />
          {tCommon('default')}
        </span>
      ) : null}
      <h3 className='mb-2 font-semibold'>{address.instructions || t('addressFallback')}</h3>
      <p className='text-muted-foreground text-sm'>{address.recipient_name}</p>
      <p className='text-muted-foreground text-sm'>
        {address.address_line1}
        {address.address_line2 ? `, ${address.address_line2}` : null}
      </p>
      <p className='text-muted-foreground text-sm'>
        {address.city}, {address.state} {address.postal_code}
      </p>
      <p className='text-muted-foreground text-sm'>{address.country}</p>
      <p className='text-muted-foreground text-sm'>{address.phone}</p>

      <div className='border-border mt-4 flex items-center gap-2 border-t pt-4'>
        <Button variant='ghost' size='sm' onClick={() => handleEditAddress(address)}>
          <IconEdit className='me-1 h-4 w-4' />
          {tCommon('edit')}
        </Button>
        {!address.is_default ? (
          <Button variant='ghost' size='sm' onClick={() => handleSetDefault(address.id as number)}>
            {tCommon('setDefault')}
          </Button>
        ) : null}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant='ghost'
              size='sm'
              className='text-red-600 hover:bg-red-50 hover:text-red-700'
            >
              <IconTrash className='h-4 w-4' />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('deleteTitle')}</AlertDialogTitle>
              <AlertDialogDescription>{t('deleteDescription')}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{tCommon('cancel')}</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => handleDelete(address.id as number)}
                className='bg-red-600 hover:bg-red-700'
              >
                {tCommon('delete')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );

  const handleSetDefault = async (id: number) => {
    try {
      await setDefaultAddress.mutateAsync({ id });
      toast.success(t('defaultUpdated'));
      await queryClient.invalidateQueries({ queryKey: getGetAddressesQueryKey() });
      await queryClient.invalidateQueries({ queryKey: getGetAccountSummaryQueryKey() });
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        t('setDefaultFailed');
      toast.error(message);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteAddress.mutateAsync({ id });
      toast.success(t('deleted'));
      await queryClient.invalidateQueries({ queryKey: getGetAddressesQueryKey() });
      await queryClient.invalidateQueries({ queryKey: getGetAccountSummaryQueryKey() });
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        t('deleteFailed');
      toast.error(message);
    }
  };

  if (isLoading) {
    return <div className='animate-pulse'>{t('loading')}</div>;
  }

  if (isError) {
    return (
      <div className='rounded-2xl border p-6 text-center'>
        <p className='text-destructive'>{t('loadError')}</p>
        <Button variant='outline' className='mt-4' onClick={() => refetch()}>
          {tCommon('retry')}
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className='mb-4 flex items-center justify-between'>
        <h2 className='text-xl font-semibold'>{t('title')}</h2>
        <Button onClick={handleAddNewAddress}>
          <IconPlus className='me-2 h-4 w-4' />
          {t('addAddress')}
        </Button>
      </div>

      <AppDialog
        open={isAddressDialogOpen}
        onOpenChange={setIsAddressDialogOpen}
        title={editingAddressId ? t('editAddress') : t('addNewAddress')}
        description={t('dialogDescription')}
        size='lg'
        contentClassName='max-h-[min(72dvh,720px)] overflow-y-auto'
      >
        <form.AppForm>
          <form.Root
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className='grid grid-cols-2 gap-4'
          >
            <div className='col-span-2'>
              <Button
                type='button'
                variant='outline'
                className='w-full rounded-full sm:w-auto'
                onClick={handleOpenMapPicker}
              >
                <IconMapPin className='me-2 h-4 w-4' />
                {t('pickOnMap')}
              </Button>
            </div>
            <form.AppField name='label'>
              {(field) => (
                <field.TextField
                  label={t('labelField')}
                  placeholder={t('labelPlaceholder')}
                  className='col-span-2'
                />
              )}
            </form.AppField>
            <form.AppField name='firstName'>
              {(field) => <field.TextField label={tFields('firstName')} />}
            </form.AppField>
            <form.AppField name='lastName'>
              {(field) => <field.TextField label={tFields('lastName')} />}
            </form.AppField>
            <form.AppField name='street'>
              {(field) => <field.TextField label={t('street')} className='col-span-2' />}
            </form.AppField>
            <form.AppField name='apartment'>
              {(field) => <field.TextField label={t('apartment')} className='col-span-2' />}
            </form.AppField>
            <form.AppField name='city'>
              {(field) => <field.TextField label={t('city')} />}
            </form.AppField>
            <form.AppField name='state'>
              {(field) => <field.TextField label={t('state')} />}
            </form.AppField>
            <form.AppField name='zipCode'>
              {(field) => <field.TextField label={t('zipCode')} />}
            </form.AppField>
            <form.AppField name='phone'>
              {(field) => <field.InputPhone label={tFields('phone')} />}
            </form.AppField>
            <form.AppField name='country'>
              {(field) => <field.TextField label={t('country')} />}
            </form.AppField>
            <form.AppField name='isDefault'>
              {(field) => <field.Checkbox label={t('setAsDefault')} className='col-span-2 mt-2' />}
            </form.AppField>
            <div className='col-span-2 mt-4 flex justify-end gap-2'>
              <Button variant='outline' type='button' onClick={() => setIsAddressDialogOpen(false)}>
                {tCommon('cancel')}
              </Button>
              <form.Submit isPending={isPending} label={tCommon('saveAddress')} />
            </div>
          </form.Root>
        </form.AppForm>
      </AppDialog>

      <AddressMapPickerDialog
        open={isMapPickerOpen}
        onOpenChange={setIsMapPickerOpen}
        initialCoordinates={mapCoordinates}
        initialAddress={mapPickerSeed}
        onConfirm={applyGeocodedAddress}
      />

      {addresses.length > 0 ? (
        <div className='space-y-6'>
          {defaultShippingAddress ? (
            <div>
              <h3 className='mb-3 text-sm font-medium tracking-wide uppercase opacity-70'>
                {t('defaultShippingTitle')}
              </h3>
              {renderAddressCard(defaultShippingAddress)}
            </div>
          ) : null}

          {otherAddresses.length > 0 ? (
            <div>
              {defaultShippingAddress ? (
                <h3 className='mb-3 text-sm font-medium tracking-wide uppercase opacity-70'>
                  {t('otherAddressesTitle')}
                </h3>
              ) : null}
              <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
                {otherAddresses.map((address) => renderAddressCard(address))}
              </div>
            </div>
          ) : null}
        </div>
      ) : (
        <div className='bg-muted/50 rounded-2xl py-12 text-center'>
          <IconMapPin className='text-muted-foreground mx-auto mb-4 h-12 w-12' />
          <h3 className='mb-2 font-semibold'>{t('emptyTitle')}</h3>
          <p className='text-muted-foreground mb-4'>{t('emptyDescription')}</p>
          <Button onClick={handleAddNewAddress}>
            <IconPlus className='me-2 h-4 w-4' />
            {t('addAddress')}
          </Button>
        </div>
      )}
    </div>
  );
}
