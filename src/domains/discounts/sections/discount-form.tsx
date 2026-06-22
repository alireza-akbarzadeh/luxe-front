'use client';

import { IconLoader2 } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { useAppForm } from '@/components/forms/useAppForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Flex } from '@/components/ui/flex';
import { Grid } from '@/components/ui/grid';
import { GridItem } from '@/components/ui/grid-item';
import { Separator } from '@/components/ui/separator';
import { AiGenerateButton } from '@/domains/ai/components/ai-generate-button';
import { AI_TASKS } from '@/domains/ai/lib/ai-tasks';
import { mapCouponToFormValues } from '@/domains/discounts/lib/coupon-mapper';
import { EntityWorkflowPanel } from '@/domains/workflows/components/entity-workflow-panel';
import { getGetAdminCouponsQueryKey } from '@/services/-admin-coupons-get';
import { getGetCouponsIdQueryKey, useGetCouponsId } from '@/services/-coupons-{id}-get';
import { usePutCouponsId } from '@/services/-coupons-{id}-put';
import { usePostCoupons } from '@/services/-coupons-post';

import { couponDefaultValues, couponFormSchema } from '../discount.schema';

interface DiscountFormProps {
  discountId?: string;
  isEdit?: boolean;
}

export function DiscountForm({ isEdit = false, discountId }: DiscountFormProps) {
  const { push } = useRouter();
  const queryClient = useQueryClient();
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');

  const { data: couponResponse, isLoading: isLoadingCoupon } = useGetCouponsId(Number(discountId), {
    query: { enabled: isEdit && Boolean(discountId) }
  });

  const coupon = couponResponse?.data?.coupon;

  const { mutateAsync: createCoupon, isPending: isCreating } = usePostCoupons({
    mutation: {
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: getGetAdminCouponsQueryKey() });
      }
    }
  });

  const { mutateAsync: updateCoupon, isPending: isUpdating } = usePutCouponsId({
    mutation: {
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: getGetAdminCouponsQueryKey() });
        if (coupon?.id) {
          void queryClient.invalidateQueries({
            queryKey: getGetCouponsIdQueryKey(coupon.id)
          });
        }
      }
    }
  });

  const isPending = isCreating || isUpdating;
  const editCouponId = coupon?.id;

  const form = useAppForm({
    defaultValues: couponDefaultValues,
    validators: {
      onChange: couponFormSchema,
      onSubmit: couponFormSchema
    },
    listeners: {
      onChange: ({ formApi }) => {
        const code = formApi.getFieldValue('code');
        if (code && formApi.getFieldMeta('code')?.isDirty) {
          formApi.setFieldValue('code', code.toUpperCase());
        }
        const currentDiscountType = formApi.getFieldValue('discount_type');
        setDiscountType(currentDiscountType);
      }
    },
    onSubmit: async ({ value }) => {
      try {
        const payload = {
          code: value.code.toUpperCase(),
          discount_type: value.discount_type,
          discount_value: Number(value.discount_value),
          description: value.description || undefined,
          start_date: value.start_date || '',
          end_date: value.end_date || '',
          minimum_order_amount: value.minimum_order_amount
            ? Number(value.minimum_order_amount)
            : undefined,
          max_discount_amount: value.max_discount_amount
            ? Number(value.max_discount_amount)
            : undefined,
          usage_limit: value.usage_limit ? Number(value.usage_limit) : undefined,
          is_active: value.is_active
        };

        if (isEdit && coupon?.id) {
          await updateCoupon({ id: coupon.id, data: payload });
          toast.success('Coupon updated successfully');
        } else {
          await createCoupon({ data: payload });
          toast.success('Coupon created successfully');
        }
        push('/dashboard/discounts');
      } catch (error) {
        toast.error(isEdit ? 'Failed to update coupon' : 'Failed to create coupon', {
          description: error instanceof Error ? error.message : 'Something went wrong'
        });
      }
    }
  });

  useEffect(() => {
    if (isEdit && coupon?.id) {
      const values = mapCouponToFormValues(coupon);
      form.reset(values);
      setDiscountType(values.discount_type);
    }
  }, [isEdit, coupon, form]);

  if (isEdit && isLoadingCoupon) {
    return (
      <Card>
        <CardHeader>
          <div className='bg-muted h-8 w-48 animate-pulse rounded' />
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='bg-muted h-10 w-full animate-pulse rounded' />
          <div className='bg-muted h-10 w-full animate-pulse rounded' />
        </CardContent>
      </Card>
    );
  }

  if (isEdit && !coupon?.id) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Coupon not found</CardTitle>
          <CardDescription>
            This coupon could not be loaded. It may have been deleted or you may not have access.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button type='button' variant='outline' onClick={() => push('/dashboard/discounts')}>
            Back to discounts
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {isEdit && editCouponId ? (
        <EntityWorkflowPanel
          workflowKey='coupon'
          entityId={editCouponId}
          className='mb-6'
          onTransitionSuccess={() => {
            void queryClient.invalidateQueries({
              queryKey: getGetCouponsIdQueryKey(editCouponId)
            });
            void queryClient.invalidateQueries({ queryKey: getGetAdminCouponsQueryKey() });
          }}
        />
      ) : null}

      <Card className='border-border/40 bg-card/40 backdrop-blur-2xl'>
        <CardHeader>
          <CardTitle>{isEdit ? 'Edit coupon' : 'Create coupon'}</CardTitle>
          <CardDescription>
            {isEdit
              ? 'Update coupon details. Lifecycle status is controlled by the workflow panel above.'
              : 'Create a new discount coupon. Leave inactive to start in draft, or enable to publish immediately.'}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form.AppForm>
            <form.Root
              className='md:p4 p-2'
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                void form.handleSubmit();
              }}
            >
              <Flex direction='column' spacing={6}>
                <Flex direction='column' spacing={4}>
                  <h3 className='text-foreground text-sm font-medium'>Basic information</h3>

                  <Grid cols={1} gap={4} className='sm:grid-cols-2'>
                    <GridItem>
                      <form.AppField
                        name='code'
                        children={(field) => (
                          <field.TextField
                            label='Coupon code'
                            placeholder='e.g. SUMMER20'
                            required
                            detail='Customers will enter this code at checkout'
                          />
                        )}
                      />
                    </GridItem>

                    <GridItem>
                      <form.AppField
                        name='discount_type'
                        children={(field) => (
                          <field.Select
                            description='Choose whether the discount is a percentage or a fixed amount.'
                            label='Discount type'
                            options={[
                              { label: 'Percentage (%)', value: 'percentage' },
                              { label: 'Fixed amount ($)', value: 'fixed' }
                            ]}
                            required
                          />
                        )}
                      />
                    </GridItem>
                  </Grid>

                  <Grid cols={1} gap={4} className='sm:grid-cols-2'>
                    <GridItem>
                      <form.AppField
                        name='discount_value'
                        children={(field) => (
                          <field.NumberField
                            label={
                              discountType === 'percentage'
                                ? 'Discount percentage'
                                : 'Discount amount'
                            }
                            placeholder={discountType === 'percentage' ? 'e.g. 20' : 'e.g. 10.00'}
                            required
                            detail={
                              discountType === 'percentage'
                                ? 'Percentage off (0-100)'
                                : 'Fixed amount off in your store currency'
                            }
                          />
                        )}
                      />
                    </GridItem>

                    <GridItem>
                      <form.AppField
                        name='description'
                        children={(field) => (
                          <Flex direction='column' spacing={2}>
                            <field.TextField
                              label='Description (optional)'
                              placeholder='e.g. Summer sale discount'
                              detail='Internal note or customer-facing description'
                            />
                            <form.Subscribe
                              selector={(state) => state.values}
                              children={(values) => (
                                <AiGenerateButton
                                  label='Generate copy'
                                  task={AI_TASKS.couponCopy}
                                  buildContext={() => ({
                                    discount_type: values.discount_type,
                                    value: String(values.discount_value ?? ''),
                                    min_order: values.minimum_order_amount
                                      ? String(values.minimum_order_amount)
                                      : 'none'
                                  })}
                                  onResult={(result) => {
                                    if (result.text) {
                                      field.handleChange(result.text);
                                    }
                                  }}
                                  disabled={!values.discount_value}
                                />
                              )}
                            />
                          </Flex>
                        )}
                      />
                    </GridItem>
                  </Grid>
                </Flex>

                <Separator />

                <Flex direction='column' spacing={4}>
                  <h3 className='text-foreground text-sm font-medium'>Validity & limits</h3>

                  <Grid cols={1} gap={4} className='sm:grid-cols-2'>
                    <GridItem>
                      <form.AppField
                        name='start_date'
                        children={(field) => (
                          <field.DatePicker
                            label='Start date'
                            detail='Leave empty to activate immediately'
                          />
                        )}
                      />
                    </GridItem>

                    <GridItem>
                      <form.AppField
                        name='end_date'
                        children={(field) => (
                          <field.DatePicker
                            label='End date'
                            detail='Leave empty for no expiration'
                          />
                        )}
                      />
                    </GridItem>
                  </Grid>

                  <Grid cols={1} gap={4} className='sm:grid-cols-2'>
                    <GridItem>
                      <form.AppField
                        name='minimum_order_amount'
                        children={(field) => (
                          <field.NumberField
                            label='Minimum order amount'
                            placeholder='0.00'
                            detail='Minimum cart subtotal to apply coupon (0 = no minimum)'
                          />
                        )}
                      />
                    </GridItem>

                    <GridItem>
                      <form.AppField
                        name='usage_limit'
                        children={(field) => (
                          <field.NumberField
                            label='Usage limit'
                            placeholder='Unlimited'
                            detail='Maximum number of times this coupon can be used'
                          />
                        )}
                      />
                    </GridItem>
                  </Grid>

                  {discountType === 'percentage' ? (
                    <Grid cols={1} gap={4}>
                      <GridItem>
                        <form.AppField
                          name='max_discount_amount'
                          children={(field) => (
                            <field.NumberField
                              label='Maximum discount amount'
                              placeholder='No maximum'
                              detail='Upper limit for percentage discounts (e.g., max $20 off)'
                            />
                          )}
                        />
                      </GridItem>
                    </Grid>
                  ) : null}
                </Flex>

                <Separator />

                <Flex direction='column' spacing={4}>
                  <h3 className='text-foreground text-sm font-medium'>Status</h3>

                  {isEdit ? (
                    <p className='text-muted-foreground text-sm'>
                      Lifecycle status is controlled by the workflow panel above (Draft / Active /
                      Paused / Expired / Exhausted / Archived).
                    </p>
                  ) : (
                    <form.AppField
                      name='is_active'
                      children={(field) => (
                        <field.Switch
                          label='Activate on create'
                          description='When enabled, the coupon is published immediately after creation'
                        />
                      )}
                    />
                  )}
                </Flex>

                <Separator />

                <Flex direction='row' justify='end' spacing={3}>
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
                          'Create coupon'
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
    </>
  );
}
