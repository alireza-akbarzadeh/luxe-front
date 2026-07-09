'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useRef, useState } from 'react';

import { cn } from '@/lib/utils';

export interface LensProps {
  children: React.ReactNode;
  className?: string;
  zoomFactor?: number;
  lensSize?: number;
  position?: {
    x: number;
    y: number;
  };
  isStatic?: boolean;
  hovering?: boolean;
  setHovering?: (hovering: boolean) => void;
}

/**
 * Radial hover magnifier — duplicates children under a masked zoom lens.
 * Use on product cards and PDP gallery images (pointer-fine / hover devices).
 */
export function Lens({
  children,
  className,
  zoomFactor = 1.5,
  lensSize = 170,
  isStatic = false,
  position = { x: 200, y: 150 },
  hovering,
  setHovering
}: LensProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [localIsHovering, setLocalIsHovering] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 100, y: 100 });

  const isHovering = hovering ?? localIsHovering;
  const setIsHovering = setHovering ?? setLocalIsHovering;

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    });
  };

  const activeX = isStatic ? position.x : mousePosition.x;
  const activeY = isStatic ? position.y : mousePosition.y;
  const mask = `radial-gradient(circle ${lensSize / 2}px at ${activeX}px ${activeY}px, black 100%, transparent 100%)`;

  return (
    <div
      ref={containerRef}
      className={cn('relative z-20 overflow-hidden rounded-lg', className)}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onMouseMove={handleMouseMove}
    >
      {children}

      {isStatic ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.58 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className='pointer-events-none absolute inset-0 overflow-hidden'
          style={{
            maskImage: mask,
            WebkitMaskImage: mask,
            transformOrigin: `${activeX}px ${activeY}px`
          }}
        >
          <div
            className='absolute inset-0'
            style={{
              transform: `scale(${zoomFactor})`,
              transformOrigin: `${activeX}px ${activeY}px`
            }}
          >
            {children}
          </div>
        </motion.div>
      ) : (
        <AnimatePresence>
          {isHovering ? (
            <motion.div
              key='lens-overlay'
              initial={{ opacity: 0, scale: 0.58 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className='pointer-events-none absolute inset-0 z-50 overflow-hidden'
              style={{
                maskImage: mask,
                WebkitMaskImage: mask,
                transformOrigin: `${activeX}px ${activeY}px`
              }}
            >
              <div
                className='absolute inset-0'
                style={{
                  transform: `scale(${zoomFactor})`,
                  transformOrigin: `${activeX}px ${activeY}px`
                }}
              >
                {children}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      )}
    </div>
  );
}
