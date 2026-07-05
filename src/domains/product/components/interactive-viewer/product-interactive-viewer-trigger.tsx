'use client';

import { IconScan } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Button } from '@/components/ui/button';

import { ProductInteractiveViewerDialog } from './product-interactive-viewer-dialog';

interface ProductInteractiveViewerTriggerProps {
  productId: number;
  productName?: string;
  images: string[];
  imageIndex: number;
  className?: string;
}

/** Gallery control that opens the interactive hotspot viewer. */
export function ProductInteractiveViewerTrigger({
  productId,
  productName,
  images,
  imageIndex,
  className
}: ProductInteractiveViewerTriggerProps) {
  const t = useTranslations('pdp.interactiveViewer');
  const [open, setOpen] = useState(false);

  if (!productId || images.length === 0) {
    return null;
  }

  return (
    <>
      <Button
        type='button'
        variant='secondary'
        size='icon'
        className={className}
        onClick={() => setOpen(true)}
        aria-label={t('openViewer')}
      >
        <IconScan className='h-4 w-4' />
      </Button>
      <ProductInteractiveViewerDialog
        open={open}
        onOpenChange={setOpen}
        productId={productId}
        productName={productName}
        images={images}
        imageIndex={imageIndex}
      />
    </>
  );
}
