// app/checkout/components/checkout-shipping.tsx
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import type { CheckoutFormApi } from '../checkout.domain';

const shippingMethods = [
  { id: 'standard', name: 'Standard Shipping', description: '5-7 business days', price: 0 },
  { id: 'express', name: 'Express Shipping', description: '2-3 business days', price: 15 },
  { id: 'overnight', name: 'Overnight Shipping', description: 'Next business day', price: 30 }
];

interface CheckoutShippingProps {
  form: CheckoutFormApi;
  onNext: () => void;
}

export function CheckoutShipping({ form, onNext }: CheckoutShippingProps) {
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
        <div className='mb-8 space-y-4'>
          <h3 className='font-medium'>Contact</h3>
          <form.AppField name='email'>
            {(field) => <field.TextField label='Email' type='email' placeholder='your@email.com' />}
          </form.AppField>
          <div className='flex items-center gap-2'>
            <form.AppField name='newsletter'>
              {(field) => <field.Checkbox id='newsletter' />}
            </form.AppField>
            <Label htmlFor='newsletter' className='text-sm font-normal'>
              Email me with news and offers
            </Label>
          </div>
        </div>
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
            {(field) => <field.InputPhone label='Phone' placeholder='(555) 123-4567' />}
          </form.AppField>
        </div>
      </div>
      <div className='pt-6'>
        <h3 className='mb-4 font-medium'>Shipping Method</h3>
        <form.AppField name='shippingMethod'>
          {(field) => (
            <RadioGroup
              value={field.state.value}
              onValueChange={(val) => field.handleChange(val)}
              className='space-y-3'
            >
              {shippingMethods.map((method) => (
                <div
                  key={method.id}
                  className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-colors ${
                    field.state.value === method.id
                      ? 'border-accent bg-accent/5'
                      : 'border-border hover:border-accent/50'
                  }`}
                  onClick={() => field.handleChange(method.id)}
                >
                  <div className='flex items-center gap-3'>
                    <RadioGroupItem value={method.id} id={method.id} />
                    <div>
                      <Label htmlFor={method.id} className='cursor-pointer font-medium'>
                        {method.name}
                      </Label>
                      <p className='text-muted-foreground text-sm'>{method.description}</p>
                    </div>
                  </div>
                  <span className='font-medium'>
                    {method.price === 0 ? 'Free' : `$${method.price.toFixed(2)}`}
                  </span>
                </div>
              ))}
            </RadioGroup>
          )}
        </form.AppField>
      </div>
      <div className='flex justify-between pt-6'>
        <Link href='/cart'>
          <Button variant='ghost' className='rounded-full'>
            <IconChevronLeft className='mr-2 h-4 w-4' /> Back to Cart
          </Button>
        </Link>
        <Button onClick={onNext} className='rounded-full'>
          Continue to Payment <IconChevronRight className='ml-2 h-4 w-4' />
        </Button>
      </div>
    </motion.div>
  );
}
