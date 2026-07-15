'use client';

import { IconMail } from '@tabler/icons-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Input } from '@/components/ui/input';
import { Typography } from '@/components/ui/typography';
import { usePostNewslettersSubscribe } from '@/services/-newsletters-subscribe-post';

interface BlogNewsletterCtaProps {
  /** e.g. 'home' or 'footer' — tags where the signup came from. */
  source?: 'home' | 'footer';
}

/** Newsletter signup band shown on the blog homepage and article pages. */
export function BlogNewsletterCta({ source = 'home' }: BlogNewsletterCtaProps) {
  const [email, setEmail] = useState('');
  const subscribe = usePostNewslettersSubscribe();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const value = email.trim();
    if (!value) return;

    subscribe.mutate(
      { data: { email: value, source } },
      {
        onSuccess: () => {
          toast.success('You are subscribed. Check your inbox to confirm.');
          setEmail('');
        },
        onError: () => toast.error('Could not subscribe right now. Please try again.')
      }
    );
  };

  return (
    <section className='py-6'>
      <div className='from-accent/10 via-card to-card relative overflow-hidden rounded-3xl border bg-gradient-to-br p-8 shadow-sm md:p-12'>
        <Flex direction='column' align='center' gap={4} className='mx-auto max-w-xl text-center'>
          <span className='bg-accent/15 text-accent flex size-12 items-center justify-center rounded-full'>
            <IconMail className='size-6' />
          </span>
          <Typography.H2 className='font-display text-2xl md:text-3xl'>
            Get the best of Luxe in your inbox
          </Typography.H2>
          <Typography.Muted>
            Buying guides, reviews, and product drops — curated weekly. No spam, unsubscribe
            anytime.
          </Typography.Muted>

          <form
            onSubmit={handleSubmit}
            className='mt-2 flex w-full max-w-md flex-col gap-2 sm:flex-row'
          >
            <Input
              type='email'
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder='you@example.com'
              aria-label='Email address'
              className='h-11 flex-1 rounded-full'
            />
            <Button type='submit' disabled={subscribe.isPending} className='h-11 rounded-full px-6'>
              {subscribe.isPending ? 'Subscribing…' : 'Subscribe'}
            </Button>
          </form>
        </Flex>
      </div>
    </section>
  );
}
