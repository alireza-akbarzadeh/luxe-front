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
import {
  mapFlashDealFormToPayload,
  mapFlashDealToFormValues
} from '@/domains/promotions-admin/lib/flash-deal-mapper';
import {
  flashDealDefaultValues,
  flashDealFormSchema
} from '@/domains/promotions-admin/schemas/promotions.schema';
import { useGetAdminFlashDealsId } from '@/services/-admin-flash-deals-{id}-get';
import { usePutAdminFlashDealsId } from '@/services/-admin-flash-deals-{id}-put';
import { getGetAdminFlashDealsQueryKey } from '@/services/-admin-flash-deals-get';
import { usePostAdminFlashDeals } from '@/services/-admin-flash-deals-post';

interface FlashDealFormProps {
  dealId?: string;
  isEdit?: boolean;
}

export function FlashDealForm({ dealId, isEdit = false }: FlashDealFormProps) {
  const { push } = useRouter();
  const queryClient = useQueryClient();

  const { data: dealResponse, isLoading } = useGetAdminFlashDealsId(Number(dealId), {
    query: { enabled: isEdit && Boolean(dealId) }
  });
  const deal = dealResponse?.data?.deal;

  const { mutateAsync: createDeal, isPending: isCreating } = usePostAdminFlashDeals();
  const { mutateAsync: updateDeal, isPending: isUpdating } = usePutAdminFlashDealsId();

  const form = useAppForm({
    defaultValues: flashDealDefaultValues,
    validators: { onChange: flashDealFormSchema, onSubmit: flashDealFormSchema },
    onSubmit: async ({ value }) => {
      try {
        const payload = mapFlashDealFormToPayload(value);
        if (isEdit && deal?.id) {
          await updateDeal({ id: deal.id, data: payload });
          toast.success('Flash sale updated');
        } else {
          await createDeal({ data: payload });
          toast.success('Flash sale created');
        }
        void queryClient.invalidateQueries({ queryKey: getGetAdminFlashDealsQueryKey() });
        push('/dashboard/promotions/flash-sales');
      } catch (error) {
        toast.error('Failed to save flash sale', {
          description: error instanceof Error ? error.message : 'Something went wrong'
        });
      }
    }
  });

  useEffect(() => {
    if (isEdit && deal?.id) form.reset(mapFlashDealToFormValues(deal));
  }, [isEdit, deal, form]);

  if (isEdit && isLoading) {
    return (
      <Card>
        <CardContent className='p-6'>Loading…</CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEdit ? 'Edit flash sale' : 'Create flash sale'}</CardTitle>
        <CardDescription>Time-limited homepage promotion tied to a product.</CardDescription>
      </CardHeader>
      <CardContent>
        <form.AppForm>
          <form.Root
            onSubmit={(e) => {
              e.preventDefault();
              void form.handleSubmit();
            }}
          >
            <Flex direction='column' spacing={4}>
              <Grid cols={1} gap={4} className='sm:grid-cols-2'>
                <GridItem>
                  <form.AppField
                    name='product_id'
                    children={(field) => (
                      <field.NumberField
                        label='Product ID'
                        required
                        detail='Catalog product to promote'
                      />
                    )}
                  />
                </GridItem>
                <GridItem>
                  <form.AppField
                    name='title'
                    children={(field) => (
                      <field.TextField label='Title (optional)' placeholder='Summer flash' />
                    )}
                  />
                </GridItem>
                <GridItem>
                  <form.AppField
                    name='starts_at'
                    children={(field) => <field.DatePicker label='Start date' />}
                  />
                </GridItem>
                <GridItem>
                  <form.AppField
                    name='ends_at'
                    children={(field) => <field.DatePicker label='End date' />}
                  />
                </GridItem>
                <GridItem>
                  <form.AppField
                    name='quantity_limit'
                    children={(field) => (
                      <field.NumberField label='Quantity limit' placeholder='Unlimited' />
                    )}
                  />
                </GridItem>
                <GridItem>
                  <form.AppField
                    name='sort_order'
                    children={(field) => <field.NumberField label='Sort order' />}
                  />
                </GridItem>
                <GridItem>
                  <form.AppField
                    name='status'
                    children={(field) => (
                      <field.Select
                        label='Status'
                        options={[
                          { label: 'Draft', value: 'draft' },
                          { label: 'Active', value: 'active' },
                          { label: 'Ended', value: 'ended' }
                        ]}
                        required
                      />
                    )}
                  />
                </GridItem>
              </Grid>
              <Flex direction='row' justify='end'>
                <Button type='submit' disabled={isCreating || isUpdating}>
                  {isCreating || isUpdating ? (
                    <IconLoader2 className='size-4 animate-spin' />
                  ) : null}
                  {isEdit ? 'Save changes' : 'Create flash sale'}
                </Button>
              </Flex>
            </Flex>
          </form.Root>
        </form.AppForm>
      </CardContent>
    </Card>
  );
}
