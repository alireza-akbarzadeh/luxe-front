'use client';

import { AppImage } from '@/components/ui/app-image';
import { IMAGE_FALLBACK } from '@/lib/images';
import type { DtoAiProductViewerHotspot } from '@/services/-ai-interactive-viewer-post.schemas';

import { InteractiveViewerHotspot } from './interactive-viewer-hotspot';

interface InteractiveViewerStageProps {
  imageSrc: string;
  productName?: string;
  imageIndex: number;
  hotspots: DtoAiProductViewerHotspot[];
  activeHotspotId: string | null;
  onSelectHotspot: (id: string) => void;
}

/** Product photo layer with positioned AI hotspot pins. */
export function InteractiveViewerStage({
  imageSrc,
  productName,
  imageIndex,
  hotspots,
  activeHotspotId,
  onSelectHotspot
}: InteractiveViewerStageProps) {
  const alt = productName
    ? `${productName} — interactive view ${imageIndex + 1}`
    : 'Product interactive view';

  return (
    <div className='bg-muted relative aspect-[4/5] w-full overflow-hidden rounded-2xl border'>
      <AppImage
        src={imageSrc || IMAGE_FALLBACK}
        alt={alt}
        fill
        sizes='(max-width: 768px) 100vw, 480px'
        className='object-cover'
        priority
      />
      {hotspots.map((hotspot, index) => (
        <InteractiveViewerHotspot
          key={hotspot.id ?? `${index}-${hotspot.label}`}
          hotspot={hotspot}
          index={index}
          isActive={activeHotspotId === hotspot.id}
          onSelect={onSelectHotspot}
        />
      ))}
    </div>
  );
}
