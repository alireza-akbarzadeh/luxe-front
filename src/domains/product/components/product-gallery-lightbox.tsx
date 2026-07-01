'use client';

import { IconChevronLeft, IconChevronRight, IconX } from '@tabler/icons-react';
import { Dialog as DialogPrimitive } from 'radix-ui';
import { useCallback, useEffect, useRef } from 'react';

import { AppImage } from '@/components/ui/app-image';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogPortal, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface ProductGalleryLightboxProps {
  images: string[];
  selectedIndex: number;
  productName?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectIndex: (index: number) => void;
}

export function ProductGalleryLightbox({
  images,
  selectedIndex,
  productName,
  open,
  onOpenChange,
  onSelectIndex
}: ProductGalleryLightboxProps) {
  const total = images.length;
  const hasMultiple = total > 1;
  const thumbStripRef = useRef<HTMLDivElement>(null);

  const currentImage = images[selectedIndex] ?? images[0];

  const goPrev = useCallback(() => {
    onSelectIndex(selectedIndex === 0 ? total - 1 : selectedIndex - 1);
  }, [onSelectIndex, selectedIndex, total]);

  const goNext = useCallback(() => {
    onSelectIndex(selectedIndex === total - 1 ? 0 : selectedIndex + 1);
  }, [onSelectIndex, selectedIndex, total]);

  useEffect(() => {
    if (!open || !hasMultiple) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') goPrev();
      if (event.key === 'ArrowRight') goNext();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, hasMultiple, goPrev, goNext]);

  useEffect(() => {
    if (!open || !thumbStripRef.current) return;
    const activeThumb = thumbStripRef.current.querySelector('[aria-current="true"]');
    activeThumb?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [open, selectedIndex]);

  if (!currentImage) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogPrimitive.Overlay
          className={cn(
            'fixed inset-0 z-50 bg-black/90 backdrop-blur-sm',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0'
          )}
        />

        <DialogPrimitive.Content
          className={cn(
            'fixed inset-0 z-50 flex flex-col outline-none',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'duration-200'
          )}
          onOpenAutoFocus={(event) => event.preventDefault()}
        >
          <DialogTitle className='sr-only'>
            {productName
              ? `${productName} — image ${selectedIndex + 1} of ${total}`
              : 'Product gallery'}
          </DialogTitle>

          {/* Header */}
          <header className='flex shrink-0 items-center justify-between gap-4 border-b border-white/10 px-4 py-3 sm:px-6'>
            <div className='min-w-0'>
              {productName && (
                <p className='truncate text-sm font-medium text-white'>{productName}</p>
              )}
              <p className='text-xs text-white/60 tabular-nums'>
                Image {selectedIndex + 1} of {total}
              </p>
            </div>

            <DialogClose asChild>
              <Button
                variant='ghost'
                size='icon'
                className='shrink-0 rounded-full text-white hover:bg-white/10'
                aria-label='Close gallery'
              >
                <IconX className='h-5 w-5' />
              </Button>
            </DialogClose>
          </header>

          {/* Main image — explicit bounds so fill/object-contain works */}
          <div className='relative min-h-0 flex-1'>
            <div
              className={cn(
                'absolute inset-0 flex items-center justify-center',
                hasMultiple ? 'px-14 sm:px-20' : 'px-4'
              )}
            >
              <div className='relative h-full w-full max-w-6xl'>
                <AppImage
                  key={currentImage}
                  src={currentImage}
                  alt={
                    productName ? `${productName} — image ${selectedIndex + 1}` : 'Product image'
                  }
                  fill
                  sizes='100vw'
                  className='object-contain'
                  priority
                  draggable={false}
                />
              </div>
            </div>

            {hasMultiple && (
              <>
                <Button
                  type='button'
                  variant='ghost'
                  size='icon'
                  onClick={goPrev}
                  className='absolute top-1/2 left-2 z-10 h-11 w-11 -translate-y-1/2 rounded-full bg-black/40 text-white backdrop-blur-sm hover:bg-black/60 sm:left-4'
                  aria-label='Previous image'
                >
                  <IconChevronLeft className='h-6 w-6' />
                </Button>
                <Button
                  type='button'
                  variant='ghost'
                  size='icon'
                  onClick={goNext}
                  className='absolute top-1/2 right-2 z-10 h-11 w-11 -translate-y-1/2 rounded-full bg-black/40 text-white backdrop-blur-sm hover:bg-black/60 sm:right-4'
                  aria-label='Next image'
                >
                  <IconChevronRight className='h-6 w-6' />
                </Button>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {hasMultiple && (
            <footer className='shrink-0 border-t border-white/10 bg-black/40 px-4 py-4 backdrop-blur-md'>
              <div
                ref={thumbStripRef}
                className='flex gap-2 overflow-x-auto pb-1 sm:justify-center'
              >
                {images.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type='button'
                    onClick={() => onSelectIndex(index)}
                    className={cn(
                      'relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition',
                      selectedIndex === index
                        ? 'border-accent ring-accent/40 ring-2'
                        : 'border-white/20 opacity-60 hover:border-white/40 hover:opacity-100'
                    )}
                    aria-label={`View image ${index + 1}`}
                    aria-current={selectedIndex === index}
                  >
                    <AppImage src={image} alt='' fill sizes='64px' className='object-cover' />
                  </button>
                ))}
              </div>
            </footer>
          )}
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}
