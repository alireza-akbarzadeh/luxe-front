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
  const detailAttributes = getDetailTabAttributes(product.attributes);

  const coreRows = [
    ['SKU', product.sku],
    ['Barcode', product.barcode ?? '—'],
    ['Category', product.category?.name ?? '—'],
    ['Brand', product.brand?.name ?? '—'],
    ['Weight', product.weight ? `${product.weight} kg` : '—'],
    ['Digital product', product.is_digital ? 'Yes' : 'No'],
    ['Inventory tracking', product.track_inventory ? 'Enabled' : 'Disabled'],
    ['Backorders', product.allow_backorder ? 'Allowed' : 'Not allowed']
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
          <h3 className='font-display mb-4 text-lg font-semibold'>Advanced details</h3>
          <div className='grid grid-cols-2 gap-2 sm:grid-cols-3'>
            {attributeCards.map((card) => (
              <SpecCard key={card.key} label={card.label} value={card.value} />
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className='font-display mb-4 text-lg font-semibold'>Core specifications</h3>
        <dl className='divide-border divide-y'>
          {coreRows.map(([label, value]) => (
            <div key={label} className='flex justify-between gap-4 py-3 text-sm'>
              <dt className='text-muted-foreground'>{label}</dt>
              <dd className='text-right font-medium'>{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
