'use client';

import { IconZoomIn } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { AppImage } from '@/components/ui/app-image';
import { Lens } from '@/components/ui/lens';
import { IMAGE_FALLBACK, resolveImageSrc } from '@/lib/images';
import { cn } from '@/lib/utils';

const ZOOM_FACTOR = 2.2;
const LENS_SIZE = 170;

interface ProductImageMagnifierProps {
  src: string;
  alt: string;
  priority?: boolean;
  onOpenLightbox?: () => void;
  className?: string;
}

/**
 * Desktop hover magnifier for PDP gallery images.
 */
export function ProductImageMagnifier({
  src,
  alt,
  priority = false,
  onOpenLightbox,
  className
}: ProductImageMagnifierProps) {
  const t = useTranslations('pdp.gallery');
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const resolvedSrc = failedSrc === src ? IMAGE_FALLBACK : resolveImageSrc(src);
  const [canHoverMagnify, setCanHoverMagnify] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(hover: hover) and (pointer: fine)');
    const update = () => setCanHoverMagnify(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  const image = (
    <div
      className={cn(
        'relative aspect-[3/4] max-h-[min(85svh,820px)] w-full overflow-hidden rounded-none bg-neutral-100 lg:aspect-[4/5] lg:max-h-[min(620px,68vh)] lg:rounded-2xl dark:bg-neutral-900/40',
        !canHoverMagnify && onOpenLightbox && 'cursor-zoom-in',
        canHoverMagnify && 'cursor-crosshair'
      )}
      onClick={() => {
        if (!canHoverMagnify) {
          onOpenLightbox?.();
        }
      }}
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

      {canHoverMagnify ? (
        <div className='text-muted-foreground bg-background/80 pointer-events-none absolute right-4 bottom-4 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium backdrop-blur-sm'>
          <IconZoomIn className='h-3.5 w-3.5' />
          {t('hoverToMagnify')}
        </div>
      ) : null}
    </div>
  );

  return (
    <div className={cn('relative w-full', className)}>
      {canHoverMagnify ? (
        <Lens zoomFactor={ZOOM_FACTOR} lensSize={LENS_SIZE} className='rounded-none lg:rounded-2xl'>
          {image}
        </Lens>
      ) : (
        image
      )}
    </div>
  );
}
