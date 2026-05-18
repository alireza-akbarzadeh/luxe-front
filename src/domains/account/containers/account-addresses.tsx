'use client';

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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { IconCheck, IconEdit, IconMapPin, IconPlus, IconTrash } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

import { useAppForm } from '~/src/components/forms/useAppForm';
import { getGetAccountSummaryQueryKey } from '~/src/services/-account-summary-get';
import { getGetAddressesQueryKey, useGetAddresses } from '~/src/services/-addresses-get';
import { usePostAddresses } from '~/src/services/-addresses-post';
import { usePatchAddressesIdDefault } from '~/src/services/-addresses-{id}-default-patch';
import { useDeleteAddressesId } from '~/src/services/-addresses-{id}-delete';
import { usePutAddressesId } from '~/src/services/-addresses-{id}-put';
import { addressFormSchema } from '../account.schema';

export function AccountAddresses() {
  const queryClient = useQueryClient();
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
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
    defaultValues: {
      label: '',
      firstName: '',
      lastName: '',
      street: '',
      apartment: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States',
      phone: '',
      isDefault: false
    },
    validators: {
      onChange: addressFormSchema,
      onBlur: addressFormSchema
    },
    onSubmit: async ({ value }) => {
      startTransition(async () => {
        try {
          // Map form fields to backend DTO
          const recipientName = `${value.firstName} ${value.lastName}`.trim();
          const payload = {
            address_type: 'both', // or you can let user choose: shipping/billing/both
            recipient_name: recipientName,
            phone: value.phone,
            address_line1: value.street,
            address_line2: value.apartment || '',
            city: value.city,
            state: value.state,
            postal_code: value.zipCode,
            country: value.country,
            is_default: value.isDefault,
            instructions: value.label // store label as instructions (optional)
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
          form.reset();
        } catch (error: any) {
          const message = error?.response?.data?.message || 'Something went wrong';
          toast.error(message);
        }
      });
    }
  });

  const handleAddNewAddress = () => {
    setEditingAddressId(null);
    // Prefill first/last name from user if available (we can get from useUser or from context)
    // For simplicity, leave empty; user can fill.
    form.reset({
      label: '',
      firstName: '',
      lastName: '',
      street: '',
      apartment: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States',
      phone: '',
      isDefault: false
    });
    setIsAddressDialogOpen(true);
  };

  const handleEditAddress = (address: any) => {
    setEditingAddressId(address.id);
    // Extract first/last name from recipient_name
    const nameParts = (address.recipient_name || '').split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    form.reset({
      label: address.instructions || '',
      firstName,
      lastName,
      street: address.address_line1,
      apartment: address.address_line2 || '',
      city: address.city,
      state: address.state,
      zipCode: address.postal_code,
      country: address.country,
      phone: address.phone,
      isDefault: address.is_default
    });
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
        <Dialog open={isAddressDialogOpen} onOpenChange={setIsAddressDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNewAddress}>
              <IconPlus className='mr-2 h-4 w-4' />
              Add Address
            </Button>
          </DialogTrigger>
          <DialogContent className='max-w-lg'>
            <DialogHeader>
              <DialogTitle>{editingAddressId ? 'Edit Address' : 'Add New Address'}</DialogTitle>
            </DialogHeader>

            <form.AppForm>
              <form.Root
                onSubmit={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  form.handleSubmit();
                }}
                className='mt-4 grid grid-cols-2 gap-4'
              >
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
                    <field.TextField
                      label='Apartment, suite, etc. (optional)'
                      className='col-span-2'
                    />
                  )}
                </form.AppField>
                <form.AppField name='city'>
                  {(field) => <field.TextField label='City' />}
                </form.AppField>
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
                  <Button
                    variant='outline'
                    type='button'
                    onClick={() => setIsAddressDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <form.Submit isPending={isPending} label='Save Address' />
                </div>
              </form.Root>
            </form.AppForm>
          </DialogContent>
        </Dialog>
      </div>

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
                  <Button variant='ghost' size='sm' onClick={() => handleSetDefault(address.id)}>
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
                        onClick={() => handleDelete(address.id)}
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
