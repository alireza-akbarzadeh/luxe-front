'use client';

import { IconPhoto, IconUpload } from '@tabler/icons-react';
import { useRef, useState } from 'react';

import { AppImage } from '@/components/ui/app-image';
import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';

interface VisualizationImageDropzoneProps {
  preview: string | null;
  onPick: (file: File | undefined) => void;
  title: string;
  hint: string;
  changePhotoLabel: string;
  uploadLabel: string;
}

/** Shared photo upload dropzone for PDP visualization dialogs. */
export function VisualizationImageDropzone({
  preview,
  onPick,
  title,
  hint,
  changePhotoLabel,
  uploadLabel
}: VisualizationImageDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  return (
    <>
      <input
        ref={inputRef}
        type='file'
        accept='image/jpeg,image/png,image/webp,image/gif'
        capture='environment'
        className='sr-only'
        onChange={(event) => void onPick(event.target.files?.[0])}
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
            void onPick(event.dataTransfer.files?.[0]);
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
            <Typography.Small weight='semibold'>{title}</Typography.Small>
            <Typography.Muted className='text-sm'>{hint}</Typography.Muted>
          </Flex>
        </button>
      )}
      <Flex direction='row' spacing={2}>
        {preview ? (
          <Button
            type='button'
            variant='outline'
            className='flex-1'
            onClick={() => {
              onPick(undefined);
              if (inputRef.current) {
                inputRef.current.value = '';
              }
            }}
          >
            {changePhotoLabel}
          </Button>
        ) : (
          <Button
            type='button'
            variant='outline'
            className='flex-1'
            onClick={() => inputRef.current?.click()}
          >
            <IconUpload className='cn-rtl-flip me-2 size-4' />
            {uploadLabel}
          </Button>
        )}
      </Flex>
    </>
  );
}
