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
import { Skeleton } from '@/components/ui/skeleton';
import { useInvalidateCalendar } from '@/domains/store-calendar/hooks/use-invalidate-calendar';
import {
  mapFormToCreateHolidayRequest,
  mapFormToUpdateHolidayRequest,
  mapHolidayToFormValues
} from '@/domains/store-calendar/lib/holiday-mapper';
import {
  HOLIDAY_APPLY_TO_OPTIONS,
  HOLIDAY_TYPE_OPTIONS,
  holidayDefaultValues,
  holidayFormSchema
} from '@/domains/store-calendar/schemas/holiday-schema';
import { getGetAdminCalendarHolidaysIdQueryKey, useGetAdminCalendarHolidaysId } from '@/services/-admin-calendar-holidays-{id}-get';
import { usePutAdminCalendarHolidaysId } from '@/services/-admin-calendar-holidays-{id}-put';
import { usePostAdminCalendarHolidays } from '@/services/-admin-calendar-holidays-post';
import { useGetAdminStores } from '@/services/-admin-stores-get';

interface HolidayFormProps {
  holidayId?: string;
  isEdit?: boolean;
  defaultDate?: string;
}

/** Create / edit form for a store holiday — draft or publish, single or recurring. */
export function HolidayForm({ isEdit = false, holidayId, defaultDate }: HolidayFormProps) {
  const { push } = useRouter();
  const queryClient = useQueryClient();
  const invalidateCalendar = useInvalidateCalendar();

  const { data: { data: holiday } = {}, isLoading: isLoadingHoliday } = useGetAdminCalendarHolidaysId(
    Number(holidayId),
    { query: { enabled: isEdit && Boolean(holidayId) } }
  );

  const { data: storesData } = useGetAdminStores({ limit: 100, sort_by: 'newest' });
  const storeOptions = (storesData?.data?.stores ?? []).map((store) => ({
    value: String(store.id),
    label: store.name || `Store #${store.id}`
  }));

  const { mutateAsync: createHoliday, isPending: isCreating } = usePostAdminCalendarHolidays({
    mutation: { onSuccess: () => invalidateCalendar() }
  });

  const { mutateAsync: updateHoliday, isPending: isUpdating } = usePutAdminCalendarHolidaysId({
    mutation: {
      onSuccess: () => {
        invalidateCalendar();
        if (holiday?.id) {
          void queryClient.invalidateQueries({
            queryKey: getGetAdminCalendarHolidaysIdQueryKey(holiday.id)
          });
        }
      }
    }
  });

  const isPending = isCreating || isUpdating;

  const form = useAppForm({
    defaultValues: { ...holidayDefaultValues, start_date: defaultDate ?? '', end_date: defaultDate ?? '' },
    validators: { onSubmit: holidayFormSchema },
    onSubmit: async ({ value }) => {
      try {
        if (isEdit && holiday?.id) {
          await updateHoliday({ id: holiday.id, data: mapFormToUpdateHolidayRequest(value) });
          toast.success('Holiday updated');
        } else {
          await createHoliday({ data: mapFormToCreateHolidayRequest(value) });
          toast.success('Holiday created');
        }
        push('/dashboard/calendar/holidays');
      } catch (error) {
        toast.error(isEdit ? 'Failed to update holiday' : 'Failed to create holiday', {
          description: error instanceof Error ? error.message : 'Something went wrong'
        });
      }
    }
  });

  useEffect(() => {
    if (isEdit && holiday) {
      form.reset(mapHolidayToFormValues(holiday));
    }
  }, [isEdit, holiday, form]);

  const submitWithStatus = (status: 'draft' | 'published') => {
    form.setFieldValue('status', status);
    void form.handleSubmit();
  };

  if (isEdit && isLoadingHoliday) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className='h-7 w-48' />
        </CardHeader>
        <CardContent>
          <Skeleton className='h-96 w-full' />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEdit ? 'Edit holiday' : 'Create holiday'}</CardTitle>
        <CardDescription>
          Holidays close stores or vendors for a date range and drive delivery date rules.
        </CardDescription>
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
            <Flex direction='column' spacing={6}>
              <Grid cols={1} gap={4} className='sm:grid-cols-2'>
                <GridItem className='sm:col-span-2'>
                  <form.AppField
                    name='name'
                    children={(field) => (
                      <field.TextField label='Holiday name' placeholder='New Year’s Day' required />
                    )}
                  />
                </GridItem>
                <GridItem className='sm:col-span-2'>
                  <form.AppField
                    name='description'
                    children={(field) => (
                      <field.TextArea label='Description' placeholder='Optional details' rows={2} />
                    )}
                  />
                </GridItem>

                <GridItem>
                  <form.AppField
                    name='holiday_type'
                    children={(field) => (
                      <field.Select label='Holiday type' options={[...HOLIDAY_TYPE_OPTIONS]} required />
                    )}
                  />
                </GridItem>
                <GridItem>
                  <form.AppField
                    name='apply_to'
                    children={(field) => (
                      <field.Select label='Apply to' options={[...HOLIDAY_APPLY_TO_OPTIONS]} required />
                    )}
                  />
                </GridItem>

                <GridItem>
                  <form.AppField
                    name='start_date'
                          children={(field) => <field.DatePicker label='Start date' />}
                  />
                </GridItem>
                <GridItem>
                  <form.AppField
                    name='end_date'
                          children={(field) => <field.DatePicker label='End date' />}
                  />
                </GridItem>

                <form.Subscribe
                  selector={(state) => state.values.apply_to}
                  children={(applyTo) => (
                    <>
                      {applyTo === 'stores' && (
                        <GridItem className='sm:col-span-2'>
                          <form.AppField
                            name='store_ids'
                            children={(field) => (
                              <field.MultiSelect
                                label='Stores'
                                placeholder='Select stores…'
                                props={{
                                  options: storeOptions,
                                  getOptionValue: (opt) => opt.value,
                                  getOptionLabel: (opt) => opt.label
                                }}
                              />
                            )}
                          />
                        </GridItem>
                      )}
                      {applyTo === 'vendor' && (
                        <GridItem>
                          <form.AppField
                            name='vendor_id'
                            children={(field) => <field.TextField label='Vendor ID' placeholder='42' />}
                          />
                        </GridItem>
                      )}
                      {applyTo === 'region' && (
                        <GridItem>
                          <form.AppField
                            name='region'
                            children={(field) => (
                              <field.TextField label='Region' placeholder='North' />
                            )}
                          />
                        </GridItem>
                      )}
                    </>
                  )}
                />

                <GridItem>
                  <form.AppField
                    name='priority'
                    children={(field) => (
                      <field.NumberField label='Priority' placeholder='0' min={0} />
                    )}
                  />
                </GridItem>
                <GridItem>
                  <form.AppField
                    name='is_recurring'
                    children={(field) => <field.Switch label='Recurring every year' />}
                  />
                </GridItem>

                <GridItem className='sm:col-span-2'>
                  <form.AppField
                    name='notes'
                    children={(field) => (
                      <field.TextArea label='Internal notes' rows={2} />
                    )}
                  />
                </GridItem>
              </Grid>

              <Flex direction='row' justify='end' spacing={2} wrap='wrap'>
                <Button
                  type='button'
                  variant='outline'
                  disabled={isPending}
                  onClick={() => push('/dashboard/calendar/holidays')}
                >
                  Cancel
                </Button>
                <Button
                  type='button'
                  variant='outline'
                  disabled={isPending}
                  onClick={() => submitWithStatus('draft')}
                >
                  {isPending ? <IconLoader2 className='size-4 animate-spin' /> : null}
                  Save as draft
                </Button>
                <Button type='button' disabled={isPending} onClick={() => submitWithStatus('published')}>
                  {isPending ? <IconLoader2 className='size-4 animate-spin' /> : null}
                  Save &amp; publish
                </Button>
              </Flex>
            </Flex>
          </form.Root>
        </form.AppForm>
      </CardContent>
    </Card>
  );
}
