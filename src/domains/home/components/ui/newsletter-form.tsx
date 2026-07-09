'use client';

import { IconCircleCheck, IconLoader2 } from '@tabler/icons-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usePostNewslettersSubscribe } from '@/services/-newsletters-subscribe-post';

interface NewsletterFormProps {
  labels: {
    emailPlaceholder: string;
    emailAriaLabel: string;
    subscribe: string;
    success: string;
    privacyNote: string;
  };
  source?: 'home' | 'footer';
}

/** Client island for newsletter email capture. */
export function NewsletterForm({ labels, source = 'home' }: NewsletterFormProps) {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const { mutateAsync: subscribe, isPending } = usePostNewslettersSubscribe();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;

    try {
      await subscribe({ data: { email: trimmed, source } });
      setIsSubscribed(true);
      setEmail('');
    } catch (error) {
      toast.error('Could not subscribe', {
        description: error instanceof Error ? error.message : 'Please try again'
      });
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
      <form
        onSubmit={(e) => void handleSubmit(e)}
        className='mx-auto flex max-w-md flex-col gap-3 sm:flex-row'
      >
        <Input
          type='email'
          placeholder={labels.emailPlaceholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='bg-background/80 border-border/60 focus-visible:ring-accent h-12 rounded-full px-5 sm:h-14'
          required
          aria-label={labels.emailAriaLabel}
        />
        <Button
          type='submit'
          size='lg'
          className='group h-12 shrink-0 rounded-full px-6 sm:h-14 sm:px-8'
          disabled={isPending}
        >
          {isPending ? <IconLoader2 className='size-4 animate-spin' /> : labels.subscribe}
        </Button>
      </form>
      <p className='text-muted-foreground mt-4 text-xs'>{labels.privacyNote}</p>
    </>
  );
}
