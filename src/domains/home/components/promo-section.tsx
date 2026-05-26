'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { IconArrowRight, IconTag } from '@tabler/icons-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { sectionContainerClass } from '../lib/home-utils';

const PROMO_END = new Date('2026-06-30T23:59:59');

function useCountdown(target: Date) {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, target.getTime() - Date.now());
      setTimeLeft({
        hours: Math.floor(diff / (1000 * 60 * 60)) % 24,
        minutes: Math.floor(diff / (1000 * 60)) % 60,
        seconds: Math.floor(diff / 1000) % 60
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  return timeLeft;
}

export function PromoSection() {
  const { hours, minutes, seconds } = useCountdown(PROMO_END);

  return (
    <section className='py-16 sm:py-20 lg:py-28'>
      <div className={sectionContainerClass}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className='border-border/60 relative overflow-hidden rounded-2xl border shadow-lg sm:rounded-3xl'
        >
          <div className='relative grid min-h-[28rem] lg:grid-cols-2 lg:min-h-[24rem]'>
            <div className='relative min-h-[14rem] lg:min-h-full'>
              <Image
                src='https://images.unsplash.com/photo-1441984904996-e0b495a6de39?w=1200&h=900&fit=crop'
                alt='Seasonal sale'
                fill
                className='object-cover'
                sizes='(max-width: 1024px) 100vw, 50vw'
              />
              <div className='from-foreground/40 absolute inset-0 bg-gradient-to-r to-transparent lg:hidden' />
            </div>

            <div className='bg-foreground text-primary-foreground relative flex flex-col justify-center px-6 py-12 sm:px-10 lg:px-14 lg:py-16'>
              <div className='bg-accent/20 pointer-events-none absolute -top-20 right-0 h-56 w-56 rounded-full blur-3xl' />

              <span className='bg-primary-foreground/10 text-primary-foreground inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-xs font-medium'>
                <IconTag className='h-3.5 w-3.5' />
                Limited time
              </span>

              <h2 className='font-display mt-5 text-3xl font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl'>
                30% off your first order
              </h2>
              <p className='text-primary-foreground/75 mt-4 max-w-md text-sm leading-relaxed sm:text-base'>
                Join the LUXE community and unlock exclusive access to private sales, early drops,
                and member-only styling sessions. Use code{' '}
                <span className='text-primary-foreground font-semibold'>WELCOME30</span> at checkout.
              </p>

              <div className='mt-8 flex flex-wrap gap-6'>
                {[
                  { value: String(hours).padStart(2, '0'), label: 'Hours' },
                  { value: String(minutes).padStart(2, '0'), label: 'Min' },
                  { value: String(seconds).padStart(2, '0'), label: 'Sec' }
                ].map((item) => (
                  <div key={item.label} className='text-center'>
                    <div className='font-display text-3xl font-semibold tabular-nums sm:text-4xl'>
                      {item.value}
                    </div>
                    <div className='text-primary-foreground/50 text-xs tracking-widest uppercase'>
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>

              <div className='mt-10 flex flex-col gap-3 sm:flex-row'>
                <Link
                  href='/shop'
                  className={cn(
                    buttonVariants({ size: 'lg' }),
                    'bg-accent text-accent-foreground hover:bg-accent/90 h-12 rounded-full px-8'
                  )}
                >
                  Shop the sale
                  <IconArrowRight className='ml-2 h-4 w-4' />
                </Link>
                <Button
                  variant='outline'
                  size='lg'
                  className='border-primary-foreground/25 text-primary-foreground hover:bg-primary-foreground/10 h-12 rounded-full px-8'
                  asChild
                >
                  <Link href='/register'>Create account</Link>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
