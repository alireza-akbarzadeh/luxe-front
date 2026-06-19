'use client';

import { motion, useReducedMotion } from 'framer-motion';

interface HomeFadeInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

/** Scroll-triggered fade with reduced-motion support for home marketing sections. */
export function HomeFadeIn({ children, className, delay = 0 }: HomeFadeInProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
