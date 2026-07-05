'use client';

import { useTranslations } from 'next-intl';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';
import type { DtoAiProductViewerHotspot } from '@/services/-ai-interactive-viewer-post.schemas';

interface InteractiveViewerHotspotProps {
  hotspot: DtoAiProductViewerHotspot;
  index: number;
  isActive: boolean;
  onSelect: (id: string) => void;
}

/** Clickable hotspot pin on the interactive product image. */
export function InteractiveViewerHotspot({
  hotspot,
  index,
  isActive,
  onSelect
}: InteractiveViewerHotspotProps) {
  const t = useTranslations('pdp.interactiveViewer');

  return (
    <Popover open={isActive} onOpenChange={(open) => open && onSelect(hotspot.id ?? '')}>
      <PopoverTrigger asChild>
        <button
          type='button'
          className={cn(
            'absolute z-10 flex size-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 text-xs font-semibold shadow-md transition-transform outline-none',
            'focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2',
            isActive
              ? 'border-accent bg-accent text-accent-foreground scale-110'
              : 'border-background bg-foreground/90 text-background hover:scale-105'
          )}
          style={{
            left: `${hotspot.x_percent ?? 50}%`,
            top: `${hotspot.y_percent ?? 50}%`
          }}
          aria-label={t('hotspotLabel', { label: hotspot.label ?? '', index: index + 1 })}
          aria-pressed={isActive}
          onClick={() => onSelect(hotspot.id ?? '')}
        >
          {index + 1}
        </button>
      </PopoverTrigger>
      <PopoverContent align='center' className='max-w-xs'>
        <Typography.Text className='mb-1 font-medium'>{hotspot.label}</Typography.Text>
        <Typography.Muted className='text-sm leading-relaxed'>
          {hotspot.description}
        </Typography.Muted>
      </PopoverContent>
    </Popover>
  );
}
