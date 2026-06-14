'use client';

import { IconArrowRight, IconTag } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

import { Button, buttonVariants } from '@/components/ui/button';
import { useCountdown } from '@/hooks/useCountdown';
import { cn } from '@/lib/utils';

import { CATEGORY_IMAGES } from '../lib/home-mock-data';
import { sectionContainerClass } from '../lib/home-utils';

const PROMO_END = new Date('2026-06-30T23:59:59');
const PROMO_IMAGE = CATEGORY_IMAGES.lifestyle;

export function PromoSection() {
  const { hours, minutes, seconds } = useCountdown(PROMO_END);

  const countdownItems = [
    { value: String(hours).padStart(2, '0'), label: 'Hours' },
    { value: String(minutes).padStart(2, '0'), label: 'Min' },
    { value: String(seconds).padStart(2, '0'), label: 'Sec' }
  ];

  return (
    <section className='py-16 sm:py-20 lg:py-28'>
      <div className={sectionContainerClass}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className='border-border/60 bg-card dark:border-border/40 relative overflow-hidden rounded-2xl border shadow-sm sm:rounded-3xl dark:shadow-none'
        >
          <div className='relative grid min-h-[28rem] lg:min-h-[24rem] lg:grid-cols-2'>
            <div className='relative min-h-[14rem] lg:min-h-full'>
              <Image
                src={PROMO_IMAGE}
                alt='Curated seasonal sale collection'
                fill
                className='object-cover'
                sizes='(max-width: 1024px) 100vw, 50vw'
              />
              <div className='from-background/80 via-background/30 absolute inset-0 bg-linear-to-r to-transparent lg:hidden' />
              <div className='from-card via-card/40 absolute inset-0 bg-linear-to-t to-transparent lg:hidden' />
              <div className='from-card/90 absolute inset-0 hidden bg-linear-to-l to-transparent lg:block' />
            </div>

            <div className='bg-card text-card-foreground relative flex flex-col justify-center px-6 py-12 sm:px-10 lg:px-14 lg:py-16'>
              <div className='bg-gold/10 dark:bg-gold/15 pointer-events-none absolute -top-20 right-0 h-56 w-56 rounded-full blur-3xl' />
              <div className='bg-accent/5 dark:bg-accent/10 pointer-events-none absolute bottom-0 left-0 h-40 w-40 rounded-full blur-3xl' />

              <span className='border-gold/30 bg-surface/90 text-foreground dark:bg-muted/50 inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium backdrop-blur-sm'>
                <IconTag className='text-gold h-3.5 w-3.5' />
                Limited time
              </span>

              <h2 className='font-display text-foreground mt-5 text-3xl font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl'>
                30% off your first order
              </h2>
              <p className='text-muted-foreground mt-4 max-w-md text-sm leading-relaxed sm:text-base'>
                Join the LUXE community and unlock exclusive access to private sales, early drops,
                and member-only styling sessions. Use code{' '}
                <span className='text-gold-strong dark:text-gold font-semibold'>WELCOME30</span> at
                checkout.
              </p>

              <div className='mt-8 flex flex-wrap gap-3 sm:gap-4'>
                {countdownItems.map((item) => (
                  <div
                    key={item.label}
                    className='border-border/60 bg-muted/60 dark:bg-muted/30 min-w-[4.5rem] rounded-xl border px-4 py-3 text-center'
                  >
                    <div className='font-display text-foreground text-3xl font-semibold tabular-nums sm:text-4xl'>
                      {item.value}
                    </div>
                    <div className='text-muted-foreground text-xs tracking-widest uppercase'>
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
                    'bg-accent text-accent-foreground hover:bg-accent/90 h-12 rounded-full px-8 shadow-sm'
                  )}
                >
                  Shop the sale
                  <IconArrowRight className='ml-2 h-4 w-4' />
                </Link>
                <Button
                  variant='outline'
                  size='lg'
                  className='border-border text-foreground hover:bg-muted/70 dark:hover:bg-muted/40 h-12 rounded-full px-8'
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
