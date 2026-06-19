'use client';

import { IconLoader2 } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
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
  mapFormToCreateProviderRequest,
  mapFormToUpdateProviderRequest,
  mapProviderToFormValues
} from '@/domains/shipping-providers/lib/provider-mapper';
import {
  shippingProviderDefaultValues,
  shippingProviderFormSchema
} from '@/domains/shipping-providers/shipping-provider.schema';
import { getGetAdminShippingProvidersQueryKey } from '@/services/-admin-shipping-providers-get';
import {
  getGetShippingProvidersIdQueryKey,
  useGetShippingProvidersId
} from '@/services/-shipping-providers-{id}-get';
import { usePutShippingProvidersId } from '@/services/-shipping-providers-{id}-put';
import { getGetShippingProvidersQueryKey } from '@/services/-shipping-providers-get';
import { usePostShippingProviders } from '@/services/-shipping-providers-post';

interface ProviderFormProps {
  providerId?: string;
  isEdit?: boolean;
}

export function ProviderForm({ isEdit = false, providerId }: ProviderFormProps) {
  const { push } = useRouter();
  const queryClient = useQueryClient();

  const { data: providerResponse, isLoading: isLoadingProvider } = useGetShippingProvidersId(
    Number(providerId),
    {
      query: {
        enabled: isEdit && Boolean(providerId)
      }
    }
  );

  const provider = providerResponse?.data;

  const { mutateAsync: createProvider, isPending: isCreating } = usePostShippingProviders({
    mutation: {
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: getGetAdminShippingProvidersQueryKey() });
        void queryClient.invalidateQueries({ queryKey: getGetShippingProvidersQueryKey() });
      }
    }
  });

  const { mutateAsync: updateProvider, isPending: isUpdating } = usePutShippingProvidersId({
    mutation: {
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: getGetAdminShippingProvidersQueryKey() });
        void queryClient.invalidateQueries({ queryKey: getGetShippingProvidersQueryKey() });
        if (provider?.id) {
          void queryClient.invalidateQueries({
            queryKey: getGetShippingProvidersIdQueryKey(provider.id)
          });
        }
      }
    }
  });

  const isPending = isCreating || isUpdating;

  const form = useAppForm({
    defaultValues: shippingProviderDefaultValues,
    validators: {
      onChange: shippingProviderFormSchema,
      onSubmit: shippingProviderFormSchema
    },
    onSubmit: async ({ value }) => {
      try {
        if (isEdit && provider?.id) {
          await updateProvider({
            id: provider.id,
            data: mapFormToUpdateProviderRequest(value)
          });
          toast.success('Shipping provider updated');
        } else {
          await createProvider({ data: mapFormToCreateProviderRequest(value) });
          toast.success('Shipping provider created');
        }

        push('/dashboard/shipping-providers');
      } catch (error) {
        toast.error(isEdit ? 'Failed to update provider' : 'Failed to create provider', {
          description: error instanceof Error ? error.message : 'Something went wrong'
        });
      }
    }
  });

  useEffect(() => {
    if (isEdit && provider?.id) {
      form.reset(mapProviderToFormValues(provider));
    }
  }, [isEdit, provider, form]);

  if (isEdit && isLoadingProvider) {
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
        <CardTitle>{isEdit ? 'Edit shipping provider' : 'Create shipping provider'}</CardTitle>
        <CardDescription>
          {isEdit
            ? 'Update carrier name, price, and availability shown at checkout.'
            : 'Add a carrier option customers can select during checkout.'}
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
                <h3 className='text-foreground text-sm font-medium'>Carrier details</h3>

                <Grid cols={1} gap={4} className='sm:grid-cols-2'>
                  <GridItem>
                    <form.AppField
                      name='name'
                      children={(field) => (
                        <field.TextField
                          label='Name'
                          placeholder='e.g. Standard Shipping'
                          required
                          detail='Shown to customers at checkout'
                        />
                      )}
                    />
                  </GridItem>

                  <GridItem>
                    <form.AppField
                      name='price'
                      children={(field) => (
                        <field.NumberField
                          label='Price'
                          min={0}
                          step={0.01}
                          required
                          detail='Flat shipping rate in store currency'
                        />
                      )}
                    />
                  </GridItem>
                </Grid>

                <form.AppField
                  name='description'
                  children={(field) => (
                    <field.TextArea
                      label='Description'
                      placeholder='Delivery timeframe or service level…'
                      rows={3}
                      description='Optional — helps customers choose a carrier'
                    />
                  )}
                />
              </Flex>

              <Separator />

              <Flex direction='column' spacing={4}>
                <h3 className='text-foreground text-sm font-medium'>Availability</h3>

                <form.AppField
                  name='is_active'
                  children={(field) => (
                    <field.Switch
                      label='Active'
                      description='Inactive providers are hidden from checkout but remain in admin'
                    />
                  )}
                />
              </Flex>

              <Separator />

              <Flex direction='row' justify='between' spacing={3} className='flex-wrap'>
                <Button
                  type='button'
                  variant='ghost'
                  onClick={() => push('/dashboard/shipping-providers')}
                >
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
                        'Create provider'
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
