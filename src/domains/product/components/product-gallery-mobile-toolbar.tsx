'use client';

import {
  IconAdjustmentsHorizontal,
  IconArrowsLeftRight,
  IconMaximize,
  IconPhoto,
  IconScan,
  IconShare2,
  IconVideo,
  IconX
} from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { LikeButton } from '@/components/buttons/like-button';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Flex } from '@/components/ui/flex';
import { cn } from '@/lib/utils';

import { ProductInteractiveViewerDialog } from './interactive-viewer/product-interactive-viewer-dialog';

interface ProductGalleryMobileToolbarProps {
  isLiked: boolean;
  inCompare: boolean;
  productId?: number;
  productName?: string;
  images: string[];
  imageIndex: number;
  showVideoToggle?: boolean;
  mediaMode?: 'photos' | 'video';
  onShare: () => void;
  onCompare: () => void;
  onOpenFullscreen: () => void;
  onMediaModeChange?: (mode: 'photos' | 'video') => void;
}

const actionButtonClassName =
  'bg-background/90 text-foreground hover:bg-background h-10 w-10 rounded-full border-0 shadow-md backdrop-blur-md active:scale-95';

/** Fixed vertical action rail on mobile gallery — share, fullscreen, compare, and more. */
export function ProductGalleryMobileToolbar({
  isLiked,
  inCompare,
  productId,
  productName,
  images,
  imageIndex,
  showVideoToggle = false,
  mediaMode = 'photos',
  onShare,
  onCompare,
  onOpenFullscreen,
  onMediaModeChange
}: ProductGalleryMobileToolbarProps) {
  const t = useTranslations('pdp.mobileToolbar');
  const tInfo = useTranslations('pdp.info');
  const tGallery = useTranslations('pdp.gallery');
  const [open, setOpen] = useState(true);
  const [viewerOpen, setViewerOpen] = useState(false);

  const actions: Array<{
    key: string;
    label: string;
    icon: typeof IconShare2;
    onClick: () => void;
    active?: boolean;
  }> = [
    {
      key: 'share',
      label: t('share'),
      icon: IconShare2,
      onClick: () => {
        void onShare();
        setOpen(false);
      }
    },
    {
      key: 'fullscreen',
      label: t('fullscreen'),
      icon: IconMaximize,
      onClick: () => {
        onOpenFullscreen();
        setOpen(false);
      }
    },
    ...(productId && images.length
      ? [
          {
            key: 'viewer',
            label: t('viewer'),
            icon: IconScan,
            onClick: () => {
              setViewerOpen(true);
              setOpen(false);
            }
          }
        ]
      : []),
    {
      key: 'compare',
      label: inCompare ? tInfo('openCompare') : tInfo('addToCompare'),
      icon: IconArrowsLeftRight,
      onClick: () => {
        onCompare();
        setOpen(false);
      },
      active: inCompare
    },
    ...(showVideoToggle && onMediaModeChange
      ? [
          {
            key: 'video',
            label: mediaMode === 'video' ? tGallery('photos') : tGallery('video'),
            icon: mediaMode === 'video' ? IconPhoto : IconVideo,
            onClick: () => {
              onMediaModeChange(mediaMode === 'video' ? 'photos' : 'video');
              setOpen(false);
            }
          }
        ]
      : [])
  ];

  return (
    <>
      <Collapsible
        open={open}
        onOpenChange={setOpen}
        className='absolute top-1/2 right-3 z-30 -translate-y-1/2 lg:hidden'
      >
        <Flex direction='column' align='end' gap={2}>
          <CollapsibleContent className='data-[state=closed]:animate-out data-[state=open]:animate-in flex flex-col items-end gap-2'>
            {actions.map(({ key, label, icon: Icon, onClick, active }) => (
              <Button
                key={key}
                type='button'
                variant='secondary'
                size='icon'
                className={cn(
                  actionButtonClassName,
                  active && 'ring-accent/40 bg-accent/15 ring-2'
                )}
                onClick={onClick}
                aria-label={label}
              >
                <Icon className='h-4 w-4' />
              </Button>
            ))}

            {productId ? (
              <LikeButton
                productId={productId}
                productName={productName ?? ''}
                isLiked={isLiked}
                className={cn(actionButtonClassName, isLiked && 'text-destructive')}
              />
            ) : null}
          </CollapsibleContent>

          <CollapsibleTrigger asChild>
            <Button
              type='button'
              variant='secondary'
              size='icon'
              className={cn(
                actionButtonClassName,
                'h-11 w-11',
                open && 'bg-foreground text-background hover:bg-foreground/90'
              )}
              aria-label={open ? t('closeActions') : t('toggleActions')}
              aria-expanded={open}
            >
              {open ? (
                <IconX className='h-4 w-4' />
              ) : (
                <IconAdjustmentsHorizontal className='h-5 w-5' />
              )}
            </Button>
          </CollapsibleTrigger>
        </Flex>
      </Collapsible>

      {productId && images.length ? (
        <ProductInteractiveViewerDialog
          open={viewerOpen}
          onOpenChange={setViewerOpen}
          productId={productId}
          productName={productName}
          images={images}
          imageIndex={imageIndex}
        />
      ) : null}
    </>
  );
}
