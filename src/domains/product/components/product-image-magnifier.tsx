'use client';

import { IconZoomIn } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useRef, useState } from 'react';

import { AppImage } from '@/components/ui/app-image';
import { IMAGE_FALLBACK, resolveImageSrc } from '@/lib/images';
import { cn } from '@/lib/utils';
const ZOOM_SCALE = 2.2;
const LENS_SIZE = 120;

interface ProductImageMagnifierProps {
  src: string;
  alt: string;
  priority?: boolean;
  onOpenLightbox?: () => void;
  className?: string;
}

/**
 * Desktop hover magnifier. Base image stays at normal size; zoom overlay mounts only while hovering.
 */
export function ProductImageMagnifier({
  src,
  alt,
  priority = false,
  onOpenLightbox,
  className
}: ProductImageMagnifierProps) {
  const t = useTranslations('pdp.gallery');
  const containerRef = useRef<HTMLDivElement>(null);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const resolvedSrc = failedSrc === src ? IMAGE_FALLBACK : resolveImageSrc(src);
  const [canHoverMagnify, setCanHoverMagnify] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [lens, setLens] = useState({ x: 0, y: 0, relX: 50, relY: 50 });

  useEffect(() => {
    const media = window.matchMedia('(hover: hover) and (pointer: fine)');
    const update = () => setCanHoverMagnify(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  const resetHover = useCallback(() => {
    setIsHovering(false);
  }, []);

  const updateLens = useCallback((clientX: number, clientY: number) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const half = LENS_SIZE / 2;
    const rawX = clientX - rect.left;
    const rawY = clientY - rect.top;

    const x = Math.max(half, Math.min(rect.width - half, rawX));
    const y = Math.max(half, Math.min(rect.height - half, rawY));

    setLens({
      x: x - half,
      y: y - half,
      relX: (x / rect.width) * 100,
      relY: (y / rect.height) * 100
    });
  }, []);

  const handlePointerEnter = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!canHoverMagnify || event.pointerType !== 'mouse') return;
    setIsHovering(true);
    updateLens(event.clientX, event.clientY);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!canHoverMagnify || !isHovering || event.pointerType !== 'mouse') return;
    updateLens(event.clientX, event.clientY);
  };

  const handlePointerLeave = () => {
    resetHover();
  };

  const handleClick = () => {
    if (!canHoverMagnify) {
      onOpenLightbox?.();
    }
  };

  const showZoom = isHovering && canHoverMagnify;

  return (
    <div
      ref={containerRef}
      className={cn(
        'bg-neutral-100 relative aspect-[3/4] w-full max-h-[min(85svh,820px)] overflow-hidden rounded-none lg:aspect-[4/5] lg:max-h-[min(620px,68vh)] lg:rounded-2xl dark:bg-neutral-900/40',
        !canHoverMagnify && onOpenLightbox && 'cursor-zoom-in',
        canHoverMagnify && 'cursor-crosshair',
        className
      )}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerCancel={handlePointerLeave}
      onClick={handleClick}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onOpenLightbox?.();
        }
      }}
      role={onOpenLightbox ? 'button' : undefined}
      tabIndex={onOpenLightbox ? 0 : undefined}
      aria-label={onOpenLightbox ? `Zoom ${alt}` : undefined}
    >
      <AppImage
        src={resolvedSrc}
        alt={alt}
        fill
        priority={priority}
        sizes='(max-width: 1024px) 100vw, 50vw'
        className='object-cover'
        draggable={false}
        onError={() => {
          if (failedSrc !== src) {
            setFailedSrc(src);
          }
        }}
      />

      {showZoom && (
        <>
          <div
            aria-hidden
            className='pointer-events-none absolute inset-0 z-10'
            style={{
              backgroundImage: `url(${resolvedSrc})`,
              backgroundSize: `${ZOOM_SCALE * 100}%`,
              backgroundPosition: `${lens.relX}% ${lens.relY}%`,
              backgroundRepeat: 'no-repeat'
            }}
          />
          <div
            aria-hidden
            className='border-accent/80 bg-accent/5 pointer-events-none absolute z-20 rounded-full border-2 shadow-sm'
            style={{
              width: LENS_SIZE,
              height: LENS_SIZE,
              transform: `translate(${lens.x}px, ${lens.y}px)`
            }}
          />
        </>
      )}

      {canHoverMagnify && !showZoom && (
        <div className='text-muted-foreground bg-background/80 pointer-events-none absolute right-4 bottom-4 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium backdrop-blur-sm'>
          <IconZoomIn className='h-3.5 w-3.5' />
          {t('hoverToMagnify')}
        </div>
      )}
    </div>
  );
}
