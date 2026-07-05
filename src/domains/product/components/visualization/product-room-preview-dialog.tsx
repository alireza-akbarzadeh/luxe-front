'use client';

import { IconArmchair, IconLoader2 } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Flex } from '@/components/ui/flex';
import { Input } from '@/components/ui/input';
import { readImageDataUrl } from '@/domains/search/lib/read-image-data-url';
import type { DtoAiRoomPreviewResponse } from '@/services/-ai-room-preview-post.schemas';

import { useRoomPreview } from '../../hooks/use-room-preview';
import { RoomPreviewResults } from './room-preview-results';
import { VisualizationImageDropzone } from './visualization-image-dropzone';

interface ProductRoomPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: number;
  productName?: string;
}

/** Room photo upload dialog with AI placement guidance. */
export function ProductRoomPreviewDialog({
  open,
  onOpenChange,
  productId,
  productName
}: ProductRoomPreviewDialogProps) {
  const t = useTranslations('pdp.roomPreview');
  const { previewRoom, isPending } = useRoomPreview(productId);
  const [preview, setPreview] = useState<string | null>(null);
  const [context, setContext] = useState('');
  const [result, setResult] = useState<DtoAiRoomPreviewResponse | null>(null);

  const reset = () => {
    setPreview(null);
    setContext('');
    setResult(null);
  };

  const handleClose = (nextOpen: boolean) => {
    onOpenChange(nextOpen);
    if (!nextOpen) {
      reset();
    }
  };

  const handleFile = async (file: File | undefined) => {
    if (!file) {
      setPreview(null);
      setResult(null);
      return;
    }
    try {
      setPreview(await readImageDataUrl(file));
      setResult(null);
    } catch {
      toast.error(t('errors.readFailed'));
    }
  };

  const handleAnalyze = async () => {
    if (!preview || isPending) return;
    const data = await previewRoom(preview, context);
    if (!data) {
      toast.error(t('errors.analyzeFailed'));
      return;
    }
    setResult(data);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='max-w-md gap-0 overflow-hidden p-0'>
        <DialogHeader className='space-y-1 px-6 pt-6 pb-4 text-start'>
          <DialogTitle className='flex items-center gap-2'>
            <IconArmchair className='size-5' />
            {t('title')}
          </DialogTitle>
          <DialogDescription>
            {productName ? t('descriptionNamed', { name: productName }) : t('description')}
          </DialogDescription>
        </DialogHeader>

        <div className='px-6 pb-6'>
          {result ? (
            <RoomPreviewResults result={result} />
          ) : (
            <>
              <VisualizationImageDropzone
                preview={preview}
                onPick={(file) => void handleFile(file)}
                title={t('dropzoneTitle')}
                hint={t('dropzoneHint')}
                changePhotoLabel={t('changePhoto')}
                uploadLabel={t('upload')}
              />
              <Input
                value={context}
                onChange={(event) => setContext(event.target.value)}
                placeholder={t('contextPlaceholder')}
                className='mb-4 rounded-full'
              />
            </>
          )}

          <Flex direction='row' spacing={2} className='mt-4'>
            {result ? (
              <Button type='button' variant='outline' className='flex-1' onClick={reset}>
                {t('tryAnother')}
              </Button>
            ) : (
              <Button
                type='button'
                className='flex-1'
                disabled={!preview || isPending}
                onClick={() => void handleAnalyze()}
              >
                {isPending ? (
                  <>
                    <IconLoader2 className='me-2 size-4 animate-spin' />
                    {t('analyzing')}
                  </>
                ) : (
                  t('analyze')
                )}
              </Button>
            )}
          </Flex>
        </div>
      </DialogContent>
    </Dialog>
  );
}
