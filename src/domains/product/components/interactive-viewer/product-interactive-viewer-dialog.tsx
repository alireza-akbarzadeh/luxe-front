'use client';

import { IconScan } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { AppDialog } from '~/src/components/app-dialog';
import { InteractiveViewerPanel } from '~/src/domains/product/components/interactive-viewer/Interactive-viewer-panel';

interface ProductInteractiveViewerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: number;
  productName?: string;
  images: string[];
  imageIndex: number;
}

/** Full-screen dialog for exploring AI-generated product hotspots. */
export function ProductInteractiveViewerDialog({
  open,
  onOpenChange,
  productId,
  productName,
  images,
  imageIndex
}: ProductInteractiveViewerDialogProps) {
  const t = useTranslations('pdp.interactiveViewer');

  const handleLoadFailed = () => {
    toast.error(t('errors.loadFailed'));
    onOpenChange(false);
  };

  return (
    <AppDialog
      title={
        <div className='flex items-center gap-1'>
          <IconScan className='size-5' />
          {t('title')}
        </div>
      }
      open={open}
      onOpenChange={onOpenChange}
      contentClassName='max-h-[90vh] max-w-3xl gap-0 overflow-hidden p-0'
      description={productName ? t('descriptionNamed', { name: productName }) : t('description')}
    >
      <InteractiveViewerPanel
        key={`${productId}-${imageIndex}`}
        productId={productId}
        productName={productName}
        images={images}
        imageIndex={imageIndex}
        onLoadFailed={handleLoadFailed}
      />
    </AppDialog>
  );
}
