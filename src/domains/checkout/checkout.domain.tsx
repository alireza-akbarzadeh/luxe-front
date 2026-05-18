'use client';

import { AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { parseAsStringLiteral, useQueryState } from 'nuqs';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { useAppForm } from '~/src/components/forms/useAppForm';
import { useCart } from '~/src/hooks/useCartController';
import { useGetAccountSummary } from '~/src/services/-account-summary-get';
import { usePostCouponsValidate } from '~/src/services/-coupons-validate-post';
import { usePostOrders } from '~/src/services/-orders-post';
import type { CheckoutFormValues } from './checkout.schema';
import { checkoutSchema } from './checkout.schema';
import { CheckoutBreadcrumb } from './components/checkout-breadcrumb';
import { CheckoutSteps, stepNames } from './components/checkout-steps';
import { CheckoutSummary } from './components/checkout-summary';
import { EmptyCheckout } from './components/empty-checkout';
import { CheckoutPayment } from './containers/checkout-payment';
import { CheckoutReview } from './containers/checkout-review';
import { CheckoutShipping } from './containers/checkout-shipping';

export default function CheckoutDomain() {
  const router = useRouter();
  const { items, clearCart } = useCart();
  const [currentStepRaw, setCurrentStep] = useQueryState<CheckoutSteps>(
    'step',
    parseAsStringLiteral(stepNames).withDefault('Shipping')
  );
  const safeStep = currentStepRaw ?? 'Shipping';
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [appliedCouponCode, setAppliedCouponCode] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const { mutate: validateCoupon } = usePostCouponsValidate();
  const { mutate: placeOrder, isPending } = usePostOrders();

  const { data: summaryData } = useGetAccountSummary();
  const defaultAddress = summaryData?.data?.default_shipping_address;
  const userEmail = summaryData?.data?.email;
  const userFirstName = summaryData?.data?.first_name;
  const userLastName = summaryData?.data?.last_name;
  const userPhone = summaryData?.data?.phone;

  const form = useAppForm({
    defaultValues: {
      email: userEmail || '',
      firstName: userFirstName || '',
      lastName: userLastName || '',
      addressLine1: defaultAddress?.address_line1 || '',
      addressLine2: defaultAddress?.address_line2 || '',
      city: defaultAddress?.city || '',
      state: defaultAddress?.state || '',
      zip: defaultAddress?.postal_code || '',
      country: defaultAddress?.country || 'United States',
      phone: userPhone || '',
      shippingMethod: 'standard',
      cardNumber: '',
      cardName: '',
      expiry: '',
      cvc: '',
      saveInfo: false,
      newsletter: false,
      couponCode: ''
    },
    validators: {
      onChange: checkoutSchema,
      onBlur: checkoutSchema
    },
    onSubmit: async ({ value }) => {
      try {
        await placeOrder({
          data: {
            email: value.email,
            first_name: value.firstName,
            last_name: value.lastName,
            address_line1: value.addressLine1,
            address_line2: value.addressLine2,
            city: value.city,
            state: value.state,
            zip: value.zip,
            country: value.country,
            phone: value.phone,
            shipping_method: value.shippingMethod,
            payment_method: 'card',
            save_info: value.saveInfo,
            newsletter: value.newsletter,
            card_last4: value.cardNumber.slice(-4),
            coupon_code: value.couponCode || undefined
          }
        });
        await clearCart();
        toast.success('Order placed successfully!');
        router.push('/order-confirmation');
      } catch (error) {
        toast.error('Failed to place order. Please try again.');
      }
    }
  });

  const currentIndex = stepNames.indexOf(safeStep);
  const isLastStep = currentIndex === stepNames.length - 1;
  const isFirstStep = currentIndex === 0;

  const stepFieldsByIndex: (keyof CheckoutFormValues)[][] = [
    [
      'email',
      'firstName',
      'lastName',
      'addressLine1',
      'city',
      'state',
      'zip',
      'phone',
      'shippingMethod'
    ],
    ['cardNumber', 'cardName', 'expiry', 'cvc'],
    []
  ];

  const handleNext = () => {
    const fieldsToValidate = stepFieldsByIndex[currentIndex];
    if (fieldsToValidate?.length === 0) {
      const steps = stepNames[currentIndex + 1];
      if (!isLastStep) setCurrentStep(steps as CheckoutSteps);
      return;
    }

    const currentValues = form.state.values;
    const missingFields = fieldsToValidate?.filter((field) => !currentValues[field]);
    if (Number(missingFields?.length) > 0) {
      missingFields?.forEach((field) => {
        form.setFieldMeta(field, (prev) => ({ ...prev, error: 'This field is required' }));
      });
      toast.error('Please fill all required fields correctly');
      return;
    }
    if (!isLastStep) setCurrentStep(stepNames[currentIndex + 1] as CheckoutSteps);
  };

  const handleBack = () => {
    if (!isFirstStep) setCurrentStep(stepNames[currentIndex - 1] as CheckoutSteps);
  };

  const subtotal = items.reduce((sum, i) => sum + (i.price ?? 0) * (i.quantity ?? 0), 0);

  const handleApplyCoupon = (code: string) => {
    if (!code) {
      setCouponDiscount(0);
      setAppliedCouponCode('');
      form.setFieldValue('couponCode', '');
      toast.info('Coupon removed');
      return;
    }
    setIsApplyingCoupon(true);
    validateCoupon(
      { data: { code, order_total: subtotal } },
      {
        onSuccess: (res) => {
          const discount = res?.data?.discount_amount || 0;
          setCouponDiscount(discount);
          setAppliedCouponCode(code);
          form.setFieldValue('couponCode', code);
          toast.success(`Coupon applied! You save $${discount.toFixed(2)}`);
        },
        onError: (err) => {
          const msg = err?.message || 'Invalid or expired coupon';
          toast.error(msg);
          setCouponDiscount(0);
          setAppliedCouponCode('');
          form.setFieldValue('couponCode', '');
        },
        onSettled: () => setIsApplyingCoupon(false)
      }
    );
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [safeStep]);

  if (items.length === 0) {
    return <EmptyCheckout />;
  }

  return (
    <div className='bg-background min-h-screen'>
      <main className='pt-24 pb-16'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <CheckoutBreadcrumb />
          <CheckoutSteps currentStep={safeStep} />

          <div className='grid gap-8 lg:grid-cols-5 lg:gap-12'>
            <div className='lg:col-span-3'>
              <form.AppForm>
                <form.Root
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (safeStep === 'Review') form.handleSubmit();
                  }}
                >
                  <AnimatePresence mode='wait'>
                    {safeStep === 'Shipping' && (
                      <CheckoutShipping form={form} onNext={handleNext} />
                    )}
                    {safeStep === 'Payment' && (
                      <CheckoutPayment
                        form={form}
                        onNext={handleNext}
                        onBack={handleBack}
                        onApplyCoupon={handleApplyCoupon}
                        isApplyingCoupon={isApplyingCoupon}
                        subtotal={subtotal}
                      />
                    )}
                    {safeStep === 'Review' && (
                      <CheckoutReview form={form} onBack={handleBack} isSubmitting={isPending} />
                    )}
                  </AnimatePresence>
                </form.Root>
              </form.AppForm>
            </div>
            <div className='lg:col-span-2'>
              <CheckoutSummary
                shippingMethod={form.getFieldValue('shippingMethod')}
                couponDiscount={couponDiscount}
                couponCode={appliedCouponCode}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
