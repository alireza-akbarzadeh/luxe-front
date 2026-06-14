/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { IconCheck, IconEdit, IconMapPin, IconPlus, IconTrash } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
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
  addressToFormValues,
  EMPTY_ADDRESS_FORM_VALUES,
  formValuesToGeocodedSeed,
  mergeGeocodedAddress
} from '../address-form-utils';
import { AddressMapPickerDialog } from '../components/address-map-picker-dialog';

export function AccountAddresses() {
  const queryClient = useQueryClient();
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [isMapPickerOpen, setIsMapPickerOpen] = useState(false);
  const [mapCoordinates, setMapCoordinates] = useState<GeoCoordinates | null>(null);
  const [mapPickerSeed, setMapPickerSeed] = useState<GeocodedAddress | null>(null);
  const [dialogInitialValues, setDialogInitialValues] =
    useState<AddressFormValues>(EMPTY_ADDRESS_FORM_VALUES);
  const [editingAddressId, setEditingAddressId] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  // Fetch addresses
  const { data: addressesResponse, isLoading, isError, refetch } = useGetAddresses();
  const addresses = addressesResponse?.data?.addresses || [];

  // Mutations
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
          // Map form fields to backend DTO
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
            toast.success('Address updated');
          } else {
            await createAddress.mutateAsync({ data: payload });
            toast.success('Address added');
          }

          // Invalidate both address list and account summary (for default addresses)
          await queryClient.invalidateQueries({ queryKey: getGetAddressesQueryKey() });
          await queryClient.invalidateQueries({ queryKey: getGetAccountSummaryQueryKey() });

          setIsAddressDialogOpen(false);
          setEditingAddressId(null);
          setDialogInitialValues(EMPTY_ADDRESS_FORM_VALUES);
          form.reset();
        } catch (error: any) {
          const message = error?.response?.data?.message || 'Something went wrong';
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
    setMapPickerSeed(formValuesToGeocodedSeed(form.state.values, mapCoordinates));
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
    toast.success('Delivery location updated');
  };

  const handleEditAddress = (address: ModelsAddress) => {
    setEditingAddressId(address.id as number);
    setDialogInitialValues(addressToFormValues(address));
    setMapCoordinates(null);
    setIsAddressDialogOpen(true);
  };

  const handleSetDefault = async (id: number) => {
    try {
      await setDefaultAddress.mutateAsync({ id });
      toast.success('Default address updated');
      await queryClient.invalidateQueries({ queryKey: getGetAddressesQueryKey() });
      await queryClient.invalidateQueries({ queryKey: getGetAccountSummaryQueryKey() });
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to set default');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteAddress.mutateAsync({ id });
      toast.success('Address deleted');
      await queryClient.invalidateQueries({ queryKey: getGetAddressesQueryKey() });
      await queryClient.invalidateQueries({ queryKey: getGetAccountSummaryQueryKey() });
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to delete');
    }
  };

  if (isLoading) {
    return <div className='animate-pulse'>Loading addresses...</div>;
  }

  if (isError) {
    return (
      <div className='rounded-2xl border p-6 text-center'>
        <p className='text-destructive'>Failed to load addresses.</p>
        <Button variant='outline' className='mt-4' onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className='mb-4 flex items-center justify-between'>
        <h2 className='text-xl font-semibold'>Saved Addresses</h2>
        <Button onClick={handleAddNewAddress}>
          <IconPlus className='mr-2 h-4 w-4' />
          Add Address
        </Button>
      </div>

      <AppDialog
        open={isAddressDialogOpen}
        onOpenChange={setIsAddressDialogOpen}
        title={editingAddressId ? 'Edit Address' : 'Add New Address'}
        description='Fill in your details or pick a precise delivery point on the map.'
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
                <IconMapPin className='mr-2 h-4 w-4' />
                Pick delivery location on map
              </Button>
            </div>
            <form.AppField name='label'>
              {(field) => (
                <field.TextField
                  label='Label (e.g., Home, Work)'
                  placeholder='Home, Work, etc.'
                  className='col-span-2'
                />
              )}
            </form.AppField>
            <form.AppField name='firstName'>
              {(field) => <field.TextField label='First Name' />}
            </form.AppField>
            <form.AppField name='lastName'>
              {(field) => <field.TextField label='Last Name' />}
            </form.AppField>
            <form.AppField name='street'>
              {(field) => <field.TextField label='Street Address' className='col-span-2' />}
            </form.AppField>
            <form.AppField name='apartment'>
              {(field) => (
                <field.TextField label='Apartment, suite, etc. (optional)' className='col-span-2' />
              )}
            </form.AppField>
            <form.AppField name='city'>{(field) => <field.TextField label='City' />}</form.AppField>
            <form.AppField name='state'>
              {(field) => <field.TextField label='State' />}
            </form.AppField>
            <form.AppField name='zipCode'>
              {(field) => <field.TextField label='ZIP Code' />}
            </form.AppField>
            <form.AppField name='phone'>
              {(field) => <field.InputPhone label='Phone' />}
            </form.AppField>
            <form.AppField name='country'>
              {(field) => <field.TextField label='Country' />}
            </form.AppField>
            <form.AppField name='isDefault'>
              {(field) => (
                <field.Checkbox label='Set as default address' className='col-span-2 mt-2' />
              )}
            </form.AppField>
            <div className='col-span-2 mt-4 flex justify-end gap-2'>
              <Button variant='outline' type='button' onClick={() => setIsAddressDialogOpen(false)}>
                Cancel
              </Button>
              <form.Submit isPending={isPending} label='Save Address' />
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
        <div className='grid grid-cols-2 gap-4'>
          {addresses.map((address) => (
            <div
              key={address.id}
              className={`bg-card relative rounded-xl border p-6 ${
                address.is_default ? 'border-accent' : 'border-border'
              }`}
            >
              {address.is_default && (
                <span className='text-accent absolute top-4 right-4 flex items-center gap-1 text-xs font-medium'>
                  <IconCheck className='h-3 w-3' />
                  Default
                </span>
              )}
              <h3 className='mb-2 font-semibold'>{address.instructions || 'Address'}</h3>
              <p className='text-muted-foreground text-sm'>{address.recipient_name}</p>
              <p className='text-muted-foreground text-sm'>
                {address.address_line1}
                {address.address_line2 && `, ${address.address_line2}`}
              </p>
              <p className='text-muted-foreground text-sm'>
                {address.city}, {address.state} {address.postal_code}
              </p>
              <p className='text-muted-foreground text-sm'>{address.country}</p>
              <p className='text-muted-foreground text-sm'>{address.phone}</p>

              <div className='border-border mt-4 flex items-center gap-2 border-t pt-4'>
                <Button variant='ghost' size='sm' onClick={() => handleEditAddress(address)}>
                  <IconEdit className='mr-1 h-4 w-4' />
                  Edit
                </Button>
                {!address.is_default && (
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => handleSetDefault(address.id as number)}
                  >
                    Set Default
                  </Button>
                )}
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
                      <AlertDialogTitle>Delete Address?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete this address from
                        your account.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(address.id as number)}
                        className='bg-red-600 hover:bg-red-700'
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className='bg-muted/50 rounded-2xl py-12 text-center'>
          <IconMapPin className='text-muted-foreground mx-auto mb-4 h-12 w-12' />
          <h3 className='mb-2 font-semibold'>No saved addresses</h3>
          <p className='text-muted-foreground mb-4'>Add an address to speed up checkout</p>
          <Button onClick={handleAddNewAddress}>
            <IconPlus className='mr-2 h-4 w-4' />
            Add Address
          </Button>
        </div>
      )}
    </div>
  );
}
