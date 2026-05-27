'use client';
import { useEffect, useRef, useState } from 'react';
import { useInView, animate } from 'framer-motion';
import { formatCount } from '@/domains/store/store.utils';

export function AnimatedCounter({ value, className }: { value: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-20%' });
  const [display, setDisplay] = useState('0');
  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 1.2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(formatCount(Math.round(v)))
    });
    return controls.stop;
  }, [inView, value]);
  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
