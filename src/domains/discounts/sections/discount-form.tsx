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
import { Typography } from '@/components/ui/typography';
import { AiGenerateButton } from '@/domains/ai/components/ai-generate-button';
import { AI_TASKS } from '@/domains/ai/lib/ai-tasks';
import { mapCouponToFormValues } from '@/domains/discounts/lib/coupon-mapper';
import { mapCouponFormToPayload } from '@/domains/discounts/lib/coupon-payload';
import { DiscountPromotionFields } from '@/domains/discounts/sections/discount-promotion-fields';
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
      }
    },
    onSubmit: async ({ value }) => {
      try {
        const payload = mapCouponFormToPayload(value);

        if (isEdit && coupon?.id) {
          await updateCoupon({ id: coupon.id, data: payload });
          toast.success('Promotion updated successfully');
        } else {
          await createCoupon({ data: payload });
          toast.success('Promotion created successfully');
        }
        push('/dashboard/discounts');
      } catch (error) {
        toast.error(isEdit ? 'Failed to update promotion' : 'Failed to create promotion', {
          description: error instanceof Error ? error.message : 'Something went wrong'
        });
      }
    }
  });

  useEffect(() => {
    if (isEdit && coupon?.id) {
      form.reset(mapCouponToFormValues(coupon));
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
          <CardTitle>Promotion not found</CardTitle>
          <CardDescription>
            This promotion could not be loaded. It may have been deleted or you may not have access.
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
          <CardTitle>{isEdit ? 'Edit promotion' : 'Create promotion'}</CardTitle>
          <CardDescription>
            {isEdit
              ? 'Update promotion details. Lifecycle status is controlled by the workflow panel above.'
              : 'Create a coupon code, automatic discount, or BOGO offer with optional eligibility rules.'}
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
                <DiscountPromotionFields />

                <Separator />

                <Flex direction='column' spacing={4}>
                  <Typography.Small className='font-medium'>Discount value</Typography.Small>

                  <form.Subscribe
                    selector={(state) => state.values.application_type}
                    children={(applicationType) =>
                      applicationType === 'bogo' ? (
                        <Typography.Muted className='text-sm'>
                          BOGO savings are calculated from buy/get quantities above. Discount type
                          is not used for BOGO promotions.
                        </Typography.Muted>
                      ) : (
                        <Grid cols={1} gap={4} className='sm:grid-cols-2'>
                          <GridItem>
                            <form.AppField
                              name='discount_type'
                              children={(field) => (
                                <field.Select
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
                          <form.Subscribe
                            selector={(state) => state.values.discount_type}
                            children={(discountType) => (
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
                                      required
                                    />
                                  )}
                                />
                              </GridItem>
                            )}
                          />
                        </Grid>
                      )
                    }
                  />

                  <form.AppField
                    name='description'
                    children={(field) => (
                      <Flex direction='column' spacing={2}>
                        <field.TextField
                          label='Description (optional)'
                          placeholder='e.g. Summer sale discount'
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
                                if (result.text) field.handleChange(result.text);
                              }}
                              disabled={!values.discount_value}
                            />
                          )}
                        />
                      </Flex>
                    )}
                  />

                  <form.Subscribe
                    selector={(state) => state.values.discount_type}
                    children={(discountType) =>
                      discountType === 'percentage' ? (
                        <form.AppField
                          name='max_discount_amount'
                          children={(field) => (
                            <field.NumberField
                              label='Maximum discount amount'
                              placeholder='No maximum'
                            />
                          )}
                        />
                      ) : null
                    }
                  />
                </Flex>

                <Separator />

                <Flex direction='column' spacing={4}>
                  <Typography.Small className='font-medium'>Schedule & limits</Typography.Small>

                  <Grid cols={1} gap={4} className='sm:grid-cols-2'>
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
                    <GridItem>
                      <form.AppField
                        name='minimum_order_amount'
                        children={(field) => (
                          <field.NumberField label='Minimum order amount' placeholder='0.00' />
                        )}
                      />
                    </GridItem>
                    <GridItem>
                      <form.AppField
                        name='usage_limit'
                        children={(field) => (
                          <field.NumberField label='Usage limit' placeholder='Unlimited' />
                        )}
                      />
                    </GridItem>
                  </Grid>
                </Flex>

                <Separator />

                <Flex direction='column' spacing={4}>
                  <Typography.Small className='font-medium'>Status</Typography.Small>

                  {isEdit ? (
                    <Typography.Muted className='text-sm'>
                      Lifecycle status is controlled by the workflow panel above.
                    </Typography.Muted>
                  ) : (
                    <form.AppField
                      name='is_active'
                      children={(field) => (
                        <field.Switch
                          label='Activate on create'
                          description='Publish immediately after creation'
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
                          'Create promotion'
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
