'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import type { ReactNode } from 'react';
import { useEffect, useId, useRef, useState } from 'react';

import { useOutsideClick } from '@/hooks/use-outside-click';
import { cn } from '@/lib/utils';

export interface ExpandableCardItem {
  id: string;
  title: string;
  description: string;
  src: string;
  ctaText?: string;
  ctaLink?: string;
  content?: ReactNode | (() => ReactNode);
}

export interface ExpandableCardListProps {
  items: ExpandableCardItem[];
  className?: string;
  /** Called when an item is opened/closed. Optional. */
  onActiveChange?: (item: ExpandableCardItem | null) => void;
}

export function ExpandableCardList({ items, className, onActiveChange }: ExpandableCardListProps) {
  const [active, setActive] = useState<ExpandableCardItem | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();

  const setActiveAndNotify = (item: ExpandableCardItem | null) => {
    setActive(item);
    onActiveChange?.(item);
  };

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setActiveAndNotify(null);
      }
    }

    document.body.style.overflow = active ? 'hidden' : 'auto';

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = 'auto';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  useOutsideClick(ref as React.RefObject<HTMLDivElement>, () => setActiveAndNotify(null));

  return (
    <>
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 z-10 h-full w-full bg-black/20'
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {active ? (
          <div className='fixed inset-0 z-[100] grid place-items-center'>
            <motion.button
              key={`button-${active.id}-${id}`}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.05 } }}
              className='absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-white lg:hidden'
              onClick={() => setActiveAndNotify(null)}
              aria-label='Close'
            >
              <CloseIcon />
            </motion.button>

            <motion.div
              layoutId={`card-${active.id}-${id}`}
              ref={ref}
              className='flex h-full w-full max-w-[500px] flex-col overflow-hidden bg-white sm:rounded-3xl md:h-fit md:max-h-[90%] dark:bg-neutral-900'
            >
              <motion.div layoutId={`image-${active.id}-${id}`}>
                <Image
                  width={200}
                  height={200}
                  src={active.src}
                  alt={active.title}
                  className='h-80 w-full object-cover object-top sm:rounded-tl-lg sm:rounded-tr-lg lg:h-80'
                />
              </motion.div>

              <div>
                <div className='flex items-start justify-between p-4'>
                  <div>
                    <motion.h3
                      layoutId={`title-${active.id}-${id}`}
                      className='font-bold text-neutral-700 dark:text-neutral-200'
                    >
                      {active.title}
                    </motion.h3>
                    <motion.p
                      layoutId={`description-${active.id}-${id}`}
                      className='text-neutral-600 dark:text-neutral-400'
                    >
                      {active.description}
                    </motion.p>
                  </div>

                  {active.ctaText && active.ctaLink ? (
                    <motion.a
                      layoutId={`button-${active.id}-${id}`}
                      href={active.ctaLink}
                      target='_blank'
                      rel='noreferrer'
                      className='rounded-full bg-green-500 px-4 py-3 text-sm font-bold text-white'
                    >
                      {active.ctaText}
                    </motion.a>
                  ) : null}
                </div>

                {active.content ? (
                  <div className='relative px-4 pt-4'>
                    <motion.div
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className='flex h-40 flex-col items-start gap-4 overflow-auto pb-10 text-xs text-neutral-600 [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch] [mask:linear-gradient(to_bottom,white,white,transparent)] [scrollbar-width:none] md:h-fit md:text-sm lg:text-base dark:text-neutral-400'
                    >
                      {typeof active.content === 'function' ? active.content() : active.content}
                    </motion.div>
                  </div>
                ) : null}
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>

      <ul className={cn('mx-auto w-full max-w-2xl gap-4', className)}>
        {items.map((item) => (
          <motion.div
            layoutId={`card-${item.id}-${id}`}
            key={`card-${item.id}-${id}`}
            onClick={() => setActiveAndNotify(item)}
            className='flex cursor-pointer flex-col items-center justify-between rounded-xl p-4 hover:bg-neutral-50 md:flex-row dark:hover:bg-neutral-800'
          >
            <div className='flex flex-col gap-4 md:flex-row'>
              <motion.div layoutId={`image-${item.id}-${id}`}>
                <Image
                  width={100}
                  height={100}
                  src={item.src}
                  alt={item.title}
                  className='h-40 w-40 rounded-lg object-cover object-top md:h-14 md:w-14'
                />
              </motion.div>
              <div>
                <motion.h3
                  layoutId={`title-${item.id}-${id}`}
                  className='text-center font-medium text-neutral-800 md:text-left dark:text-neutral-200'
                >
                  {item.title}
                </motion.h3>
                <motion.p
                  layoutId={`description-${item.id}-${id}`}
                  className='text-center text-neutral-600 md:text-left dark:text-neutral-400'
                >
                  {item.description}
                </motion.p>
              </div>
            </div>

            {item.ctaText ? (
              <motion.button
                layoutId={`button-${item.id}-${id}`}
                className='mt-4 rounded-full bg-gray-100 px-4 py-2 text-sm font-bold text-black hover:bg-green-500 hover:text-white md:mt-0'
              >
                {item.ctaText}
              </motion.button>
            ) : null}
          </motion.div>
        ))}
      </ul>
    </>
  );
}

export const CloseIcon = () => (
  <motion.svg
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0, transition: { duration: 0.05 } }}
    xmlns='http://www.w3.org/2000/svg'
    width='24'
    height='24'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
    className='h-4 w-4 text-black'
  >
    <path stroke='none' d='M0 0h24v24H0z' fill='none' />
    <path d='M18 6l-12 12' />
    <path d='M6 6l12 12' />
  </motion.svg>
);
