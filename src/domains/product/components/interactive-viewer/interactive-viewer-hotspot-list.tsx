'use client';

import { useTranslations } from 'next-intl';

import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';
import type { DtoAiProductViewerHotspot } from '@/services/-ai-interactive-viewer-post.schemas';

interface InteractiveViewerHotspotListProps {
  hotspots: DtoAiProductViewerHotspot[];
  activeHotspotId: string | null;
  onSelectHotspot: (id: string) => void;
}

/** Sidebar list of hotspot features for keyboard and screen-reader access. */
export function InteractiveViewerHotspotList({
  hotspots,
  activeHotspotId,
  onSelectHotspot
}: InteractiveViewerHotspotListProps) {
  const t = useTranslations('pdp.interactiveViewer');

  if (hotspots.length === 0) {
    return null;
  }

  return (
    <Flex direction='column' spacing={2} className='min-h-0 flex-1'>
      <Typography.Text className='font-medium'>{t('featuresTitle')}</Typography.Text>
      <ul className='min-h-0 space-y-2 overflow-y-auto pe-1'>
        {hotspots.map((hotspot, index) => {
          const id = hotspot.id ?? '';
          const isActive = activeHotspotId === id;

          return (
            <li key={id || `${index}-${hotspot.label}`}>
              <button
                type='button'
                onClick={() => onSelectHotspot(id)}
                className={cn(
                  'border-border hover:bg-muted/60 w-full rounded-xl border px-3 py-2.5 text-start transition-colors',
                  'focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none',
                  isActive && 'border-accent bg-accent/5 ring-accent/20 ring-1'
                )}
                aria-current={isActive ? 'true' : undefined}
              >
                <Typography.Text variant='small' className='font-medium'>
                  {index + 1}. {hotspot.label}
                </Typography.Text>
                <Typography.Muted className='mt-1 line-clamp-2 text-xs leading-relaxed'>
                  {hotspot.description}
                </Typography.Muted>
              </button>
            </li>
          );
        })}
      </ul>
    </Flex>
  );
}
