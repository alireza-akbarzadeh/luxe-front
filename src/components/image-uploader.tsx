'use client';

import { IconPhoto, IconStar, IconStarFilled, IconTrash, IconUpload } from '@tabler/icons-react';
import { useCallback, useRef, useState } from 'react';
import { z } from 'zod';

import { cn } from '@/lib/utils';

// ─── Media ────────────────────────────────────────────────────────────────────

export const mediaFileSchema = z.object({
  id: z.string(),
  file: z.instanceof(File).optional(),
  previewUrl: z.string(),
  alt: z.string().default(''),
  isThumbnail: z.boolean().default(false)
});

export const mediaSchema = z.object({
  images: z.array(mediaFileSchema).min(1, 'Add at least one image')
});

export type MediaFile = z.infer<typeof mediaFileSchema>;

interface ImageUploaderProps {
  value: MediaFile[];
  onChange: (files: MediaFile[]) => void;
  error?: string;
  maxFiles?: number;
}

const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_SIZE_MB = 10;

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

export function ImageUploader({ value, onChange, error, maxFiles = 10 }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const addFiles = useCallback(
    (incoming: FileList | File[]) => {
      const files = Array.from(incoming);
      const valid = files.filter((f) => {
        if (!ACCEPTED.includes(f.type)) return false;
        if (f.size > MAX_SIZE_MB * 1024 * 1024) return false;
        return true;
      });

      const remaining = maxFiles - value.length;
      const toAdd = valid.slice(0, remaining).map<MediaFile>((file, i) => ({
        id: generateId(),
        file,
        previewUrl: URL.createObjectURL(file),
        alt: '',
        isThumbnail: value.length === 0 && i === 0
      }));

      onChange([...value, ...toAdd]);
    },
    [value, onChange, maxFiles]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      addFiles(e.dataTransfer.files);
    },
    [addFiles]
  );

  const handleRemove = useCallback(
    (id: string) => {
      const next = value.filter((f) => f.id !== id);
      // If we removed the thumbnail, assign to first remaining
      if (!next.some((f) => f.isThumbnail) && next.length > 0) {
        next[0]!.isThumbnail = true;
      }
      onChange(next);
    },
    [value, onChange]
  );

  const handleSetThumbnail = useCallback(
    (id: string) => {
      onChange(value.map((f) => ({ ...f, isThumbnail: f.id === id })));
    },
    [value, onChange]
  );

  const handleAltChange = useCallback(
    (id: string, alt: string) => {
      onChange(value.map((f) => (f.id === id ? { ...f, alt } : f)));
    },
    [value, onChange]
  );

  return (
    <div className='space-y-3'>
      {/* Drop zone */}
      <div
        role='button'
        tabIndex={0}
        aria-label='Upload images'
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-10 transition-colors',
          dragging
            ? 'border-primary bg-primary/5'
            : 'border-border hover:border-primary/50 hover:bg-muted/40',
          error && 'border-destructive'
        )}
      >
        <div className='bg-muted flex size-12 items-center justify-center rounded-full'>
          <IconUpload className='text-muted-foreground size-5' />
        </div>
        <div className='text-center'>
          <p className='text-sm font-medium'>
            Drop images here or <span className='text-primary'>browse</span>
          </p>
          <p className='text-muted-foreground mt-0.5 text-xs'>
            PNG, JPG, WEBP, GIF · Max {MAX_SIZE_MB}MB · Up to {maxFiles} images
          </p>
        </div>
        <input
          ref={inputRef}
          type='file'
          accept={ACCEPTED.join(',')}
          multiple
          className='sr-only'
          onChange={(e) => e.target.files && addFiles(e.target.files)}
        />
      </div>

      {/* Error */}
      {error && <p className='text-destructive text-xs'>{error}</p>}

      {/* Preview grid */}
      {value.length > 0 && (
        <div className='grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4'>
          {value.map((item) => (
            <div
              key={item.id}
              className={cn(
                'group bg-muted relative overflow-hidden rounded-lg border transition-shadow',
                item.isThumbnail && 'ring-primary ring-2 ring-offset-2'
              )}
            >
              {/* Image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.previewUrl}
                alt={item.alt || 'Product image'}
                className='aspect-square w-full object-cover'
              />

              {/* Thumbnail badge */}
              {item.isThumbnail && (
                <span className='bg-primary text-primary-foreground absolute top-1.5 left-1.5 rounded px-1.5 py-0.5 text-[10px] font-medium'>
                  Thumbnail
                </span>
              )}

              {/* Hover actions */}
              <div className='absolute inset-0 flex items-center justify-center gap-1.5 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100'>
                <button
                  type='button'
                  title={item.isThumbnail ? 'Current thumbnail' : 'Set as thumbnail'}
                  onClick={() => handleSetThumbnail(item.id)}
                  className='flex size-8 items-center justify-center rounded-md bg-white/20 text-white backdrop-blur-sm transition hover:bg-white/30'
                >
                  {item.isThumbnail ? (
                    <IconStarFilled className='size-4 text-yellow-400' />
                  ) : (
                    <IconStar className='size-4' />
                  )}
                </button>
                <button
                  type='button'
                  title='Remove image'
                  onClick={() => handleRemove(item.id)}
                  className='hover:bg-destructive/80 flex size-8 items-center justify-center rounded-md bg-white/20 text-white backdrop-blur-sm transition'
                >
                  <IconTrash className='size-4' />
                </button>
              </div>

              {/* Alt text input */}
              <div className='bg-background border-t px-2 py-1.5'>
                <input
                  type='text'
                  value={item.alt}
                  onChange={(e) => handleAltChange(item.id, e.target.value)}
                  placeholder='Alt text'
                  className='text-muted-foreground placeholder:text-muted-foreground/60 focus:text-foreground w-full bg-transparent text-xs outline-none'
                />
              </div>
            </div>
          ))}

          {/* Add more tile */}
          {value.length < maxFiles && (
            <button
              type='button'
              onClick={() => inputRef.current?.click()}
              className='border-border text-muted-foreground hover:border-primary/50 hover:text-primary flex aspect-square flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed transition'
            >
              <IconPhoto className='size-6' />
              <span className='text-xs'>Add more</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
