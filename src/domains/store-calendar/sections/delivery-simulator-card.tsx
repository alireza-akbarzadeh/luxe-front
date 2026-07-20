'use client';

import { IconLoader2, IconTruckDelivery } from '@tabler/icons-react';
import { toast } from 'sonner';

import { useAppForm } from '@/components/forms/useAppForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Flex } from '@/components/ui/flex';
import {
  deliverySimulateDefaultValues,
  deliverySimulateFormSchema,
  SHIPPING_METHOD_OPTIONS
} from '@/domains/store-calendar/schemas/delivery-simulate-schema';
import { usePostAdminCalendarSimulate } from '@/services/-admin-calendar-simulate-post';
import type { DtoSimulateDeliveryResponse } from '@/services/-admin-calendar-simulate-post.schemas';
import { useGetAdminStores } from '@/services/-admin-stores-get';

interface DeliverySimulatorCardProps {
  onResult: (result: DtoSimulateDeliveryResponse | undefined) => void;
}

/** Runs `/admin/calendar/simulate` against a store/vendor/date and reports the outcome upward. */
export function DeliverySimulatorCard({ onResult }: DeliverySimulatorCardProps) {
  const { mutateAsync: simulate, isPending } = usePostAdminCalendarSimulate();
  const { data: storesData } = useGetAdminStores({ limit: 100, sort_by: 'newest' });
  const storeOptions = (storesData?.data?.stores ?? []).map((store) => ({
    label: store.name || `Store #${store.id}`,
    value: String(store.id)
  }));

  const form = useAppForm({
    defaultValues: deliverySimulateDefaultValues,
    validators: { onSubmit: deliverySimulateFormSchema },
    onSubmit: async ({ value }) => {
      try {
        const response = await simulate({
          data: {
            store_id: Number(value.store_id),
            vendor_id: value.vendor_id ? Number(value.vendor_id) : undefined,
            city: value.city || undefined,
            region: value.region || undefined,
            order_date: value.order_date,
            shipping_method: value.shipping_method,
            shipping_days: value.shipping_days ?? undefined
          }
        });
        onResult(response.data);
        toast.success('Delivery simulation complete');
      } catch (error) {
        toast.error('Simulation failed', {
          description: error instanceof Error ? error.message : 'Something went wrong'
        });
      }
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Delivery Simulation</CardTitle>
        <CardDescription>Estimate the earliest delivery date for an order.</CardDescription>
      </CardHeader>
      <CardContent>
        <form.AppForm>
          <form.Root
            onSubmit={(event) => {
              event.preventDefault();
              event.stopPropagation();
              void form.handleSubmit();
            }}
          >
            <Flex direction='column' spacing={3}>
              <form.AppField
                name='store_id'
                children={(field) => (
                  <field.Select
                    label='Store'
                    placeholder='Select a store'
                    options={storeOptions}
                    required
                  />
                )}
              />

              <form.AppField
                name='vendor_id'
                children={(field) => <field.TextField label='Vendor ID' placeholder='Optional' />}
              />

              <Flex direction='row' spacing={3}>
                <form.AppField
                  name='city'
                  children={(field) => <field.TextField label='City' placeholder='Optional' />}
                />
                <form.AppField
                  name='shipping_method'
                  children={(field) => (
                    <field.Select label='method' options={[...SHIPPING_METHOD_OPTIONS]} required />
                  )}
                />
              </Flex>

              <form.AppField
                name='order_date'
                children={(field) => <field.DatePicker label='Order date' />}
              />

              <Button type='submit' disabled={isPending} className='mt-1'>
                {isPending ? (
                  <IconLoader2 className='size-4 animate-spin' />
                ) : (
                  <IconTruckDelivery className='size-4' />
                )}
                Simulate delivery
              </Button>
            </Flex>
          </form.Root>
        </form.AppForm>
      </CardContent>
    </Card>
  );
}
