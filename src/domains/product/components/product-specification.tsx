'use client';

import { useTranslations } from 'next-intl';

import type { DtoProductWithLike } from '@/services/-products-get.schemas';

import {
  formatAttributeLabel,
  formatAttributeValues,
  getDetailTabAttributes
} from '../lib/product-attribute.utils';
import { ProductDetailsHighlights } from './product-details-highlights';

interface ProductSpecificationsProps {
  product: DtoProductWithLike;
}

function SpecCard({ label, value }: { label: string; value: string }) {
  return (
    <div className='bg-muted/40 border-border/50 rounded-xl border px-3 py-3'>
      <p className='text-muted-foreground text-[11px] leading-tight font-medium tracking-wide uppercase'>
        {label}
      </p>
      <p className='mt-1.5 text-sm leading-snug font-medium'>{value}</p>
    </div>
  );
}

export function ProductSpecifications({ product }: ProductSpecificationsProps) {
  const t = useTranslations('pdp.specs');
  const detailAttributes = getDetailTabAttributes(product.attributes);

  const empty = t('emptyValue');
  const yesNo = (value: boolean) => (value ? t('yes') : t('no'));

  const coreRows = [
    [t('sku'), product.sku],
    [t('barcode'), product.barcode ?? empty],
    [t('category'), product.category?.name ?? empty],
    [t('brand'), product.brand?.name ?? empty],
    [
      t('weight'),
      product.weight ? t('weightValue', { weight: product.weight }) : empty
    ],
    [t('digitalProduct'), yesNo(Boolean(product.is_digital))],
    [t('inventoryTracking'), product.track_inventory ? t('enabled') : t('disabled')],
    [t('backorders'), product.allow_backorder ? t('allowed') : t('notAllowed')]
  ] as const;

  const attributeCards = detailAttributes
    .map((attribute) => {
      const values = (attribute.values ?? []).filter(Boolean);
      if (!values.length) return null;
      return {
        key: attribute.name ?? formatAttributeLabel(attribute.name),
        label: formatAttributeLabel(attribute.name),
        value: formatAttributeValues(values, 120)
      };
    })
    .filter(Boolean) as Array<{ key: string; label: string; value: string }>;

  return (
    <div className='space-y-10'>
      <ProductDetailsHighlights product={product} />

      {attributeCards.length > 0 && (
        <div>
          <h3 className='font-display mb-4 text-lg font-semibold'>{t('advancedDetails')}</h3>
          <div className='grid grid-cols-2 gap-2 sm:grid-cols-3'>
            {attributeCards.map((card) => (
              <SpecCard key={card.key} label={card.label} value={card.value} />
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className='font-display mb-4 text-lg font-semibold'>{t('coreSpecs')}</h3>
        <dl className='divide-border divide-y'>
          {coreRows.map(([label, value]) => (
            <div key={label} className='flex justify-between gap-4 py-3 text-sm'>
              <dt className='text-muted-foreground'>{label}</dt>
              <dd className='text-end font-medium'>{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
