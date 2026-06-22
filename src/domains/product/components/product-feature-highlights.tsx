'use client';

import { IconChevronDown } from '@tabler/icons-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { DtoProductAttributeResponse } from '@/services/-products-get.schemas';

import {
  formatAttributeLabel,
  formatAttributeValues,
  getDetailTabAttributes
} from '../lib/product-attribute.utils';

const PREVIEW_COUNT = 8;

interface ProductFeatureHighlightsProps {
  attributes?: DtoProductAttributeResponse[];
  detailsAnchorId?: string;
}

function FeatureCard({ label, value }: { label: string; value: string }) {
  return (
    <div className='bg-muted/40 border-border/50 rounded-xl border px-3 py-3'>
      <p className='text-muted-foreground text-[11px] leading-tight font-medium tracking-wide uppercase'>
        {label}
      </p>
      <p className='mt-1.5 text-sm leading-snug font-medium'>{value}</p>
    </div>
  );
}

/** Digikala-style feature grid for PDP hero — key specs at a glance. */
export function ProductFeatureHighlights({
  attributes = [],
  detailsAnchorId = 'product-specs'
}: ProductFeatureHighlightsProps) {
  const t = useTranslations('pdp.features');
  const [expanded, setExpanded] = useState(false);
  const featureAttributes = getDetailTabAttributes(attributes);

  if (!featureAttributes.length) return null;

  const cards = featureAttributes
    .map((attribute) => {
      const values = (attribute.values ?? []).filter(Boolean);
      if (!values.length) return null;
      return {
        key: attribute.name ?? formatAttributeLabel(attribute.name),
        label: formatAttributeLabel(attribute.name),
        value: formatAttributeValues(values)
      };
    })
    .filter(Boolean) as Array<{ key: string; label: string; value: string }>;

  if (!cards.length) return null;

  const visibleCards = expanded ? cards : cards.slice(0, PREVIEW_COUNT);
  const hasHidden = cards.length > PREVIEW_COUNT;

  return (
    <section className='space-y-4'>
      <h2 className='text-base font-semibold tracking-tight'>{t('title')}</h2>

      <div className='grid grid-cols-2 gap-2 sm:grid-cols-3'>
        {visibleCards.map((card) => (
          <FeatureCard key={card.key} label={card.label} value={card.value} />
        ))}
      </div>

      {hasHidden && (
        <div className='flex flex-col items-center gap-2 sm:flex-row sm:justify-center'>
          <Button
            type='button'
            variant='outline'
            className='w-full rounded-full sm:w-auto'
            onClick={() => setExpanded((current) => !current)}
          >
            {expanded ? t('showFewer') : t('viewAll')}
            <IconChevronDown
              className={cn('ms-1 h-4 w-4 transition-transform', expanded && 'rotate-180')}
            />
          </Button>
          {!expanded && (
            <Button asChild variant='ghost' className='rounded-full'>
              <Link href={`#${detailsAnchorId}`}>{t('fullSpecs')}</Link>
            </Button>
          )}
        </div>
      )}
    </section>
  );
}
