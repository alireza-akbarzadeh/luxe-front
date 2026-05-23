'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  IconArrowRight,
  IconCheck,
  IconCheckbox,
  IconCopy,
  IconMail,
  IconPackage,
  IconTruck
} from '@tabler/icons-react';
import { useGetOrdersMy } from '~/src/services/-orders-my-get';

function generateOrderNumber() {
  return `LX-${Date.now().toString(36).toUpperCase()}-${Math.random()
    .toString(36)
    .substring(2, 6)
    .toUpperCase()}`;
}

export function OrderConfirmatinDomain() {
  const [orderNumber, setOrderNumber] = useState('');
  const [copied, setCopied] = useState(false);
  const { data: { data } = {} } = useGetOrdersMy()
  const orders = data?.orders

  useEffect(() => {
    setOrderNumber(generateOrderNumber());
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(orderNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const steps = [
    {
      icon: IconCheckbox,
      title: 'Order Confirmed',
      description: 'We&apos;ve received your order',
      completed: true
    },
    {
      icon: IconPackage,
      title: 'Processing',
      description: 'Your items are being prepared',
      completed: false
    },
    {
      icon: IconTruck,
      title: 'Shipped',
      description: 'On its way to you',
      completed: false
    },
    {
      icon: IconMail,
      title: 'Delivered',
      description: 'Enjoy your purchase!',
      completed: false
    }
  ];

  return (
    <div className='pt-24 pb-16'>
      <div className='mx-auto max-w-3xl px-4 sm:px-6 lg:px-8'>
        {/* Success Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: 'spring',
            stiffness: 200,
            damping: 15,
            delay: 0.2
          }}
          className='mb-8 flex justify-center'
        >
          <div className='relative'>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4 }}
              className='flex h-24 w-24 items-center justify-center rounded-full bg-green-500/10'
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6 }}
                className='flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20'
              >
                <IconCheckbox className='h-10 w-10 text-green-500' />
              </motion.div>
            </motion.div>
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className='bg-accent absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full'
            >
              <span className='text-accent-foreground text-xs font-bold'>1</span>
            </motion.div>
          </div>
        </motion.div>

        {/* Confirmation Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className='mb-12 text-center'
        >
          <h1 className='mb-4 text-3xl font-bold md:text-4xl'>Thank you for your order!</h1>
          <p className='text-muted-foreground mx-auto max-w-md text-lg'>
            Your order has been confirmed and will be shipped soon. We&apos;ve sent a confirmation
            email with all the details.
          </p>
        </motion.div>

        {/* Order Number */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className='mb-12'
        >
          <div className='bg-card border-border/50 rounded-2xl border p-6 text-center'>
            <p className='text-muted-foreground mb-2 text-sm'>Order Number</p>
            <div className='flex items-center justify-center gap-2'>
              <span className='font-mono text-2xl font-bold tracking-wider'>{orderNumber}</span>
              <Button
                variant='ghost'
                size='icon'
                className='h-8 w-8 rounded-full'
                onClick={handleCopy}
              >
                {copied ? (
                  <IconCheck className='h-4 w-4 text-green-500' />
                ) : (
                  <IconCopy className='h-4 w-4' />
                )}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Order Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className='mb-12'
        >
          <h2 className='mb-6 text-center text-lg font-semibold'>Order Progress</h2>
          <div className='relative'>
            {/* Progress Line */}
            <div className='bg-border absolute top-6 right-0 left-0 h-0.5'>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '12.5%' }}
                transition={{ delay: 1, duration: 0.5 }}
                className='h-full bg-green-500'
              />
            </div>

            {/* Steps */}
            <div className='relative grid grid-cols-4 gap-2'>
              {steps.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className='flex flex-col items-center text-center'
                >
                  <div
                    className={`mb-3 flex h-12 w-12 items-center justify-center rounded-full ${step.completed ? 'bg-green-500 text-white' : 'bg-muted text-muted-foreground'
                      }`}
                  >
                    <step.icon className='h-5 w-5' />
                  </div>
                  <p
                    className={`text-sm font-medium ${step.completed ? 'text-foreground' : 'text-muted-foreground'
                      }`}
                  >
                    {step.title}
                  </p>
                  <p className='text-muted-foreground mt-1 hidden text-xs sm:block'>
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className='mb-12 grid gap-4 sm:grid-cols-2'
        >
          <div className='bg-card border-border/50 rounded-2xl border p-6'>
            <IconMail className='text-accent mb-4 h-8 w-8' />
            <h3 className='mb-2 font-semibold'>Check Your Email</h3>
            <p className='text-muted-foreground text-sm'>
              We&apos;ve sent a confirmation email with your order details and tracking information.
            </p>
          </div>
          <div className='bg-card border-border/50 rounded-2xl border p-6'>
            <IconPackage className='text-accent mb-4 h-8 w-8' />
            <h3 className='mb-2 font-semibold'>Track Your Order</h3>
            <p className='text-muted-foreground text-sm'>
              Use your order number to track your package. You&apos;ll receive updates at each step.
            </p>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className='flex flex-col items-center justify-center gap-4 sm:flex-row'
        >
          <Link href='/shop'>
            <Button variant='outline' size='lg' className='w-full rounded-full sm:w-auto'>
              Continue Shopping
            </Button>
          </Link>
          <Link href='/'>
            <Button size='lg' className='w-full rounded-full sm:w-auto'>
              Back to Home
              <IconArrowRight className='ml-2 h-4 w-4' />
            </Button>
          </Link>
        </motion.div>

        {/* Support */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className='text-muted-foreground mt-12 text-center text-sm'
        >
          Questions about your order?{' '}
          <Link href='#' className='text-accent hover:underline'>
            Contact our support team
          </Link>
        </motion.p>
      </div>
    </div>
  );
}
