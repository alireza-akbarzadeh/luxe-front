'use client';

import { IconArrowRight, IconCircleCheck } from '@tabler/icons-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface NewsletterFormProps {
  labels: {
    emailPlaceholder: string;
    emailAriaLabel: string;
    subscribe: string;
    success: string;
    privacyNote: string;
  };
}

/** Client island for newsletter email capture (form state only). */
export function NewsletterForm({ labels }: NewsletterFormProps) {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      setEmail('');
    }
  };

  if (isSubscribed) {
    return (
      <div className='text-accent flex items-center justify-center gap-2 font-medium'>
        <IconCircleCheck className='h-5 w-5' />
        {labels.success}
      </div>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit} className='mx-auto flex max-w-md flex-col gap-3 sm:flex-row'>
        <Input
          type='email'
          placeholder={labels.emailPlaceholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='bg-background/80 border-border/60 focus-visible:ring-accent h-12 rounded-full px-5 sm:h-14'
          required
          aria-label={labels.emailAriaLabel}
        />
        <Button type='submit' size='lg' className='group h-12 shrink-0 rounded-full px-6 sm:h-14 sm:px-8'>
          {labels.subscribe}
          <IconArrowRight className='cn-rtl-flip ms-2 h-4 w-4 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5' />
        </Button>
      </form>
      <p className='text-muted-foreground mt-4 text-xs'>{labels.privacyNote}</p>
    </>
  );
}
