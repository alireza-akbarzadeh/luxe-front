'use client';

import { CompareProductCard } from '@/domains/compare/components/compare-product-card';
import { CompareValueCell } from '@/domains/compare/components/compare-value-cell';
import {
  COMPARE_PRODUCT_CARD_HEIGHT,
  COMPARE_PRODUCT_SLIDE_WIDTH,
  COMPARE_SECTION_HEADER_HEIGHT
} from '@/domains/compare/lib/compare-constants';
import {
  type CompareRowDefinition,
  formatCompareValue,
  groupCompareRows,
  isBestCell
} from '@/domains/compare/lib/compare-utils';
import { cn } from '@/lib/utils';
import type { DtoCompareProductResponse } from '@/services/-compare-post.schemas';

interface CompareProductColumnProps {
  product: DtoCompareProductResponse;
  products: DtoCompareProductResponse[];
  rows: CompareRowDefinition[];
  highlightDiffs: boolean;
  onRemove: (productId: number) => Promise<void>;
  /** Fixed width for mobile carousel slides; fluid on desktop. */
  layout?: 'fluid' | 'fixed';
}

export function CompareProductColumn({
  product,
  products,
  rows,
  highlightDiffs,
  onRemove,
  layout = 'fluid'
}: CompareProductColumnProps) {
  const sections = groupCompareRows(rows);
  const isFixed = layout === 'fixed';

  return (
    <div
      className={cn(
        'border-border/60 flex h-full min-w-0 flex-col border-r last:border-r-0',
        isFixed && 'shrink-0'
      )}
      style={isFixed ? { width: COMPARE_PRODUCT_SLIDE_WIDTH } : undefined}
    >
      <div
        className='border-border/60 shrink-0 border-b p-4'
        style={{ height: COMPARE_PRODUCT_CARD_HEIGHT }}
      >
        <CompareProductCard product={product} onRemove={onRemove} compact />
      </div>

      {[...sections.entries()].map(([sectionName, sectionRows]) => (
        <section key={`${product.id}-${sectionName}`}>
          <div
            className='bg-muted/50 border-border/60 border-b'
            style={{ height: COMPARE_SECTION_HEADER_HEIGHT }}
            aria-hidden
          />

          {sectionRows.map((row, rowIndex) => {
            const rawValue = row.getValue(product);
            const displayValue = formatCompareValue(row, rawValue);
            const isBest = isBestCell(products, row, product, highlightDiffs);

            return (
              <div
                key={`${product.id}-${row.key}`}
                className={cn(rowIndex % 2 === 0 ? 'bg-background' : 'bg-muted/20')}
              >
                <CompareValueCell
                  displayValue={displayValue}
                  isBest={isBest}
                  isRating={row.key === 'rating'}
                />
              </div>
            );
          })}
        </section>
      ))}
    </div>
  );
}
