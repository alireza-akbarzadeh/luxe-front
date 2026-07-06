'use client';

import { IconCamera, IconLoader2, IconPhoto, IconUpload } from '@tabler/icons-react';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

import { AppDialog } from '@/components/app-dialog';
import { AppImage } from '@/components/ui/app-image';
import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';

import { useVisualSearch } from '../hooks/use-visual-search';
import { useSearchParams } from '../hooks/useSearchParams';
import { readImageDataUrl } from '../lib/read-image-data-url';
import { useSearchStore } from '../search.store';
import { buildVisualSearchUrl } from '../search.utils';

interface VisualSearchDialogProps {
  /** When true, stacks as a Vaul nested drawer over the mobile search sheet. */
  nested?: boolean;
}

/** Upload a product photo and find similar catalog items. */
export function VisualSearchDialog({ nested = false }: VisualSearchDialogProps) {
  const t = useTranslations('search.visual');
  const isOpen = useSearchStore((state) => state.isVisualSearchOpen);
  const setVisualSearchOpen = useSearchStore((state) => state.setVisualSearchOpen);
  const closeSearchSheet = useSearchStore((state) => state.closeSearchSheet);
  const setVisualContext = useSearchStore((state) => state.setVisualContext);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { searchByImage, isPending } = useVisualSearch();

  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const resetLocal = () => {
    setPreview(null);
    setIsDragOver(false);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleClose = (open: boolean) => {
    setVisualSearchOpen(open);
    if (!open) {
      resetLocal();
    }
  };

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    try {
      const dataUrl = await readImageDataUrl(file);
      setPreview(dataUrl);
    } catch (error) {
      const code = error instanceof Error ? error.message : 'read_failed';
      if (code === 'too_large') {
        toast.error(t('errors.tooLarge'));
      } else if (code === 'unsupported_type') {
        toast.error(t('errors.unsupportedType'));
      } else {
        toast.error(t('errors.readFailed'));
      }
    }
  };

  const handleSubmit = async () => {
    if (!preview || isPending) return;

    const result = await searchByImage(preview);
    if (!result?.search_query) {
      toast.error(t('errors.analyzeFailed'));
      return;
    }

    setVisualContext(preview, result.interpretation ?? t('fallbackInterpretation'));
    closeSearchSheet();

    if (pathname === '/search') {
      searchParams.applyVisualSearch(result);
    } else {
      router.push(buildVisualSearchUrl(result));
    }

    useSearchStore.getState().addRecentSearch(result.search_query, Number(result.total ?? 0));
    useSearchStore.getState().incrementSearchCount();
    handleClose(false);
  };

  return (
    <AppDialog
      nested={nested}
      open={isOpen}
      onOpenChange={handleClose}
      size='md'
      tabBarPadding={!nested}
      contentClassName='px-0 pb-0'
    >
      <Flex
        direction='column'
        spacing={1}
        className='border-border shrink-0 border-b px-6 py-4 text-start'
      >
        <Flex align='center' spacing={2}>
          <IconCamera className='size-5 shrink-0' aria-hidden />
          <Typography.H3 className='text-lg font-semibold'>{t('dialogTitle')}</Typography.H3>
        </Flex>
        <Typography.Muted className='text-sm'>{t('dialogDescription')}</Typography.Muted>
      </Flex>

      <div className='px-6 py-4'>
        <input
          ref={inputRef}
          type='file'
          accept='image/jpeg,image/png,image/webp,image/gif'
          capture='environment'
          className='sr-only'
          onChange={(event) => void handleFile(event.target.files?.[0])}
        />

        {preview ? (
          <div className='relative mb-4 aspect-[4/3] overflow-hidden rounded-2xl border'>
            <AppImage src={preview} alt='' fill sizes='400px' className='object-cover' />
          </div>
        ) : (
          <button
            type='button'
            onClick={() => inputRef.current?.click()}
            onDragOver={(event) => {
              event.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={(event) => {
              event.preventDefault();
              setIsDragOver(false);
              const file = event.dataTransfer.files?.[0];
              void handleFile(file);
            }}
            className={cn(
              'border-border hover:border-primary/40 mb-4 flex w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-10 transition-colors',
              isDragOver && 'border-primary bg-primary/5'
            )}
          >
            <Flex align='center' justify='center' className='bg-muted size-14 rounded-full'>
              <IconPhoto className='text-muted-foreground size-7' />
            </Flex>
            <Flex direction='column' spacing={1} className='text-center'>
              <Typography.Small weight='semibold'>{t('dropzoneTitle')}</Typography.Small>
              <Typography.Muted className='text-sm'>{t('dropzoneHint')}</Typography.Muted>
            </Flex>
          </button>
        )}

        <Flex direction='row' spacing={2}>
          {preview ? (
            <Button type='button' variant='outline' className='flex-1' onClick={resetLocal}>
              {t('changePhoto')}
            </Button>
          ) : (
            <Button
              type='button'
              variant='outline'
              className='flex-1'
              onClick={() => inputRef.current?.click()}
            >
              <IconUpload className='cn-rtl-flip me-2 size-4' />
              {t('upload')}
            </Button>
          )}
          <Button
            type='button'
            className='flex-1'
            disabled={!preview || isPending}
            onClick={() => void handleSubmit()}
          >
            {isPending ? (
              <>
                <IconLoader2 className='me-2 size-4 animate-spin' />
                {t('searching')}
              </>
            ) : (
              t('findSimilar')
            )}
          </Button>
        </Flex>
      </div>
    </AppDialog>
  );
}
