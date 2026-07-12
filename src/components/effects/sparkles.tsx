/* eslint-disable react-hooks/purity */
'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';

import { cn } from '@/lib/utils';

interface SparklesProps {
  className?: string;
  particleColor?: string;
  minSize?: number;
  maxSize?: number;
  particleDensity?: number;
}

interface Particle {
  id: number;
  top: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
}

export function Sparkles({
  className,
  particleColor = '#c9a96e',
  minSize = 1,
  maxSize = 2.5,
  particleDensity = 40
}: SparklesProps) {
  const particles = useMemo<Particle[]>(
    () =>
      Array.from({ length: particleDensity }, (_, id) => ({
        id,
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: minSize + Math.random() * (maxSize - minSize),
        duration: 2 + Math.random() * 3,
        delay: Math.random() * 3
      })),
    [particleDensity, minSize, maxSize]
  );

  return (
    <div className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}>
      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className='absolute rounded-full'
          style={{
            top: `${particle.top}%`,
            left: `${particle.left}%`,
            width: particle.size,
            height: particle.size,
            backgroundColor: particleColor
          }}
          animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      ))}
    </div>
  );
}
