'use client';

import { IconMaximize, IconPhoto, IconVideo } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useState } from 'react';

import { AppImage } from '@/components/ui/app-image';
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
import { useLocaleFormatters } from '@/lib/i18n/use-locale-formatters';
import { IMAGE_FALLBACK } from '@/lib/images';
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
  const t = useTranslations('pdp.gallery');
  const tBreadcrumb = useTranslations('pdp.breadcrumb');
  const { moneyClassName } = useLocaleFormatters();
  const images = product.images?.length ? product.images : [IMAGE_FALLBACK];
  const [selectedImage, setSelectedImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [mediaMode, setMediaMode] = useState<MediaMode>('photos');
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();

  const hasMultiple = images.length > 1;

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

  const mediaModes = [
    ['photos', IconPhoto, t('photos')],
    ['video', IconVideo, t('video')]
  ] as const;

  const productLabel = product.name ?? tBreadcrumb('product');

  return (
    <>
      <div className='lg:sticky lg:top-28 lg:self-start'>
        {mediaMode === 'video' ? (
          <div className='relative'>
            <ProductVideoPlayer product={product} className='rounded-3xl' />
            <div className='absolute bottom-4 left-4 z-20'>
              <div className='bg-background/90 border-border/50 inline-flex rounded-full border p-1 shadow-sm backdrop-blur-md'>
                {(
                  mediaModes
                ).map(([mode, Icon, label]) => (
                  <button
                    key={mode}
                    type='button'
                    onClick={() => setMediaMode(mode)}
                    className={cn(
                      'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all',
                      mediaMode === mode
                        ? 'bg-foreground text-background'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <Icon className='h-3.5 w-3.5' />
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className='flex flex-col gap-3'>
            <div className='relative min-w-0'>
              <Carousel setApi={setCarouselApi} opts={{ loop: hasMultiple }}>
                <CarouselContent className='ml-0'>
                  {images.map((image, index) => (
                    <CarouselItem key={`${image}-${index}`} className='pl-0'>
                      <ProductImageMagnifier
                        src={image}
                        alt={t('imageAlt', {
                          name: productLabel,
                          index: index + 1
                        })}
                        priority={index === 0}
                        onOpenLightbox={() => setLightboxOpen(true)}
                        className='rounded-3xl'
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>

                {hasMultiple && (
                  <>
                    <CarouselPrevious className='bg-background/90 hover:bg-background left-3 h-12 w-12 border-0 shadow-md backdrop-blur-md [&_svg]:size-5' />
                    <CarouselNext className='bg-background/90 hover:bg-background right-3 h-12 w-12 border-0 shadow-md backdrop-blur-md [&_svg]:size-5' />
                  </>
                )}
              </Carousel>

              <div className='pointer-events-none absolute top-4 left-4 z-20 flex flex-wrap gap-2'>
                {product.is_new && (
                  <Badge className='bg-foreground/90 text-background rounded-full border-0 px-3 py-1 text-[11px] font-medium'>
                    {t('newArrival')}
                  </Badge>
                )}
                {discount > 0 && (
                  <Badge className='bg-accent text-accent-foreground rounded-full border-0 px-3 py-1 text-[11px] font-semibold'>
                    {t('discountOff', { percent: discount })}
                  </Badge>
                )}
              </div>

              <div className='absolute top-4 right-4 z-20 flex items-center gap-2'>
                <span
                  className={cn(
                    'bg-background/90 text-foreground rounded-full px-2.5 py-1 text-xs font-medium backdrop-blur-md',
                    moneyClassName
                  )}
                >
                  {t('imageCounter', {
                    current: selectedImage + 1,
                    total: images.length
                  })}
                </span>
                <Button
                  type='button'
                  variant='secondary'
                  size='icon'
                  className='bg-background/90 hover:bg-background h-10 w-10 rounded-full border-0 shadow-sm backdrop-blur-md'
                  onClick={() => setLightboxOpen(true)}
                  aria-label={t('openFullscreen')}
                >
                  <IconMaximize className='h-4 w-4' />
                </Button>
              </div>

              <div className='absolute bottom-4 left-4 z-20'>
                <div className='bg-background/90 border-border/50 inline-flex rounded-full border p-1 shadow-sm backdrop-blur-md'>
                  {mediaModes.map(([mode, Icon, label]) => (
                    <button
                      key={mode}
                      type='button'
                      onClick={() => setMediaMode(mode)}
                      className={cn(
                        'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all',
                        mediaMode === mode
                          ? 'bg-foreground text-background'
                          : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      <Icon className='h-3.5 w-3.5' />
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {hasMultiple && (
              <div className='flex gap-2 overflow-x-auto pb-1'>
                {images.map((image, index) => (
                  <button
                    key={`${image}-thumb-${index}`}
                    type='button'
                    onClick={() => syncIndex(index)}
                    className={cn(
                      'relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 transition-all duration-200',
                      selectedImage === index
                        ? 'border-foreground ring-foreground/10 ring-2'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    )}
                    aria-label={t('viewImage', { index: index + 1 })}
                    aria-current={selectedImage === index}
                  >
                    <AppImage src={image} alt='' fill sizes='72px' className='object-cover' />
                  </button>
                ))}
              </div>
            )}
          </div>
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
