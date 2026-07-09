'use client';

import { IconPackage, IconStarFilled, IconTrendingUp } from '@tabler/icons-react';
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Link from 'next/link';
import { type MouseEvent, useRef } from 'react';

import { AppImage } from '@/components/ui/app-image';
import type { DtoHomeBrandItem } from '@/services/-home-top-brands-get.schemas';

const TILT_SPRING = { stiffness: 300, damping: 25, mass: 0.5 };

export function BrandCard({ brand }: { brand: DtoHomeBrandItem }) {
  const href = brand.slug ? `/brands/${brand.slug}` : '/shop';
  const hasRating = typeof brand.rating === 'number' && brand.rating > 0;
  const hasProductCount = typeof brand.product_count === 'number' && brand.product_count > 0;
  const hasPrice = typeof brand.min_price === 'number' && brand.min_price > 0;

  const cardRef = useRef<HTMLAnchorElement>(null);

  // Raw pointer position within the card, 0 → 1 on each axis, starts centered.
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);

  // Smoothed springs drive both the 3D tilt and the glare position, so
  // fast mouse movement doesn't snap the card around.
  const springX = useSpring(px, TILT_SPRING);
  const springY = useSpring(py, TILT_SPRING);

  const rotateX = useTransform(springY, [0, 1], [7, -7]);
  const rotateY = useTransform(springX, [0, 1], [-7, 7]);
  const glareBackground = useMotionTemplate`radial-gradient(280px circle at ${useTransform(springX, (v) => `${v * 100}%`)} ${useTransform(springY, (v) => `${v * 100}%`)}, color-mix(in oklab, var(--color-accent) 22%, transparent), transparent 65%)`;

  const handleMouseMove = (event: MouseEvent<HTMLAnchorElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    px.set((event.clientX - rect.left) / rect.width);
    py.set((event.clientY - rect.top) / rect.height);
  };

  const handleMouseLeave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      style={{ perspective: 900 }}
    >
      <Link
        ref={cardRef}
        href={href}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className='group border-border/60 bg-card hover:border-accent/40 relative block h-full overflow-hidden rounded-2xl border shadow-sm transition-[border-color,box-shadow] duration-300 hover:shadow-xl'
      >
        <motion.div
          className='flex h-full flex-col'
          style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        >
          {/* Cursor glare, only visible on hover */}
          <motion.div
            aria-hidden
            className='pointer-events-none absolute inset-0 z-20 opacity-0 transition-opacity duration-300 group-hover:opacity-100'
            style={{ background: glareBackground }}
          />

          {/* ── Banner ──────────────────────────────────────────────────── */}
          <div className='bg-muted relative h-24 w-full overflow-hidden sm:h-28'>
            {brand.banner_url ? (
              <AppImage
                src={brand.banner_url}
                alt=''
                aria-hidden
                fill
                sizes='(max-width: 640px) 90vw, 25vw'
                loading='lazy'
                className='object-cover transition-transform duration-700 ease-out group-hover:scale-110'
              />
            ) : (
              <div className='from-accent/20 via-muted to-muted absolute inset-0 bg-gradient-to-br' />
            )}
            <div className='from-card absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t to-transparent' />

            {brand.workflow_state?.name && (
              <span
                className='absolute end-2.5 top-2.5 rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wide shadow-sm backdrop-blur-sm'
                style={{
                  color: brand.workflow_state.text_color ?? undefined,
                  backgroundColor: brand.workflow_state.color ?? 'rgba(0,0,0,0.6)'
                }}
              >
                {brand.workflow_state.name}
              </span>
            )}
          </div>

          {/* ── Logo plate — overlaps banner/body seam ─────────────────── */}
          <div className='-mt-8 flex justify-center' style={{ transform: 'translateZ(40px)' }}>
            <div className='border-border/60 bg-background flex size-16 items-center justify-center overflow-hidden rounded-2xl border-4 shadow-md transition-shadow duration-300 group-hover:shadow-lg sm:size-[4.5rem]'>
              {brand.logo_url ? (
                <AppImage
                  src={brand.logo_url}
                  alt={brand.name ?? 'Brand logo'}
                  width={64}
                  height={64}
                  loading='lazy'
                  className='size-full object-contain p-2'
                />
              ) : (
                <span className='text-muted-foreground text-lg font-semibold'>
                  {brand.name?.charAt(0)?.toUpperCase() ?? '—'}
                </span>
              )}
            </div>
          </div>

          {/* ── Body ────────────────────────────────────────────────────── */}
          <div
            className='flex flex-1 flex-col items-center gap-1 px-4 pt-3 pb-5 text-center'
            style={{ transform: 'translateZ(20px)' }}
          >
            <h3 className='font-display group-hover:text-accent line-clamp-1 text-base font-semibold transition-colors'>
              {brand.name ?? '—'}
            </h3>

            {brand.description && (
              <p className='text-muted-foreground line-clamp-2 text-xs leading-relaxed'>
                {brand.description}
              </p>
            )}

            <div className='text-muted-foreground mt-2 flex items-center gap-3 text-xs'>
              {hasRating && (
                <span className='inline-flex items-center gap-1'>
                  <IconStarFilled className='fill-accent text-accent size-3.5' />
                  <span className='text-foreground font-medium tabular-nums'>
                    {brand.rating?.toFixed(1)}
                  </span>
                </span>
              )}

              {hasRating && hasProductCount && <span className='bg-border h-3 w-px' aria-hidden />}

              {hasProductCount && (
                <span className='inline-flex items-center gap-1'>
                  <IconPackage className='size-3.5' />
                  <span className='tabular-nums'>{brand.product_count}</span>
                </span>
              )}
            </div>

            {hasPrice && (
              <span className='bg-accent/10 text-accent group-hover:bg-accent group-hover:text-accent-foreground mt-3 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-colors duration-300'>
                <IconTrendingUp className='size-3' />
                From {brand.min_price?.toLocaleString()}
              </span>
            )}
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
