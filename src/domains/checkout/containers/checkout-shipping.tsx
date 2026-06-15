'use client';

import { motion } from 'framer-motion';

import { withForm } from '@/components/forms/useAppForm';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { FreeShippingProgress } from '@/domains/cart/components/free-shipping-progress';
import { useCartCommerceSettings } from '@/domains/cart/hooks/use-cart-commerce-settings';
import {
  cartMoneyClassName,
  formatCartMoney,
  getEffectiveShippingPrice,
  qualifiesForFreeShipping
} from '@/domains/cart/lib/cart-utils';
import { checkoutDefaultValues } from '@/domains/checkout/checkout.schema';
import { useCartController } from '@/hooks/useCartController';
import { cn } from '@/lib/utils';
import { useGetShippingProviders } from '@/services/-shipping-providers-get';
import type { ModelsShippingProviders } from '@/services/-shipping-providers-get.schemas';

export const CheckoutShipping = withForm({
  defaultValues: checkoutDefaultValues,

  render: function ShippingRender({ form }) {
    const { subtotal } = useCartController();
    const { settings } = useCartCommerceSettings();
    const { data: providersData, isLoading: isLoadingShipping } = useGetShippingProviders();
    const shippingProviders: ModelsShippingProviders[] = providersData?.data || [];
    const hasFreeShipping = qualifiesForFreeShipping(subtotal, settings.freeShippingThreshold);

    return (
      <motion.div
        key='shipping'
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className='space-y-6'
      >
        <div>
          <h2 className='mb-6 text-2xl font-bold'>Shipping Information</h2>

          {/* Contact section */}
          <div className='mb-8 space-y-4'>
            <h3 className='font-medium'>Contact</h3>
            <form.AppField name='email'>
              {(field) => (
                <field.TextField label='Email' type='email' placeholder='your@email.com' />
              )}
            </form.AppField>
            <div className='flex items-center gap-2'>
              <form.AppField name='newsletter'>
                {(field) => (
                  <field.Checkbox label='Email me with news and offers' id='newsletter' />
                )}
              </form.AppField>
            </div>
          </div>

          {/* Shipping address section */}
          <div className='space-y-4'>
            <h3 className='font-medium'>Shipping Address</h3>
            <div className='grid grid-cols-2 gap-4'>
              <form.AppField name='firstName'>
                {(field) => <field.TextField label='First Name' placeholder='John' />}
              </form.AppField>
              <form.AppField name='lastName'>
                {(field) => <field.TextField label='Last Name' placeholder='Doe' />}
              </form.AppField>
            </div>
            <form.AppField name='addressLine1'>
              {(field) => <field.TextField label='Address' placeholder='123 Main St' />}
            </form.AppField>
            <form.AppField name='addressLine2'>
              {(field) => (
                <field.TextField label='Apartment, suite, etc. (optional)' placeholder='Apt 4B' />
              )}
            </form.AppField>
            <div className='grid grid-cols-3 gap-4'>
              <form.AppField name='city'>
                {(field) => <field.TextField label='City' placeholder='New York' />}
              </form.AppField>
              <form.AppField name='state'>
                {(field) => <field.TextField label='State' placeholder='NY' />}
              </form.AppField>
              <form.AppField name='zip'>
                {(field) => <field.TextField label='ZIP Code' placeholder='10001' />}
              </form.AppField>
            </div>
            <form.AppField name='phone'>
              {(field) => <field.InputPhone label='Phone' placeholder='0938 122 3880' />}
            </form.AppField>
          </div>
        </div>

        {/* Shipping Method section */}
        <div className='pt-6'>
          <h3 className='mb-4 font-medium'>Shipping Method</h3>

          <FreeShippingProgress subtotal={subtotal} className='mb-4' />

          {isLoadingShipping ? (
            <p className='text-muted-foreground text-sm'>Loading shipping options…</p>
          ) : shippingProviders.length === 0 ? (
            <p className='text-destructive text-sm'>No shipping options are available right now.</p>
          ) : (
            <form.AppField name='shippingProviderId'>
              {(field) => {
                const showError = field.state.meta.errors.length > 0;

                return (
                  <>
                    <RadioGroup
                      value={field.state.value ? String(field.state.value) : ''}
                      onValueChange={(val) => {
                        field.handleChange(Number(val));
                        field.handleBlur();
                      }}
                      className='space-y-3'
                    >
                      {shippingProviders.map((provider) => {
                        const isSelected = field.state.value === provider.id;
                        const providerRate = provider.price ?? 0;
                        const effectivePrice = getEffectiveShippingPrice(
                          providerRate,
                          subtotal,
                          settings
                        );

                        return (
                          <Label
                            key={provider.id}
                            htmlFor={`shipping-${provider.id}`}
                            className={cn(
                              'flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-colors',
                              isSelected
                                ? 'border-accent bg-accent/5'
                                : 'border-border hover:border-accent/50',
                              showError && !field.state.value && 'border-destructive/40'
                            )}
                          >
                            <div className='flex items-center gap-3'>
                              <RadioGroupItem
                                value={String(provider.id)}
                                id={`shipping-${provider.id}`}
                              />
                              <div>
                                <div className='font-medium'>
                                  {provider.name || 'Unnamed'} Shipping
                                </div>
                                <p className='text-muted-foreground text-sm'>
                                  {provider.description}
                                </p>
                              </div>
                            </div>
                            <span className={cn('text-right font-medium', cartMoneyClassName)}>
                              {effectivePrice === 0 ? (
                                hasFreeShipping && providerRate > 0 ? (
                                  <span className='flex flex-col items-end gap-0.5'>
                                    <span className='text-muted-foreground text-xs line-through'>
                                      {formatCartMoney(providerRate)}
                                    </span>
                                    <span className='text-success'>Free</span>
                                  </span>
                                ) : (
                                  <span className='text-success'>Free</span>
                                )
                              ) : (
                                formatCartMoney(effectivePrice)
                              )}
                            </span>
                          </Label>
                        );
                      })}
                    </RadioGroup>
                    {showError && (
                      <p className='text-destructive mt-2 text-[10px] font-bold'>
                        {field.state.meta.errors[0] ?? 'Select a shipping method'}
                      </p>
                    )}
                  </>
                );
              }}
            </form.AppField>
          )}
        </div>
      </motion.div>
    );
  }
});
