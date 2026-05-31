'use client';
import { IconPlus } from '@tabler/icons-react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';

import { cn } from '@/lib/utils';
export interface FaqItem {
  q: string;
  a: string;
}
interface FaqAccordionProps {
  items: FaqItem[];
  className?: string;
}
export function FaqAccordion({ items, className }: FaqAccordionProps) {
  const [open, setOpen] = useState<number | null>(0);
  const reduce = useReducedMotion();
  return (
    <div
      className={cn(
        'divide-border/60 border-border/60 bg-card/40 divide-y overflow-hidden rounded-3xl border backdrop-blur',
        className
      )}
    >
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q}>
            <button
              type='button'
              onClick={() => setOpen(isOpen ? null : i)}
              className='hover:bg-muted/40 flex w-full items-center justify-between gap-6 px-6 py-5 text-left transition-colors'
              aria-expanded={isOpen}
            >
              <span className='text-base font-medium tracking-tight'>{item.q}</span>
              <motion.span
                animate={{ rotate: isOpen ? 45 : 0 }}
                transition={{ duration: 0.2 }}
                className='border-border/60 bg-background text-accent flex size-8 shrink-0 items-center justify-center rounded-full border'
              >
                <IconPlus className='size-4' />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key='content'
                  initial={reduce ? { height: 'auto' } : { height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={reduce ? { height: 'auto' } : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className='overflow-hidden'
                >
                  <div className='text-muted-foreground px-6 pb-6 text-sm leading-relaxed'>
                    {item.a}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
