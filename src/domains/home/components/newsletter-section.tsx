'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { IconArrowRight, IconCircleCheck, IconMail } from '@tabler/icons-react';
import { sectionContainerClass } from '../lib/home-utils';

export function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      setEmail('');
    }
  };

  return (
    <section className='pb-20 sm:pb-24 lg:pb-32'>
      <div className={sectionContainerClass}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className='border-border/60 from-card to-secondary/40 relative overflow-hidden rounded-2xl border bg-gradient-to-br p-8 sm:rounded-3xl sm:p-12 lg:p-16'
        >
          <div className='bg-accent/8 pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full blur-3xl' />
          <div className='bg-accent/5 pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full blur-3xl' />

          <div className='relative mx-auto max-w-2xl text-center'>
            <div className='bg-accent/10 text-accent mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full'>
              <IconMail className='h-5 w-5' />
            </div>
            <span className='text-accent text-xs font-semibold tracking-[0.2em] uppercase'>
              Stay in the loop
            </span>
            <h2 className='font-display mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl'>
              Join the LUXE insider list
            </h2>
            <p className='text-muted-foreground mt-3 text-sm leading-relaxed sm:text-base'>
              Early access to drops, styling notes, and members-only offers — no spam, unsubscribe
              anytime.
            </p>

            <div className='mt-8'>
              {isSubscribed ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className='text-accent flex items-center justify-center gap-2 font-medium'
                >
                  <IconCircleCheck className='h-5 w-5' />
                  You&apos;re on the list — welcome aboard.
                </motion.div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className='mx-auto flex max-w-md flex-col gap-3 sm:flex-row'
                >
                  <Input
                    type='email'
                    placeholder='you@email.com'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className='bg-background/80 border-border/60 focus-visible:ring-accent h-12 rounded-full px-5 sm:h-14'
                    required
                    aria-label='Email address'
                  />
                  <Button
                    type='submit'
                    size='lg'
                    className='group h-12 shrink-0 rounded-full px-6 sm:h-14 sm:px-8'
                  >
                    Subscribe
                    <IconArrowRight className='ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5' />
                  </Button>
                </form>
              )}
              <p className='text-muted-foreground mt-4 text-xs'>
                By subscribing you agree to our Privacy Policy.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
