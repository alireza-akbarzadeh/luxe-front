'use client';

import { motion, MotionValue, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import React, { useRef, useSyncExternalStore } from 'react';

import { cn } from '@/lib/utils';

/** Softer depth shadow — avoids the heavy multi-layer Aceternity default. */
const CARD_BOX_SHADOW = '0 14px 36px -12px rgba(0, 0, 0, 0.22), 0 4px 12px -6px rgba(0, 0, 0, 0.1)';

function subscribeMobileMq(onStoreChange: () => void) {
  const mq = window.matchMedia('(max-width: 768px)');
  mq.addEventListener('change', onStoreChange);
  return () => mq.removeEventListener('change', onStoreChange);
}

function getMobileSnapshot() {
  return window.matchMedia('(max-width: 768px)').matches;
}

function getMobileServerSnapshot() {
  return false;
}

export const ContainerScroll = ({
  titleComponent,
  children
}: {
  titleComponent: string | React.ReactNode;
  children: React.ReactNode;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const isMobile = useSyncExternalStore(
    subscribeMobileMq,
    getMobileSnapshot,
    getMobileServerSnapshot
  );

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.92', 'end 0.08']
  });

  const scaleRange = isMobile ? [0.86, 1] : [0.94, 1];
  const rotate = useTransform(scrollYProgress, [0, 0.65, 1], reduceMotion ? [0, 0, 0] : [14, 4, 0]);
  const scale = useTransform(
    scrollYProgress,
    [0, 0.65, 1],
    reduceMotion ? [1, 1, 1] : [...scaleRange, 1]
  );
  const headerTranslate = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [32, -72]);
  const cardTranslate = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [56, -16]);

  if (reduceMotion) {
    return (
      <div className='relative flex items-center justify-center p-2 md:p-12' ref={containerRef}>
        <div className='relative w-full max-w-5xl py-8 md:py-14'>
          <div className='mx-auto max-w-5xl text-center'>{titleComponent}</div>
          <div className='border-border/50 bg-card mx-auto mt-8 w-full overflow-hidden rounded-[30px] border p-2 shadow-md md:p-5'>
            <div className='bg-muted/30 h-[28rem] overflow-hidden rounded-2xl md:h-[36rem]'>
              {children}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className='relative flex h-[44rem] items-center justify-center p-2 md:h-[58rem] md:p-12'
      ref={containerRef}
    >
      <div className='relative w-full max-w-5xl py-8 md:py-20' style={{ perspective: '1200px' }}>
        <Header translate={headerTranslate} titleComponent={titleComponent} />
        <Card rotate={rotate} scale={scale} translate={cardTranslate}>
          {children}
        </Card>
      </div>
    </div>
  );
};

export const Header = ({
  translate,
  titleComponent
}: {
  translate: MotionValue<number>;
  titleComponent: string | React.ReactNode;
}) => {
  return (
    <motion.div style={{ translateY: translate }} className='mx-auto max-w-5xl text-center'>
      {titleComponent}
    </motion.div>
  );
};

export const Card = ({
  rotate,
  scale,
  translate,
  children
}: {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  translate: MotionValue<number>;
  children: React.ReactNode;
}) => {
  return (
    <motion.div
      style={{
        rotateX: rotate,
        scale,
        translateY: translate,
        transformOrigin: '50% 100%',
        boxShadow: CARD_BOX_SHADOW
      }}
      className={cn(
        'border-border/50 bg-card mx-auto -mt-10 h-[28rem] w-full max-w-5xl rounded-[30px] border p-2 md:-mt-12 md:h-[36rem] md:p-5'
      )}
    >
      <div className='bg-muted/15 h-full w-full overflow-hidden rounded-2xl md:p-1.5'>
        {children}
      </div>
    </motion.div>
  );
};
