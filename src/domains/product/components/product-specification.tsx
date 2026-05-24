import type { DtoProductResponse } from '~/src/services/-products-get.schemas';

interface ProductSpecificationsProps {
  product: DtoProductResponse;
}

export function ProductSpecifications(props: ProductSpecificationsProps) {
  const { product } = props;
  return (
    <dl className='divide-border divide-y'>
      {[
        ['SKU', product.sku],
        ['Category', product.category?.name],
        ['Material', 'Premium quality blend'],
        ['Weight', product.weight],
        ['Dimensions', '10" x 8" x 4"'],
        ['Origin', 'Italy'],
        ['isDigital', product.is_digital ? 'Yes' : 'No'],
        ['Barcode', product.barcode ?? '-']
      ].map(([k, v]) => (
        <div key={k} className='flex justify-between py-3 text-sm'>
          <dt className='text-muted-foreground'>{k}</dt>
          <dd className='font-medium'>{v}</dd>
        </div>
      ))}
    </dl>
  );
}
