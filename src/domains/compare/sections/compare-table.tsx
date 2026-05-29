'use client';
import {
  IconCheck,
  IconLayersSelected,
  IconPackage,
  IconPlus,
  IconRotateClockwise,
  IconStar,
  IconTruck
} from '@tabler/icons-react';

import { Card } from '@/components/ui/card';
import { AppDialog } from '~/src/components/app-dialog';
import { CompareDialogContent } from '~/src/domains/compare/components/compare-dialog-content';
import { CompareProductCard } from '~/src/domains/compare/components/compare-product-card';
import useCompareController from '~/src/domains/compare/hooks/useCompareController';
import type { DtoCompareProductResponse } from '~/src/services/-compare-post.schemas';

export function CompareTable() {
  const {
    compareProducts: products,
    canAddMore,
    highlightDiffs,
    setHighlightDiffs
  } = useCompareController();

  const getCompareValue = (product: DtoCompareProductResponse, attribute: string) => {
    switch (attribute) {
      case 'price':
        return product.price;
      case 'originalPrice':
        return product.compare_at_price || product.price;
      case 'rating':
        return product.rating || 0;
      case 'reviews':
        return product.reviews_count || 0;
      case 'category':
        return product.category?.name || '';
      case 'store':
        return product.store_name;
      case 'isNew':
        return product.is_new ? 'Yes' : 'No';
      case 'isDigital':
        return product.is_digital ? 'Digital' : 'Physical';
      case 'discount':
        return product.discount_percent || 0;
      case 'shipping':
        return product.shipping_info;
      case 'returns':
        return product.return_policy;
      default:
        return '-';
    }
  };

  const getBestValue = (attribute: string, type: 'min' | 'max') => {
    if (products.length < 2) return null;
    const values = products
      .map((p) => {
        const val = getCompareValue(p, attribute);
        return typeof val === 'number' ? val : null;
      })
      .filter((v) => v !== null) as number[];
    if (values.length < 2) return null;
    return type === 'min' ? Math.min(...values) : Math.max(...values);
  };

  const isHighlighted = (
    product: DtoCompareProductResponse,
    attribute: string,
    type: 'best' | 'worst'
  ) => {
    if (!highlightDiffs || products.length < 2) return false;
    const value = getCompareValue(product, attribute);
    if (typeof value !== 'number') return false;
    if (attribute === 'price' || attribute === 'originalPrice') {
      const best = getBestValue(attribute, 'min');
      const worst = getBestValue(attribute, 'max');
      return type === 'best' ? value === best : value === worst;
    }
    const best = getBestValue(attribute, 'max');
    const worst = getBestValue(attribute, 'min');
    return type === 'best' ? value === best : value === worst;
  };

  const comparisonRows = [
    { key: 'price', label: 'Price', icon: null, suffix: '' },
    { key: 'discount', label: 'Discount', icon: null, suffix: '%' },
    { key: 'rating', label: 'Rating', icon: IconStar, suffix: '' },
    { key: 'reviews', label: 'Reviews', icon: null, suffix: '' },
    { key: 'category', label: 'Category', icon: IconLayersSelected, suffix: '' },
    { key: 'store', label: 'Store', icon: IconPackage, suffix: '' },
    { key: 'isNew', label: 'New Arrival', icon: null, suffix: '' },
    { key: 'isDigital', label: 'Product Type', icon: null, suffix: '' },
    { key: 'shipping', label: 'Shipping', icon: IconTruck, suffix: '' },
    { key: 'returns', label: 'Returns', icon: IconRotateClockwise, suffix: '' }
  ];

  return (
    <div className='overflow-x-auto'>
      <div className='min-w-200'>
        {/* Product Cards Row */}
        <div
          className='mb-6 grid gap-4'
          style={{
            gridTemplateColumns: `200px repeat(${products.length}, 1fr) ${canAddMore ? '120px' : ''}`
          }}
        >
          <div className='p-4' />
          {products.map((product) => (
            <CompareProductCard key={product.id} product={product} />
          ))}
          {canAddMore && (
            <AppDialog
              title='Add Product to Compare'
              trigger={
                <button className='text-muted-foreground hover:text-primary flex flex-col items-center gap-2 p-4 text-sm font-medium'>
                  <div className='bg-muted flex h-12 w-12 items-center justify-center rounded-full'>
                    <IconPlus className='h-6 w-6' />
                  </div>
                  <span>Add Product</span>
                </button>
              }
            >
              <CompareDialogContent />
            </AppDialog>
          )}
        </div>

        {/* Comparison Rows – unchanged */}
        <Card className='overflow-hidden'>
          {comparisonRows.map((row, rowIndex) => (
            <div
              key={row.key}
              className={`grid items-center ${rowIndex % 2 === 0 ? 'bg-muted/30' : ''}`}
              style={{ gridTemplateColumns: `200px repeat(${products.length}, 1fr)` }}
            >
              <div className='flex items-center gap-2 border-r p-4 font-medium'>
                {row.icon && <row.icon className='text-muted-foreground h-4 w-4' />}
                {row.label}
              </div>
              {products.map((product) => {
                const value = getCompareValue(product, row.key);
                const isBest = isHighlighted(product, row.key, 'best');
                const isWorst = isHighlighted(product, row.key, 'worst');
                const displayValue =
                  row.key === 'price' ? (
                    `$${value}`
                  ) : row.key === 'rating' ? (
                    <span className='flex items-center justify-center gap-1'>
                      <IconStar className='fill-accent text-accent h-4 w-4' />
                      {value}
                    </span>
                  ) : (
                    `${value}${row.suffix}`
                  );
                return (
                  <div
                    key={product.id}
                    className={`p-4 text-center ${
                      isBest ? 'bg-green-500/10 font-medium text-green-600 dark:text-green-400' : ''
                    } ${
                      isWorst && row.key === 'price'
                        ? 'bg-red-500/10 text-red-600 dark:text-red-400'
                        : ''
                    }`}
                  >
                    {displayValue}
                    {isBest && row.key !== 'isNew' && row.key !== 'isDigital' && (
                      <IconCheck className='ml-1 inline-block h-4 w-4 text-green-500' />
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </Card>
      </div>
      <div className='mt-4 flex justify-end'>
        <label className='flex items-center gap-2 text-sm'>
          <input
            type='checkbox'
            checked={highlightDiffs}
            onChange={(e) => setHighlightDiffs(e.target.checked)}
            className='border-border rounded'
          />
          Highlight differences
        </label>
      </div>
    </div>
  );
}
