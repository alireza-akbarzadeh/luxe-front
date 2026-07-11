import { Flex } from '@/components/ui/flex';
import { cn } from '@/lib/utils';

export type LuxeWordmarkVariant = 'compact' | 'editorial';

interface LuxeWordmarkProps {
  variant?: LuxeWordmarkVariant;
  className?: string;
}

/**
 * Bespoke monogram — two overlapping strokes forming an "L", not a generic
 * rotated square. This is the signature element: reuse it, don't dilute it
 * with other ornament shapes elsewhere in the lockup.
 */
function LuxeMonogram({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox='0 0 24 24' className={cn('shrink-0', className)}>
      <path
        d='M6 3v14a4 4 0 0 0 4 4h9'
        fill='none'
        stroke='var(--gold)'
        strokeWidth='1.4'
        strokeLinecap='round'
        strokeLinejoin='round'
        opacity='0.9'
      />
      <path
        d='M6 3v14a4 4 0 0 0 4 4h9'
        fill='none'
        stroke='var(--gold)'
        strokeWidth='1.4'
        strokeLinecap='round'
        strokeLinejoin='round'
        transform='translate(1.5 -1.5)'
        opacity='0.35'
      />
    </svg>
  );
}

function LuxeRule({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        'via-gold/50 h-px flex-1 bg-linear-to-r from-transparent to-transparent',
        className
      )}
    />
  );
}

/**
 * Typographic Luxe lockup — gold italic wordmark with a bespoke monogram.
 * `compact` for navbar; `editorial` for footer and marketing shells.
 */
export function LuxeWordmark({ variant = 'compact', className }: LuxeWordmarkProps) {
  if (variant === 'editorial') {
    return (
      <Flex
        direction='column'
        align='start'
        className={cn('group leading-none select-none', className)}
        aria-label='Luxe'
      >
        <Flex direction='row' align='center' className='mb-3 gap-2.5'>
          <LuxeRule className='w-8' />
          <LuxeMonogram className='size-3' />
          <LuxeRule className='w-8' />
        </Flex>

        <span
          className={cn(
            'font-display text-gold-gradient relative text-[2.15rem] font-semibold',
            'tracking-[0.06em] italic sm:text-[2.5rem]',
            'bg-[length:200%_100%] bg-left transition-[background-position] duration-700 ease-out',
            'group-hover:bg-right'
          )}
        >
          Luxe
        </span>

        <span className='text-gold/55 mt-2.5 text-[0.56rem] font-medium tracking-[0.5em] uppercase'>
          Curated&nbsp;living
        </span>
      </Flex>
    );
  }

  return (
    <Flex
      direction='row'
      align='center'
      className={cn('group gap-3 leading-none select-none', className)}
      aria-label='Luxe'
    >
      <LuxeMonogram className='size-4' />
      <Flex direction='column' align='start' className='gap-1.5'>
        <span
          className={cn(
            'font-display text-gold-gradient text-[1.55rem] font-semibold',
            'tracking-[0.08em] italic sm:text-[1.75rem]',
            'bg-[length:200%_100%] bg-left transition-[background-position] duration-700 ease-out',
            'group-hover:bg-right'
          )}
        >
          Luxe
        </span>
        <LuxeRule className='w-full' />
      </Flex>
    </Flex>
  );
}
