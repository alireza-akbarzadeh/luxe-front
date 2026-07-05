'use client';

import { IconArmchair, IconHanger } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { ProductRoomPreviewDialog } from '~/src/domains/product/components/visualization/product-room-preview-dialog';
import { ProductVirtualTryOnDialog } from '~/src/domains/product/components/visualization/product-virtual-try-on-dialog';

/** PDP triggers for AI room preview and virtual try-on. */
export function ProductVisualizationActions({
  productId,
  productName
}: {
  productId: number;
  productName?: string;
}) {
  const tRoom = useTranslations('pdp.roomPreview');
  const tTryOn = useTranslations('pdp.virtualTryOn');
  const [roomOpen, setRoomOpen] = useState(false);
  const [tryOnOpen, setTryOnOpen] = useState(false);

  if (!productId) {
    return null;
  }

  return (
    <Flex direction='column' spacing={2}>
      <Button
        type='button'
        variant='outline'
        className='border-gold/30 bg-gold/5 hover:bg-gold/10 h-11 w-full justify-start gap-2 rounded-full px-4 text-sm font-medium'
        onClick={() => setRoomOpen(true)}
      >
        <IconArmchair className='text-gold-strong size-4 shrink-0' />
        {tRoom('button')}
      </Button>
      <Button
        type='button'
        variant='outline'
        className='border-gold/30 bg-gold/5 hover:bg-gold/10 h-11 w-full justify-start gap-2 rounded-full px-4 text-sm font-medium'
        onClick={() => setTryOnOpen(true)}
      >
        <IconHanger className='text-gold-strong size-4 shrink-0' />
        {tTryOn('button')}
      </Button>
      <ProductRoomPreviewDialog
        open={roomOpen}
        onOpenChange={setRoomOpen}
        productId={productId}
        productName={productName}
      />
      <ProductVirtualTryOnDialog
        open={tryOnOpen}
        onOpenChange={setTryOnOpen}
        productId={productId}
        productName={productName}
      />
    </Flex>
  );
}
