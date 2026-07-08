'use client';

import { motion, type MotionValue, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import React, { useRef, useSyncExternalStore } from 'react';

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

/**
 * 3D scroll-flatten hero — matches Aceternity Container Scroll Animation.
 * @see https://ui.aceternity.com/components/container-scroll-animation
 */
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
    target: containerRef
  });

  const scaleRange = isMobile ? [0.7, 0.9] : [1.05, 1];
  const rotate = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [20, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], reduceMotion ? [1, 1] : scaleRange);
  const translate = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [0, -100]);

  if (reduceMotion) {
    return (
      <div
        className='relative flex h-[60rem] items-center justify-center p-2 md:h-[80rem] md:p-20'
        ref={containerRef}
      >
        <div className='relative w-full py-10 md:py-40'>
          <div className='mx-auto max-w-5xl text-center'>{titleComponent}</div>
          <div className='border-border bg-card mx-auto -mt-12 h-[30rem] w-full max-w-5xl overflow-hidden rounded-[30px] border-4 p-2 shadow-2xl md:h-[40rem] md:p-6'>
            <div className='bg-muted/30 h-full w-full overflow-hidden rounded-2xl md:p-4'>
              {children}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className='relative flex h-[60rem] items-center justify-center p-2 md:h-[80rem] md:p-20'
      ref={containerRef}
    >
      <div className='relative w-full py-10 md:py-40' style={{ perspective: '1000px' }}>
        <Header translate={translate} titleComponent={titleComponent} />
        <Card rotate={rotate} scale={scale} translate={translate}>
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
        boxShadow:
          '0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003'
      }}
      className='mx-auto -mt-12 h-[30rem] w-full max-w-5xl rounded-[30px] border-4 border-[#6C6C6C] bg-[#222222] p-2 shadow-2xl md:h-[40rem] md:p-6'
    >
      <div className='h-full w-full overflow-hidden rounded-2xl bg-gray-100 md:rounded-2xl md:p-4 dark:bg-zinc-900'>
        {children}
      </div>
    </motion.div>
  );
};
