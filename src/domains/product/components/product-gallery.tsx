'use client';

import {
  IconChevronLeft,
  IconChevronRight,
  IconMaximize,
  IconPhoto,
  IconShare2,
  IconVideo
} from '@tabler/icons-react';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import type { DtoProductWithLike } from '@/services/-products-get.schemas';

import { ProductGalleryLightbox } from './product-gallery-lightbox';
import { ProductImageMagnifier } from './product-image-magnifier';
import { ProductVideoPlayer } from './product-video-player';

interface ProductGalleryProps {
  product: DtoProductWithLike;
  discount: number;
}

type MediaMode = 'photos' | 'video';

export function ProductGallery({ product, discount }: ProductGalleryProps) {
  const images = product.images?.length ? product.images : ['/placeholder.png'];
  const [selectedImage, setSelectedImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [mediaMode, setMediaMode] = useState<MediaMode>('photos');
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();

  const hasMultiple = images.length > 1;
  const sliderMax = Math.max(images.length - 1, 0);

  const syncIndex = useCallback(
    (index: number) => {
      setSelectedImage(index);
      carouselApi?.scrollTo(index);
    },
    [carouselApi]
  );

  useEffect(() => {
    if (!carouselApi) return;

    const onSelect = () => {
      setSelectedImage(carouselApi.selectedScrollSnap());
    };

    onSelect();
    carouselApi.on('select', onSelect);
    carouselApi.on('reInit', onSelect);

    return () => {
      carouselApi.off('select', onSelect);
      carouselApi.off('reInit', onSelect);
    };
  }, [carouselApi]);

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: product.name ?? 'Product', url });
        return;
      }
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard');
    } catch {
      toast.error('Could not share product');
    }
  };

  const openLightbox = () => setLightboxOpen(true);

  return (
    <>
      <div className='lg:sticky lg:top-28 lg:self-start'>
        {/* Media mode toggle */}
        <div className='border-border/60 bg-muted/40 mb-4 flex rounded-full border p-1'>
          {(
            [
              ['photos', IconPhoto, 'Photos'],
              ['video', IconVideo, 'Video']
            ] as const
          ).map(([mode, Icon, label]) => (
            <button
              key={mode}
              type='button'
              onClick={() => setMediaMode(mode)}
              className={cn(
                'flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition',
                mediaMode === mode
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className='h-4 w-4' />
              {label}
            </button>
          ))}
        </div>

        {mediaMode === 'video' ? (
          <ProductVideoPlayer product={product} />
        ) : (
          <>
            <div className='flex gap-3'>
              {hasMultiple && (
                <div className='hidden shrink-0 flex-col gap-2 lg:flex'>
                  {images.map((image, index) => (
                    <button
                      key={`${image}-thumb-${index}`}
                      type='button'
                      onClick={() => syncIndex(index)}
                      className={cn(
                        'relative h-[4.5rem] w-[4.5rem] overflow-hidden rounded-xl border-2 transition',
                        selectedImage === index
                          ? 'border-accent ring-accent/20 ring-2'
                          : 'hover:border-border border-transparent'
                      )}
                      aria-label={`View image ${index + 1}`}
                      aria-current={selectedImage === index}
                    >
                      <Image src={image} alt='' fill sizes='72px' className='object-cover' />
                    </button>
                  ))}
                </div>
              )}

              <div className='relative min-w-0 flex-1'>
                <Carousel setApi={setCarouselApi} opts={{ loop: hasMultiple }}>
                  <CarouselContent className='ml-0'>
                    {images.map((image, index) => (
                      <CarouselItem key={`${image}-${index}`} className='pl-0'>
                        <ProductImageMagnifier
                          key={image}
                          src={image}
                          alt={`${product.name ?? 'Product'} — image ${index + 1}`}
                          priority={index === 0}
                          onOpenLightbox={openLightbox}
                        />
                      </CarouselItem>
                    ))}
                  </CarouselContent>

                  {hasMultiple && (
                    <>
                      <CarouselPrevious className='bg-background/85 hover:bg-background left-3 border-0 shadow-sm backdrop-blur-sm' />
                      <CarouselNext className='bg-background/85 hover:bg-background right-3 border-0 shadow-sm backdrop-blur-sm' />
                    </>
                  )}
                </Carousel>

                <div className='pointer-events-none absolute top-4 left-4 z-20 flex flex-col gap-2'>
                  {product.is_new && <Badge variant='inverse'>New arrival</Badge>}
                  {discount > 0 && <Badge variant='accent'>-{discount}% off</Badge>}
                  {product.is_digital && <Badge variant='accentOutline'>Digital</Badge>}
                </div>

                <div className='absolute top-4 right-4 z-20 flex items-center gap-2'>
                  <span className='bg-background/85 text-foreground rounded-full px-2.5 py-1 text-xs font-medium tabular-nums backdrop-blur-sm'>
                    {selectedImage + 1}/{images.length}
                  </span>
                  <Button
                    type='button'
                    variant='secondary'
                    size='icon'
                    className='bg-background/85 hover:bg-background h-9 w-9 rounded-full backdrop-blur-sm'
                    onClick={handleShare}
                    aria-label='Share product'
                  >
                    <IconShare2 className='h-4 w-4' />
                  </Button>
                  <Button
                    type='button'
                    variant='secondary'
                    size='icon'
                    className='bg-background/85 hover:bg-background hidden h-9 w-9 rounded-full backdrop-blur-sm sm:inline-flex'
                    onClick={openLightbox}
                    aria-label='Open fullscreen gallery'
                  >
                    <IconMaximize className='h-4 w-4' />
                  </Button>
                </div>
              </div>
            </div>

            {hasMultiple && (
              <div className='mt-4 space-y-3'>
                <div className='flex items-center justify-between gap-3'>
                  <span className='text-muted-foreground text-xs font-medium tracking-wide uppercase'>
                    Browse images
                  </span>
                  <div className='flex gap-1'>
                    <Button
                      type='button'
                      variant='ghost'
                      size='icon'
                      className='h-8 w-8 rounded-full'
                      onClick={() => syncIndex(selectedImage === 0 ? sliderMax : selectedImage - 1)}
                      aria-label='Previous image'
                    >
                      <IconChevronLeft className='h-4 w-4' />
                    </Button>
                    <Button
                      type='button'
                      variant='ghost'
                      size='icon'
                      className='h-8 w-8 rounded-full'
                      onClick={() => syncIndex(selectedImage === sliderMax ? 0 : selectedImage + 1)}
                      aria-label='Next image'
                    >
                      <IconChevronRight className='h-4 w-4' />
                    </Button>
                  </div>
                </div>

                <Slider
                  min={0}
                  max={sliderMax}
                  step={1}
                  value={[selectedImage]}
                  onValueChange={([value]) => {
                    if (value !== undefined) syncIndex(value);
                  }}
                  aria-label='Image gallery slider'
                  className='[&_[data-slot=slider-range]]:bg-accent [&_[data-slot=slider-thumb]]:border-accent'
                />

                <div className='flex justify-center gap-1.5'>
                  {images.map((_, index) => (
                    <button
                      key={`dot-${index}`}
                      type='button'
                      onClick={() => syncIndex(index)}
                      className={cn(
                        'h-1.5 rounded-full transition-all',
                        selectedImage === index ? 'bg-accent w-6' : 'bg-muted-foreground/30 w-1.5'
                      )}
                      aria-label={`Go to image ${index + 1}`}
                      aria-current={selectedImage === index}
                    />
                  ))}
                </div>

                <div className='flex gap-2 overflow-x-auto pb-1 lg:hidden'>
                  {images.map((image, index) => (
                    <button
                      key={`${image}-mobile-${index}`}
                      type='button'
                      onClick={() => syncIndex(index)}
                      className={cn(
                        'relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition',
                        selectedImage === index
                          ? 'border-accent ring-accent/20 ring-2'
                          : 'hover:border-border border-transparent'
                      )}
                      aria-label={`View image ${index + 1}`}
                    >
                      <Image src={image} alt='' fill sizes='64px' className='object-cover' />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <ProductGalleryLightbox
        images={images}
        selectedIndex={selectedImage}
        productName={product.name}
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
        onSelectIndex={syncIndex}
      />
    </>
  );
}
