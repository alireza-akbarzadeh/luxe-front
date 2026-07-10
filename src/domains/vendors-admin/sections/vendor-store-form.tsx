'use client';

import { IconLoader2 } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { toast } from 'sonner';

import { useAppForm } from '@/components/forms/useAppForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Flex } from '@/components/ui/flex';
import { Grid } from '@/components/ui/grid';
import { GridItem } from '@/components/ui/grid-item';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  mapFormToCreateStoreRequest,
  mapFormToUpdateStoreRequest,
  mapStoreToFormValues
} from '@/domains/vendors-admin/lib/vendor-store-mapper';
import {
  vendorStoreDefaultValues,
  vendorStoreFormSchema
} from '@/domains/vendors-admin/schemas/vendor-store.schema';
import {
  getGetAdminStoresIdQueryKey,
  useGetAdminStoresId
} from '@/services/-admin-stores-{id}-get';
import { usePutAdminStoresId } from '@/services/-admin-stores-{id}-put';
import { getGetAdminStoresQueryKey } from '@/services/-admin-stores-get';
import { usePostAdminStores } from '@/services/-admin-stores-post';
import { getGetAdminVendorsKpisQueryKey } from '@/services/-admin-vendors-kpis-get';
import { useGetCategories } from '@/services/-categories-get';

interface VendorStoreFormProps {
  vendorId?: string;
  isEdit?: boolean;
}

export function VendorStoreForm({ isEdit = false, vendorId }: VendorStoreFormProps) {
  const { push } = useRouter();
  const queryClient = useQueryClient();

  const { data: categoriesData } = useGetCategories({ limit: 100 });

  const { data: storeResponse, isLoading: isLoadingStore } = useGetAdminStoresId(Number(vendorId), {
    query: { enabled: isEdit && Boolean(vendorId) }
  });

  const store = storeResponse?.data;

  const categoryOptions = useMemo(() => {
    const categories = categoriesData?.data?.categories ?? [];
    return categories
      .filter((category) => category.id)
      .map((category) => ({
        value: String(category.id),
        label: category.name ?? `Category ${category.id}`
      }));
  }, [categoriesData]);

  const invalidateVendorQueries = () => {
    void queryClient.invalidateQueries({ queryKey: getGetAdminStoresQueryKey() });
    void queryClient.invalidateQueries({ queryKey: getGetAdminVendorsKpisQueryKey() });
    if (store?.id) {
      void queryClient.invalidateQueries({ queryKey: getGetAdminStoresIdQueryKey(store.id) });
    }
  };

  const { mutateAsync: createStore, isPending: isCreating } = usePostAdminStores({
    mutation: { onSuccess: invalidateVendorQueries }
  });

  const { mutateAsync: updateStore, isPending: isUpdating } = usePutAdminStoresId({
    mutation: { onSuccess: invalidateVendorQueries }
  });

  const isPending = isCreating || isUpdating;

  const form = useAppForm({
    defaultValues: vendorStoreDefaultValues,
    validators: {
      onChange: vendorStoreFormSchema,
      onSubmit: vendorStoreFormSchema
    },
    onSubmit: async ({ value }) => {
      try {
        if (isEdit && store?.id) {
          await updateStore({
            id: store.id,
            data: mapFormToUpdateStoreRequest(value)
          });
          toast.success('Vendor profile updated');
          push(`/dashboard/vendors/${store.id}`);
        } else {
          const result = await createStore({ data: mapFormToCreateStoreRequest(value) });
          toast.success('Vendor created');
          const newId = result.data?.id;
          push(newId ? `/dashboard/vendors/${newId}` : '/dashboard/vendors');
        }
      } catch (error) {
        toast.error(isEdit ? 'Failed to update vendor' : 'Failed to create vendor', {
          description: error instanceof Error ? error.message : 'Something went wrong'
        });
      }
    }
  });

  useEffect(() => {
    if (isEdit && store?.id) {
      form.reset(mapStoreToFormValues(store));
    }
  }, [isEdit, store, form]);

  if (isEdit && isLoadingStore) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className='h-8 w-48' />
          <Skeleton className='h-4 w-72' />
        </CardHeader>
        <CardContent className='space-y-4'>
          <Skeleton className='h-10 w-full' />
          <Skeleton className='h-10 w-full' />
          <Skeleton className='h-24 w-full' />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className='border-border/40 bg-card/40 backdrop-blur-2xl'>
      <CardHeader>
        <CardTitle>{isEdit ? 'Edit vendor profile' : 'Create vendor'}</CardTitle>
        <CardDescription>
          {isEdit
            ? 'Update storefront details, policies, and category associations.'
            : 'Add a new marketplace vendor. Use the vendor detail page for approvals and performance.'}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form.AppForm>
          <form.Root
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              void form.handleSubmit();
            }}
          >
            <Flex direction='column' spacing={6}>
              <Flex direction='column' spacing={4}>
                <h3 className='text-foreground text-sm font-medium'>Basic information</h3>

                <form.AppField
                  name='name'
                  children={(field) => (
                    <field.TextField
                      label='Vendor name'
                      placeholder='e.g. Luxe Atelier'
                      required
                      detail='Displayed on the storefront and vendor pages'
                    />
                  )}
                />

                <form.AppField
                  name='description'
                  children={(field) => (
                    <field.TextArea
                      label='Description'
                      placeholder='Tell customers about this vendor…'
                      rows={4}
                    />
                  )}
                />

                <Grid cols={1} gap={4} className='sm:grid-cols-2'>
                  <GridItem>
                    <form.AppField
                      name='logo_url'
                      children={(field) => (
                        <field.TextField label='Logo URL' placeholder='https://…' />
                      )}
                    />
                  </GridItem>
                  <GridItem>
                    <form.AppField
                      name='banner_url'
                      children={(field) => (
                        <field.TextField label='Banner URL' placeholder='https://…' />
                      )}
                    />
                  </GridItem>
                </Grid>

                <form.AppField
                  name='location'
                  children={(field) => (
                    <field.TextField label='Location' placeholder='City, country' />
                  )}
                />
              </Flex>

              <Separator />

              <Flex direction='column' spacing={4}>
                <h3 className='text-foreground text-sm font-medium'>Policies</h3>

                <form.AppField
                  name='shipping_info'
                  children={(field) => (
                    <field.TextArea
                      label='Shipping information'
                      placeholder='Delivery times, carriers, regions…'
                      rows={3}
                    />
                  )}
                />

                <form.AppField
                  name='return_policy'
                  children={(field) => (
                    <field.TextArea
                      label='Return policy'
                      placeholder='Return window and conditions…'
                      rows={3}
                    />
                  )}
                />
              </Flex>

              <Separator />

              <Flex direction='column' spacing={4}>
                <h3 className='text-foreground text-sm font-medium'>Categories</h3>

                <form.AppField
                  name='category_ids'
                  children={(field) => (
                    <field.MultiSelect
                      label='Store categories'
                      placeholder='Select categories…'
                      detail='Helps customers discover this vendor in browse filters'
                      props={{
                        options: categoryOptions,
                        getOptionValue: (opt) => opt.value,
                        getOptionLabel: (opt) => opt.label
                      }}
                    />
                  )}
                />
              </Flex>

              {isEdit ? (
                <>
                  <Separator />
                  <Flex direction='column' spacing={4}>
                    <h3 className='text-foreground text-sm font-medium'>Trust</h3>
                    <form.AppField
                      name='is_verified'
                      children={(field) => (
                        <field.Switch
                          label='Verified vendor'
                          description='Shows a verified badge on the storefront'
                        />
                      )}
                    />
                  </Flex>
                </>
              ) : null}

              <Separator />

              <Flex direction='row' justify='between' spacing={3} className='flex-wrap'>
                <Button type='button' variant='ghost' onClick={() => push('/dashboard/vendors')}>
                  Cancel
                </Button>

                <form.Subscribe
                  selector={(state) => [state.canSubmit, state.isSubmitting, state.isDirty]}
                  children={([canSubmit, isSubmitting, isDirty]) => (
                    <Button
                      type='submit'
                      disabled={!canSubmit || isPending || (!isDirty && isEdit)}
                    >
                      {isPending || isSubmitting ? (
                        <>
                          <IconLoader2 className='size-4 animate-spin' />
                          {isEdit ? 'Saving…' : 'Creating…'}
                        </>
                      ) : isEdit ? (
                        'Save changes'
                      ) : (
                        'Create vendor'
                      )}
                    </Button>
                  )}
                />
              </Flex>
            </Flex>
          </form.Root>
        </form.AppForm>
      </CardContent>
    </Card>
  );
}
