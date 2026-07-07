import { IconLoader2 } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import { IMAGE_FALLBACK } from '@/lib/images';
import type { DtoAiInteractiveViewerResponse } from '@/services/-ai-interactive-viewer-post.schemas';

import { useInteractiveViewer } from '../../hooks/use-interactive-viewer';
import { InteractiveViewerHotspotList } from './interactive-viewer-hotspot-list';
import { InteractiveViewerStage } from './interactive-viewer-stage';

interface InteractiveViewerPanelProps {
  productId: number;
  productName?: string;
  images: string[];
  imageIndex: number;
  onLoadFailed: () => void;
}

export function InteractiveViewerPanel({
  productId,
  productName,
  images,
  imageIndex,
  onLoadFailed
}: InteractiveViewerPanelProps) {
  const t = useTranslations('pdp.interactiveViewer');
  const { loadViewer, isPending } = useInteractiveViewer(productId);
  const [viewer, setViewer] = useState<DtoAiInteractiveViewerResponse | null>(null);
  const [activeHotspotId, setActiveHotspotId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const result = await loadViewer(imageIndex);
      if (cancelled) return;
      if (!result) {
        onLoadFailed();
        return;
      }
      setViewer(result);
      setActiveHotspotId(result.hotspots?.[0]?.id ?? null);
    };

    void load();

    return () => {
      cancelled = true;
    };
    // Panel remounts per image; fetch once when opened.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- imageIndex + productId only
  }, [productId, imageIndex]);

  const resolvedIndex = viewer?.image_index ?? imageIndex;
  const imageSrc = images[resolvedIndex] ?? images[0] ?? IMAGE_FALLBACK;
  const hotspots = viewer?.hotspots ?? [];

  return (
    <Flex direction='column' spacing={0} className='min-h-0 lg:flex-row'>
      <Flex className='min-w-0 flex-1 p-4 lg:max-w-[55%]'>
        {isPending ? (
          <Flex
            align='center'
            justify='center'
            direction='column'
            spacing={3}
            className='bg-muted aspect-[4/5] w-full rounded-2xl'
          >
            <IconLoader2 className='text-muted-foreground size-8 animate-spin' />
            <Typography.Muted className='text-sm'>{t('loading')}</Typography.Muted>
          </Flex>
        ) : (
          <InteractiveViewerStage
            imageSrc={imageSrc}
            productName={productName}
            imageIndex={resolvedIndex}
            hotspots={hotspots}
            activeHotspotId={activeHotspotId}
            onSelectHotspot={setActiveHotspotId}
          />
        )}
      </Flex>

      <Flex
        direction='column'
        spacing={4}
        className='border-border min-h-0 flex-1 border-t p-4 lg:border-s lg:border-t-0 lg:p-6'
      >
        {viewer?.summary ? (
          <Typography.Text className='text-sm leading-relaxed'>{viewer.summary}</Typography.Text>
        ) : null}
        {!isPending ? (
          <InteractiveViewerHotspotList
            hotspots={hotspots}
            activeHotspotId={activeHotspotId}
            onSelectHotspot={setActiveHotspotId}
          />
        ) : null}
        <Typography.Muted className='text-xs'>{t('footer')}</Typography.Muted>
      </Flex>
    </Flex>
  );
}
