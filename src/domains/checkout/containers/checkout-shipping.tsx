'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

import { getFieldErrorMessage } from '@/components/forms/form';
import { withForm } from '@/components/forms/useAppForm';
import { Flex } from '@/components/ui/flex';
import { Grid } from '@/components/ui/grid';
import { GridItem } from '@/components/ui/grid-item';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Typography } from '@/components/ui/typography';
import { FreeShippingProgress } from '@/domains/cart/components/free-shipping-progress';
import { useCartCommerceSettings } from '@/domains/cart/hooks/use-cart-commerce-settings';
import {
  cartMoneyClassName,
  formatCartMoney,
  getEffectiveShippingPrice,
  qualifiesForFreeShipping
} from '@/domains/cart/lib/cart-utils';
import { checkoutDefaultValues } from '@/domains/checkout/checkout.schema';
import { CHECKOUT_COUNTRY_OPTIONS } from '@/domains/checkout/lib/checkout-countries';
import { useCartController } from '@/hooks/useCartController';
import { cn } from '@/lib/utils';
import { useGetShippingProviders } from '@/services/-shipping-providers-get';
import type { ModelsShippingProviders } from '@/services/-shipping-providers-get.schemas';

export const CheckoutShipping = withForm({
  defaultValues: checkoutDefaultValues,

  render: function ShippingRender({ form }) {
    const t = useTranslations('checkout.shipping');
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
      >
        <Flex direction='column' spacing={6}>
          <Flex direction='column' spacing={1}>
            <Typography.H3>{t('title')}</Typography.H3>
            <Typography.Text variant='muted'>{t('subtitle')}</Typography.Text>
          </Flex>

          <Flex direction='column' spacing={4}>
            <Typography.Text variant='small' className='font-semibold'>
              {t('contact')}
            </Typography.Text>
            <form.AppField name='email'>
              {(field) => (
                <field.TextField
                  label={t('email')}
                  type='email'
                  placeholder={t('emailPlaceholder')}
                  autoComplete='email'
                />
              )}
            </form.AppField>
            <form.AppField name='newsletter'>
              {(field) => (
                <field.Checkbox label={t('newsletter')} id='checkout-newsletter' />
              )}
            </form.AppField>
          </Flex>

          <Flex direction='column' spacing={4}>
            <Typography.Text variant='small' className='font-semibold'>
              {t('address')}
            </Typography.Text>
            <Grid template='form' gap={4}>
              <GridItem>
                <form.AppField name='firstName'>
                  {(field) => (
                    <field.TextField
                      label={t('firstName')}
                      placeholder={t('firstNamePlaceholder')}
                      autoComplete='given-name'
                    />
                  )}
                </form.AppField>
              </GridItem>
              <GridItem>
                <form.AppField name='lastName'>
                  {(field) => (
                    <field.TextField
                      label={t('lastName')}
                      placeholder={t('lastNamePlaceholder')}
                      autoComplete='family-name'
                    />
                  )}
                </form.AppField>
              </GridItem>
            </Grid>
            <form.AppField name='addressLine1'>
              {(field) => (
                <field.TextField
                  label={t('addressLine1')}
                  placeholder={t('addressLine1Placeholder')}
                  autoComplete='address-line1'
                />
              )}
            </form.AppField>
            <form.AppField name='addressLine2'>
              {(field) => (
                <field.TextField
                  label={t('addressLine2')}
                  placeholder={t('addressLine2Placeholder')}
                  autoComplete='address-line2'
                />
              )}
            </form.AppField>
            <Grid gap={4} className='grid-cols-1 sm:grid-cols-3'>
              <GridItem>
                <form.AppField name='city'>
                  {(field) => (
                    <field.TextField
                      label={t('city')}
                      placeholder={t('cityPlaceholder')}
                      autoComplete='address-level2'
                    />
                  )}
                </form.AppField>
              </GridItem>
              <GridItem>
                <form.AppField name='state'>
                  {(field) => (
                    <field.TextField
                      label={t('state')}
                      placeholder={t('statePlaceholder')}
                      autoComplete='address-level1'
                    />
                  )}
                </form.AppField>
              </GridItem>
              <GridItem>
                <form.AppField name='zip'>
                  {(field) => (
                    <field.TextField
                      label={t('zip')}
                      placeholder={t('zipPlaceholder')}
                      autoComplete='postal-code'
                    />
                  )}
                </form.AppField>
              </GridItem>
            </Grid>
            <form.AppField name='country'>
              {(field) => (
                <field.Select
                  label={t('country')}
                  options={[...CHECKOUT_COUNTRY_OPTIONS]}
                  placeholder={t('countryPlaceholder')}
                />
              )}
            </form.AppField>
            <form.AppField name='phone'>
              {(field) => (
                <field.InputPhone
                  label={t('phone')}
                  placeholder={t('phonePlaceholder')}
                  autoComplete='tel'
                />
              )}
            </form.AppField>
            <form.AppField name='saveInfo'>
              {(field) => (
                <field.Checkbox label={t('saveInfo')} id='checkout-save-info' />
              )}
            </form.AppField>
          </Flex>

          <Flex direction='column' spacing={4}>
            <Typography.Text variant='small' className='font-semibold'>
              {t('shippingMethod')}
            </Typography.Text>

            <FreeShippingProgress subtotal={subtotal} />

            {isLoadingShipping ? (
              <Typography.Text variant='muted'>{t('loadingShipping')}</Typography.Text>
            ) : shippingProviders.length === 0 ? (
              <Typography.Text variant='small' tone='destructive'>
                {t('noShipping')}
              </Typography.Text>
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
                                'flex cursor-pointer flex-col gap-3 rounded-xl border p-4 transition-colors sm:flex-row sm:items-center sm:justify-between',
                                isSelected
                                  ? 'border-accent bg-accent/5'
                                  : 'border-border hover:border-accent/50',
                                showError && !field.state.value && 'border-destructive/40'
                              )}
                            >
                              <Flex direction='row' align='start' spacing={3} className='min-w-0 flex-1'>
                                <RadioGroupItem
                                  value={String(provider.id)}
                                  id={`shipping-${provider.id}`}
                                  className='mt-1 sm:mt-0'
                                />
                                <Flex direction='column' spacing={0.5} className='min-w-0'>
                                  <Typography.Text variant='small' className='font-medium'>
                                    {provider.name || t('unnamedShipping')}
                                  </Typography.Text>
                                  {provider.description ? (
                                    <Typography.Text variant='subtle'>
                                      {provider.description}
                                    </Typography.Text>
                                  ) : null}
                                </Flex>
                              </Flex>
                              <Typography.Text
                                variant='small'
                                className={cn(cartMoneyClassName, 'shrink-0 font-medium sm:text-right')}
                              >
                                {effectivePrice === 0 ? (
                                  hasFreeShipping && providerRate > 0 ? (
                                    <Flex direction='column' align='end' spacing={0.5}>
                                      <span className='text-muted-foreground text-xs line-through'>
                                        {formatCartMoney(providerRate)}
                                      </span>
                                      <Typography.Text variant='small' tone='success'>
                                        {t('free')}
                                      </Typography.Text>
                                    </Flex>
                                  ) : (
                                    <Typography.Text variant='small' tone='success'>
                                      {t('free')}
                                    </Typography.Text>
                                  )
                                ) : (
                                  formatCartMoney(effectivePrice)
                                )}
                              </Typography.Text>
                            </Label>
                          );
                        })}
                      </RadioGroup>
                      {showError ? (
                        <Typography.Text variant='subtle' tone='destructive' className='mt-2'>
                          {getFieldErrorMessage(field.state.meta.errors[0]) ??
                            t('selectShipping')}
                        </Typography.Text>
                      ) : null}
                    </>
                  );
                }}
              </form.AppField>
            )}
          </Flex>
        </Flex>
      </motion.div>
    );
  }
});
