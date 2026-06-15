import type { DtoProductWithLike } from '@/services/-products-get.schemas';

import { getDetailTabAttributes } from '../lib/product-attribute.utils';
import { ProductDetailsHighlights } from './product-details-highlights';
import { ProductDynamicAttributes } from './product-dynamic-attributes';

interface ProductSpecificationsProps {
  product: DtoProductWithLike;
}

export function ProductSpecifications({ product }: ProductSpecificationsProps) {
  const detailAttributes = getDetailTabAttributes(product.attributes);

  const coreRows = [
    ['SKU', product.sku],
    ['Barcode', product.barcode ?? '—'],
    ['Category', product.category?.name ?? '—'],
    ['Brand', product.brand?.name ?? '—'],
    ['Weight', product.weight ? `${product.weight}` : '—'],
    ['Digital product', product.is_digital ? 'Yes' : 'No'],
    ['Inventory tracking', product.track_inventory ? 'Enabled' : 'Disabled'],
    ['Backorders', product.allow_backorder ? 'Allowed' : 'Not allowed']
  ] as const;

  return (
    <div className='space-y-10'>
      <ProductDetailsHighlights product={product} />

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

      <div>
        <h3 className='font-display mb-4 text-lg font-semibold'>Product attributes</h3>
        <div className='border-border/60 rounded-2xl border p-4 sm:p-6'>
          <ProductDynamicAttributes attributes={detailAttributes} />
        </div>
      </div>
    </div>
  );
}
