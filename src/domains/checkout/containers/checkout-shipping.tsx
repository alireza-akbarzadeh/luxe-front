'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

import { getFieldErrorMessage } from '@/components/forms/form';
import { useTypedAppFormContext } from '@/components/forms/useAppForm';
import { useAuth } from '@/components/providers/auth-provider';
import { Flex } from '@/components/ui/flex';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Typography } from '@/components/ui/typography';
import { FreeShippingProgress } from '@/domains/cart/components/free-shipping-progress';
import {
  cartMoneyClassName,
  formatCartMoney,
  getEffectiveShippingPrice
} from '@/domains/cart/lib/cart-utils';
import { CheckoutPaymentSection } from '@/domains/checkout/components/checkout-payment-section';
import { CheckoutShippingAddressBlock } from '@/domains/checkout/components/checkout-shipping-address-block';
import { useCheckoutShippingProviders } from '@/domains/checkout/hooks/use-checkout-shipping-providers';
import { checkoutDefaultValues } from '@/domains/checkout/schemas/checkout.schema';
import { cn } from '@/lib/utils';

export function CheckoutShipping() {
  const t = useTranslations('checkout.shipping');
  const form = useTypedAppFormContext({ defaultValues: checkoutDefaultValues });
  const { isAuthenticated } = useAuth();
  const { providers, isLoading, subtotal, settings, hasFreeShipping } =
    useCheckoutShippingProviders();

  return (
    <motion.div
      key='shipping'
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className='min-w-0 overflow-x-hidden'
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
            {(field) => <field.Checkbox label={t('newsletter')} id='checkout-newsletter' />}
          </form.AppField>
        </Flex>

        <CheckoutShippingAddressBlock isAuthenticated={isAuthenticated} />

        <CheckoutPaymentSection />

        <Flex direction='column' spacing={4}>
          <Typography.Text variant='small' className='font-semibold'>
            {t('shippingMethod')}
          </Typography.Text>

          <FreeShippingProgress subtotal={subtotal} />

          {isLoading ? (
            <Typography.Text variant='muted'>{t('loadingShipping')}</Typography.Text>
          ) : providers.length === 0 ? (
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
                      {providers.map((provider) => {
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
                              'flex w-full min-w-0 cursor-pointer flex-col gap-3 rounded-xl border p-3 transition-colors sm:flex-row sm:items-center sm:justify-between sm:p-4',
                              isSelected
                                ? 'border-gold bg-gold/5 ring-gold/20 ring-1'
                                : 'border-border hover:border-gold/40',
                              showError && !field.state.value && 'border-destructive/40'
                            )}
                          >
                            <Flex
                              direction='row'
                              align='start'
                              spacing={3}
                              className='min-w-0 flex-1'
                            >
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
                              className={cn(
                                cartMoneyClassName,
                                'shrink-0 font-medium sm:text-right'
                              )}
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
                        {getFieldErrorMessage(field.state.meta.errors[0]) ?? t('selectShipping')}
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
