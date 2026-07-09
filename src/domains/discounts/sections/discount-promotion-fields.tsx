'use client';

import { useTypedAppFormContext } from '@/components/forms/useAppForm';
import { Flex } from '@/components/ui/flex';
import { Grid } from '@/components/ui/grid';
import { GridItem } from '@/components/ui/grid-item';
import { Typography } from '@/components/ui/typography';

import { couponCustomerSegmentAny, couponDefaultValues } from '../discount.schema';

/** Application type, BOGO settings, and eligibility conditions. */
export function DiscountPromotionFields() {
  const form = useTypedAppFormContext({ defaultValues: couponDefaultValues });

  return (
    <Flex direction='column' spacing={4}>
      <Typography.Small className='font-medium'>Promotion type</Typography.Small>

      <Grid cols={1} gap={4} className='sm:grid-cols-2'>
        <GridItem>
          <form.AppField
            name='application_type'
            children={(field) => (
              <field.Select
                label='How it applies'
                description='Code requires entry at checkout. Automatic applies the best eligible offer. BOGO uses buy/get quantities.'
                options={[
                  { label: 'Coupon code', value: 'code' },
                  { label: 'Automatic discount', value: 'automatic' },
                  { label: 'Buy X get Y (BOGO)', value: 'bogo' }
                ]}
                required
              />
            )}
          />
        </GridItem>

        <form.Subscribe
          selector={(state) => state.values.application_type}
          children={(applicationType) =>
            applicationType === 'code' ? (
              <GridItem>
                <form.AppField
                  name='code'
                  children={(field) => (
                    <field.TextField
                      label='Coupon code'
                      placeholder='e.g. SUMMER20'
                      required
                      detail='Customers enter this code at checkout'
                    />
                  )}
                />
              </GridItem>
            ) : (
              <GridItem>
                <form.AppField
                  name='code'
                  children={(field) => (
                    <field.TextField
                      label='Internal code (optional)'
                      placeholder='Auto-generated if empty'
                      detail='Used internally for automatic and BOGO promotions'
                    />
                  )}
                />
              </GridItem>
            )
          }
        />
      </Grid>

      <form.Subscribe
        selector={(state) => state.values.application_type}
        children={(applicationType) =>
          applicationType === 'bogo' ? (
            <Grid cols={1} gap={4} className='sm:grid-cols-3'>
              <GridItem>
                <form.AppField
                  name='bogo_buy_quantity'
                  children={(field) => (
                    <field.NumberField label='Buy quantity' placeholder='1' required />
                  )}
                />
              </GridItem>
              <GridItem>
                <form.AppField
                  name='bogo_get_quantity'
                  children={(field) => (
                    <field.NumberField label='Get quantity' placeholder='1' required />
                  )}
                />
              </GridItem>
              <GridItem>
                <form.AppField
                  name='bogo_get_discount_percent'
                  children={(field) => (
                    <field.NumberField
                      label='Get discount %'
                      placeholder='100'
                      detail='100 = free items'
                    />
                  )}
                />
              </GridItem>
            </Grid>
          ) : null
        }
      />

      <Typography.Small className='font-medium'>Eligibility conditions</Typography.Small>

      <Grid cols={1} gap={4} className='sm:grid-cols-2'>
        <GridItem>
          <form.AppField
            name='conditions.first_order_only'
            children={(field) => (
              <field.Switch
                label='First order only'
                description='Limit to customers who have not completed an order'
              />
            )}
          />
        </GridItem>
        <GridItem>
          <form.AppField
            name='conditions.min_item_quantity'
            children={(field) => (
              <field.NumberField
                label='Minimum cart items'
                placeholder='No minimum'
                detail='Total quantity across all cart lines'
              />
            )}
          />
        </GridItem>
        <GridItem>
          <form.AppField
            name='conditions.customer_segment'
            children={(field) => (
              <field.Select
                label='Customer segment'
                options={[
                  { label: 'Any customer', value: couponCustomerSegmentAny },
                  { label: 'VIP', value: 'vip' },
                  { label: 'Plus members', value: 'plus' },
                  { label: 'New customers', value: 'new' }
                ]}
              />
            )}
          />
        </GridItem>
        <GridItem>
          <form.AppField
            name='conditions.category_ids'
            children={(field) => (
              <field.TextField
                label='Category IDs'
                placeholder='e.g. 12, 34'
                detail='Comma-separated category IDs (optional)'
              />
            )}
          />
        </GridItem>
        <GridItem className='sm:col-span-2'>
          <form.AppField
            name='conditions.product_ids'
            children={(field) => (
              <field.TextField
                label='Product IDs'
                placeholder='e.g. 101, 205'
                detail='Comma-separated product IDs (optional)'
              />
            )}
          />
        </GridItem>
      </Grid>
    </Flex>
  );
}
