'use client';
import { IconArrowRight, IconCheck, IconMail } from '@tabler/icons-react';
import { useState } from 'react';

import { cn } from '@/lib/utils';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setStatus('error');
      return;
    }
    setStatus('loading');
    await new Promise((r) => setTimeout(r, 900));
    setStatus('success');
    setEmail('');
    setTimeout(() => setStatus('idle'), 3500);
  }
  return (
    <div className='border-border/60 from-card via-card to-muted/40 relative overflow-hidden rounded-3xl border bg-linear-to-br p-8 md:p-12'>
      {/* Decorative orbs */}
      <div
        aria-hidden
        className='bg-accent/20 absolute -top-24 -right-24 h-72 w-72 rounded-full blur-3xl'
      />
      <div
        aria-hidden
        className='bg-accent/10 absolute -bottom-24 -left-24 h-72 w-72 rounded-full blur-3xl'
      />
      <div className='relative grid gap-8 md:grid-cols-2 md:items-center'>
        <div>
          <div className='border-border/60 bg-background/60 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium tracking-wide uppercase backdrop-blur'>
            <span className='bg-accent h-1.5 w-1.5 animate-pulse rounded-full' />
            The Luxe Edit
          </div>
          <h3 className='mt-4 text-3xl font-semibold tracking-tight md:text-4xl'>
            Get <span className='text-accent'>10% off</span> your first order
          </h3>
          <p className='text-muted-foreground mt-3 max-w-md text-sm md:text-base'>
            Join 250,000+ insiders for early access to drops, private sales, and curated edits —
            delivered weekly.
          </p>
        </div>
        <form onSubmit={handleSubmit} className='space-y-3'>
          <div
            className={cn(
              'group bg-background/70 relative flex items-center gap-2 rounded-2xl border p-2 backdrop-blur transition-all',
              status === 'error'
                ? 'border-red-500/60 ring-2 ring-red-500/20'
                : 'border-border/60 focus-within:border-accent/60 focus-within:ring-accent/20 focus-within:ring-2'
            )}
          >
            <IconMail className='text-muted-foreground ml-3 size-5 shrink-0' />
            <input
              type='email'
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status === 'error') setStatus('idle');
              }}
              placeholder='you@domain.com'
              aria-label='Email address'
              className='placeholder:text-muted-foreground flex-1 bg-transparent px-1 py-2 text-sm outline-none'
            />
            <button
              type='submit'
              disabled={status === 'loading' || status === 'success'}
              className='bg-foreground text-background inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-medium transition hover:opacity-90 disabled:opacity-60'
            >
              {status === 'success' ? (
                <>
                  <IconCheck className='size-4' />
                  Subscribed
                </>
              ) : status === 'loading' ? (
                <>
                  <span className='border-background/30 border-t-background size-4 animate-spin rounded-full border-2' />
                  Joining
                </>
              ) : (
                <>
                  Subscribe
                  <IconArrowRight className='size-4 transition-transform group-focus-within:translate-x-0.5' />
                </>
              )}
            </button>
          </div>
          <p
            className={cn('text-xs', status === 'error' ? 'text-red-500' : 'text-muted-foreground')}
          >
            {status === 'error'
              ? 'Please enter a valid email address.'
              : status === 'success'
                ? 'Welcome to the Luxe Edit. Check your inbox.'
                : 'By subscribing you agree to our Privacy Policy. Unsubscribe anytime.'}
          </p>
        </form>
      </div>
    </div>
  );
}
