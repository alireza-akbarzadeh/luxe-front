'use client';

import { Button } from '@/components/ui/button';
import {
  IconCheck,
  IconChevronRight,
  IconCreditCard,
  IconMapPin,
  IconPackage
} from '@tabler/icons-react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { useAppForm } from '~/src/components/forms/useAppForm';
import { useCart } from '~/src/hooks/useCartController';
import { usePostOrders } from '~/src/services/-orders-post';
import type { CheckoutFormValues } from './checkout.schema';
import { checkoutSchema } from './checkout.schema';
import { CheckoutSummary } from './components/checkout-summary';
import { CheckoutPayment } from './containers/checkout-payment';
import { CheckoutReview } from './containers/checkout-review';
import { CheckoutShipping } from './containers/checkout-shipping';

const steps = [
  { id: 1, name: 'Shipping', icon: IconMapPin },
  { id: 2, name: 'Payment', icon: IconCreditCard },
  { id: 3, name: 'Review', icon: IconPackage }
];

export const shippingMethods = [
  { id: 'standard', name: 'Standard Shipping', description: '5-7 business days', price: 0 },
  { id: 'express', name: 'Express Shipping', description: '2-3 business days', price: 15 },
  { id: 'overnight', name: 'Overnight Shipping', description: 'Next business day', price: 30 }
];

export default function CheckoutDomain() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState(1);
  const { mutate: placeOrder, isPending } = usePostOrders();

  const form = useAppForm({
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      zip: '',
      country: 'United States',
      phone: '',
      shippingMethod: 'standard' as const,
      cardNumber: '',
      cardName: '',
      expiry: '',
      cvc: '',
      saveInfo: false,
      newsletter: false,
      couponCode: ''
    },
    validators: {
      onChange: checkoutSchema as any,
      onBlur: checkoutSchema as any
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

  const handleNext = () => {
    // Define which fields belong to each step
    const stepFields: (keyof CheckoutFormValues)[][] = [
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
    const fieldsToValidate = stepFields[currentStep - 1];
    if (fieldsToValidate.length === 0) {
      // Last step: proceed to submit (handled by review step button)
      if (currentStep < 3) setCurrentStep(currentStep + 1);
      return;
    }

    const currentValues = form.getFieldValues(); // all values
    const partialSchema = checkoutSchema.pick(
      Object.fromEntries(fieldsToValidate.map((f) => [f, true]))
    );
    const result = partialSchema.safeParse(currentValues);

    if (!result.success) {
      for (const err of result.error.errors) {
        const fieldName = err.path[0] as keyof CheckoutFormValues;
        form.setFieldMeta(fieldName, (prev) => ({ ...prev, error: err.message }));
      }
      toast.error('Please fill all required fields correctly');
      return;
    }
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  if (items.length === 0) {
    return (
      <div className='bg-background min-h-screen'>
        <main className='pt-24 pb-16'>
          <div className='mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8'>
            <h1 className='mb-4 text-2xl font-bold'>Your cart is empty</h1>
            <p className='text-muted-foreground mb-8'>
              Add some items to your cart before checking out.
            </p>
            <Link href='/shop'>
              <Button size='lg' className='rounded-full'>
                Continue Shopping
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className='bg-background min-h-screen'>
      <main className='pt-24 pb-16'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          {/* Breadcrumb */}
          <nav className='text-muted-foreground mb-8 flex items-center gap-2 text-sm'>
            <Link href='/' className='hover:text-foreground transition-colors'>
              Home
            </Link>
            <IconChevronRight className='h-4 w-4' />
            <Link href='/cart' className='hover:text-foreground transition-colors'>
              Cart
            </Link>
            <IconChevronRight className='h-4 w-4' />
            <span className='text-foreground'>Checkout</span>
          </nav>

          {/* Progress steps */}
          <div className='mb-12'>
            <div className='flex items-center justify-center'>
              {steps.map((step, index) => (
                <div key={step.id} className='flex items-center'>
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center gap-2 rounded-full px-4 py-2 ${
                      currentStep === step.id
                        ? 'bg-accent text-accent-foreground'
                        : currentStep > step.id
                          ? 'bg-green-500/10 text-green-600'
                          : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {currentStep > step.id ? (
                      <IconCheck className='h-4 w-4' />
                    ) : (
                      <step.icon className='h-4 w-4' />
                    )}
                    <span className='hidden text-sm font-medium sm:block'>{step.name}</span>
                  </motion.div>
                  {index < steps.length - 1 && (
                    <div
                      className={`mx-2 h-0.5 w-12 sm:w-24 ${currentStep > step.id ? 'bg-green-500' : 'bg-border'}`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className='grid gap-8 lg:grid-cols-5 lg:gap-12'>
            <div className='lg:col-span-3'>
              <form.AppForm>
                <form.Root
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (currentStep === 3) form.handleSubmit();
                  }}
                >
                  <AnimatePresence mode='wait'>
                    {currentStep === 1 && <CheckoutShipping form={form} onNext={handleNext} />}
                    {currentStep === 2 && (
                      <CheckoutPayment form={form} onNext={handleNext} onBack={handleBack} />
                    )}
                    {currentStep === 3 && (
                      <CheckoutReview form={form} onBack={handleBack} isSubmitting={isPending} />
                    )}
                  </AnimatePresence>
                </form.Root>
              </form.AppForm>
            </div>
            <div className='lg:col-span-2'>
              <CheckoutSummary
                items={items}
                subtotal={subtotal}
                shippingMethod={form.getFieldValue('shippingMethod')}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
