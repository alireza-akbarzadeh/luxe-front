'use client';

import React, { useEffect, useState, useSyncExternalStore } from 'react';

import { cn } from '@/lib/utils';

function subscribeReducedMotionMq(onStoreChange: () => void) {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  mq.addEventListener('change', onStoreChange);
  return () => mq.removeEventListener('change', onStoreChange);
}

function getReducedMotionSnapshot() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

export const InfiniteMovingCards = ({
  items,
  direction = 'left',
  speed = 'fast',
  pauseOnHover = true,
  variant = 'testimonial',
  className
}: {
  items: {
    quote: string;
    name: string;
    title: string;
  }[];
  direction?: 'left' | 'right';
  speed?: 'fast' | 'normal' | 'slow';
  pauseOnHover?: boolean;
  variant?: 'testimonial' | 'brand';
  className?: string;
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLUListElement>(null);
  const [start, setStart] = useState(false);
  const reduceMotion = useSyncExternalStore(
    subscribeReducedMotionMq,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );

  useEffect(() => {
    if (reduceMotion || !containerRef.current || !scrollerRef.current) {
      return;
    }

    const scrollerContent = Array.from(scrollerRef.current.children);
    scrollerContent.forEach((item) => {
      scrollerRef.current?.appendChild(item.cloneNode(true));
    });

    if (direction === 'left') {
      containerRef.current.style.setProperty('--animation-direction', 'forwards');
    } else {
      containerRef.current.style.setProperty('--animation-direction', 'reverse');
    }

    const duration = speed === 'fast' ? '20s' : speed === 'normal' ? '40s' : '80s';
    containerRef.current.style.setProperty('--animation-duration', duration);
    setStart(true);
  }, [direction, speed, reduceMotion, items.length]);

  const cardClass =
    variant === 'brand'
      ? 'border-white/8 bg-white/[0.03] text-foreground/85 flex w-[220px] items-center justify-center rounded-[1.25rem] border px-7 py-5 shadow-[0_16px_40px_-28px_rgba(0,0,0,0.75)] backdrop-blur-xl md:w-[260px]'
      : 'border-border/50 bg-card relative w-[350px] max-w-full shrink-0 rounded-2xl border px-8 py-6 md:w-[450px]';

  return (
    <div
      ref={containerRef}
      className={cn(
        'scroller relative z-20 max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]',
        className
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          'flex w-max min-w-full shrink-0 flex-nowrap gap-4 py-4',
          start && !reduceMotion && 'animate-scroll',
          pauseOnHover && 'hover:[animation-play-state:paused]'
        )}
      >
        {items.map((item) => (
          <li className={cardClass} key={`${variant}-${item.quote}-${item.name}`}>
            {variant === 'brand' ? (
              <span className='font-display text-sm font-semibold tracking-[0.22em] uppercase'>
                {item.quote}
              </span>
            ) : (
              <blockquote>
                <span className='text-foreground relative z-20 text-sm leading-[1.6] font-normal'>
                  {item.quote}
                </span>
                <div className='relative z-20 mt-6 flex flex-row items-center'>
                  <span className='flex flex-col gap-1'>
                    <span className='text-foreground text-sm leading-[1.6] font-medium'>
                      {item.name}
                    </span>
                    <span className='text-muted-foreground text-sm leading-[1.6]'>
                      {item.title}
                    </span>
                  </span>
                </div>
              </blockquote>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
