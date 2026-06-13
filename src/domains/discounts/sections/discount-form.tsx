'use client';

import { IconLoader2 } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { useAppForm } from '@/components/forms/useAppForm';
import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Grid } from '@/components/ui/grid';
import { GridItem } from '@/components/ui/grid-item';
import { Separator } from '@/components/ui/separator';
import { useGetCouponsId } from '~/src/services/-coupons-{id}-get';
import { usePutCouponsId } from '~/src/services/-coupons-{id}-put';
import { usePostCoupons } from '~/src/services/-coupons-post';

import { couponDefaultValues, couponFormSchema } from '../discount.schema';

interface DiscountFormProps {
  discountId?: string;
  isEdit?: boolean;
}

export function DiscountForm({ isEdit = false, discountId }: DiscountFormProps) {
  const { push } = useRouter();
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');

  const { data: { data: { coupon } = {} } = {} } = useGetCouponsId(Number(discountId), {
    query: { enabled: isEdit }
  });

  const { mutateAsync: createCoupon, isPending: isCreating } = usePostCoupons();
  const { mutateAsync: updateCoupon, isPending: isUpdating } = usePutCouponsId();

  const isPending = isCreating || isUpdating;

  const form = useAppForm({
    defaultValues:
      isEdit && coupon
        ? {
            code: coupon.code ?? '',
            discount_type: coupon.discount_type ?? 'percentage',
            discount_value: coupon.discount_value ?? 0,
            description: coupon.description ?? '',
            start_date: coupon.start_date ?? '',
            end_date: coupon.end_date ?? '',
            minimum_order_amount: coupon.minimum_order_amount ?? 0,
            max_discount_amount: coupon.max_discount_amount ?? undefined,
            usage_limit: coupon.usage_limit ?? undefined,
            is_active: coupon.is_active ?? true
          }
        : couponDefaultValues,
    validators: {
      // Convert Zod schema to a function that returns errors
      onChange: (value) => {
        const result = couponFormSchema.safeParse(value);
        if (!result.success) {
          return result.error;
        }
        return undefined;
      }
    },
    listeners: {
      onChange: ({ formApi }) => {
        // Auto-uppercase code
        const code = formApi.getFieldValue('code');
        if (code && formApi.getFieldMeta('code')?.isDirty) {
          formApi.setFieldValue('code', code.toUpperCase());
        }
        // Update local discountType for conditional rendering
        const currentDiscountType = formApi.getFieldValue('discount_type');
        setDiscountType(currentDiscountType);
      }
    },
    onSubmit: async ({ value }) => {
      try {
        // Build payload matching DtoCreateCouponRequest
        const payload = {
          code: value.code.toUpperCase(),
          discount_type: value.discount_type,
          discount_value: Number(value.discount_value),
          description: value.description || undefined,
          start_date: value.start_date || '', // DTO requires string; empty means no start?
          end_date: value.end_date || '', // same
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

  return (
    <form.Root
      className='md:p4 p-2'
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
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
                    description='Choose whether the discount is a percentage  or a fixed amount.'
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
                      discountType === 'percentage' ? 'Discount percentage' : 'Discount amount'
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
                  <field.TextField
                    label='Description (optional)'
                    placeholder='e.g. Summer sale discount'
                    detail='Internal note or customer-facing description'
                  />
                )}
              />
            </GridItem>
          </Grid>
        </Flex>

        <Separator />

        <Flex direction='column' spacing={4}>
          <h3 className='text-foreground text-sm font-medium'>Validity & Limits</h3>

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
                  <field.DatePicker label='End date' detail='Leave empty for no expiration' />
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

          {discountType === 'percentage' && (
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
          )}
        </Flex>

        <Separator />

        <Flex direction='column' spacing={4}>
          <h3 className='text-foreground text-sm font-medium'>Status</h3>

          <form.AppField
            name='is_active'
            children={(field) => (
              <field.Switch
                label='Active'
                description='Active coupons can be used by customers at checkout'
              />
            )}
          />
        </Flex>

        <Separator />

        <Flex direction='row' justify='end' spacing={3}>
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting, state.isDirty]}
            children={([canSubmit, isSubmitting, isDirty]) => (
              <Button type='submit' disabled={!canSubmit || isPending || !isDirty}>
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
  );
}
