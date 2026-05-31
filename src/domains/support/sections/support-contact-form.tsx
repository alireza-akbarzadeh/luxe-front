'use client';

import { IconArrowRight, IconCheck } from '@tabler/icons-react';
import { motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';
import { z } from 'zod';

import { useAppForm } from '@/components/forms/useAppForm';
import { Button } from '@/components/ui/button';

const contactSchema = z.object({
  name: z.string().optional(),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string(),
  orderId: z.string().optional(),
  message: z.string().min(1, 'Message is required')
});

type ContactFormValues = z.infer<typeof contactSchema>;

const subjects = ['Order help', 'Returns', 'Vendor inquiry', 'Press', 'Partnerships', 'Other'];

export function SupportContactForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const reduce = useReducedMotion();

  const form = useAppForm({
    defaultValues: {
      name: '',
      email: '',
      subject: 'Order help',
      orderId: '',
      message: ''
    } as ContactFormValues,
    validators: {
      onChange: contactSchema
    },
    onSubmit: async ({ value }) => {
      setStatus('loading');
      // Simulate API call
      await new Promise((r) => setTimeout(r, 900));
      console.log('Form submitted:', value);
      setStatus('success');
      form.reset();
      setTimeout(() => setStatus('idle'), 3500);
    }
  });

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className='border-border/60 bg-card/40 rounded-3xl border p-7 backdrop-blur md:p-9'
    >
      <form.Root
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className='space-y-5'
      >
        <div className='grid gap-5 sm:grid-cols-2'>
          <form.AppField
            name='name'
            children={(field) => <field.TextField label='Name' placeholder='Your name' />}
          />
          <form.AppField
            name='email'
            children={(field) => (
              <field.TextField label='Email *' placeholder='you@domain.com' required />
            )}
          />
        </div>

        <div className='grid gap-5 sm:grid-cols-2'>
          <form.AppField
            name='subject'
            children={(field) => (
              <field.Select
                label='Subject'
                options={subjects.map((s) => ({ label: s, value: s }))}
              />
            )}
          />
          <form.AppField
            name='orderId'
            children={(field) => (
              <field.TextField label='Order ID (optional)' placeholder='LUXE-000000' />
            )}
          />
        </div>

        <form.AppField
          name='message'
          children={(field) => (
            <field.TextArea label='Message *' placeholder='How can we help?' rows={5} required />
          )}
        />

        <div className='flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between'>
          <p className={`text-xs ${status === 'error' ? 'text-red-500' : 'text-muted-foreground'}`}>
            {status === 'error'
              ? 'Please fill in your email and message.'
              : status === 'success'
                ? 'Thanks — we’ll reply within 4 hours.'
                : 'We typically reply within 4 hours.'}
          </p>
          <form.Subscribe
            selector={(state) => [state.isSubmitting]}
            children={([isSubmitting]) => (
              <Button
                type='submit'
                disabled={isSubmitting || status === 'success'}
                className='bg-foreground text-background hover:bg-foreground/90 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium'
              >
                {status === 'success' ? (
                  <>
                    <IconCheck className='size-4' /> Sent
                  </>
                ) : status === 'loading' || isSubmitting ? (
                  <>
                    <span className='border-background/30 border-t-background size-4 animate-spin rounded-full border-2' />
                    Sending
                  </>
                ) : (
                  <>
                    Send message
                    <IconArrowRight className='size-4' />
                  </>
                )}
              </Button>
            )}
          />
        </div>
      </form.Root>
    </motion.div>
  );
}
