import { Flex } from '@/components/ui/flex';
import { cn } from '@/lib/utils';

export type LuxeWordmarkVariant = 'compact' | 'editorial';

interface LuxeWordmarkProps {
  variant?: LuxeWordmarkVariant;
  className?: string;
}

function LuxeDiamond({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        'border-gold/70 bg-gold/15 inline-block rotate-45 border shadow-[0_0_12px_color-mix(in_oklab,var(--gold)_35%,transparent)]',
        className
      )}
    />
  );
}

function LuxeOrnament({ className }: { className?: string }) {
  return (
    <Flex direction='row' align='center' className={cn('gap-2', className)}>
      <span
        aria-hidden
        className='via-gold/60 h-px flex-1 bg-linear-to-r from-transparent to-transparent'
      />
      <LuxeDiamond className='size-1.5 shrink-0' />
      <span
        aria-hidden
        className='via-gold/60 h-px flex-1 bg-linear-to-l from-transparent to-transparent'
      />
    </Flex>
  );
}

/**
 * Typographic Luxe lockup — gold italic wordmark with diamond ornament.
 * `compact` for navbar; `editorial` for footer and marketing shells.
 */
export function LuxeWordmark({ variant = 'compact', className }: LuxeWordmarkProps) {
  if (variant === 'editorial') {
    return (
      <Flex
        direction='column'
        align='start'
        className={cn('leading-none select-none', className)}
        aria-label='Luxe'
      >
        <LuxeOrnament className='mb-2 w-20 sm:w-24' />
        <span className='font-display text-gold-gradient text-[2rem] font-semibold tracking-[0.08em] italic sm:text-[2.35rem]'>
          Luxe
        </span>
        <span className='text-gold/60 mt-2 text-[0.58rem] font-medium tracking-[0.42em] uppercase'>
          Curated living
        </span>
      </Flex>
    );
  }

  return (
    <Flex
      direction='row'
      align='center'
      className={cn('gap-2.5 leading-none select-none', className)}
      aria-label='Luxe'
    >
      <LuxeDiamond className='size-2 shrink-0' />
      <Flex direction='column' align='start' className='gap-1'>
        <span className='font-display text-gold-gradient text-[1.65rem] font-semibold tracking-[0.1em] italic sm:text-[1.85rem]'>
          Luxe
        </span>
        <span
          aria-hidden
          className='via-gold/50 h-px w-full bg-linear-to-r from-transparent to-transparent'
        />
      </Flex>
    </Flex>
  );
}
