'use client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel';
import { CompareAddSlot } from '@/domains/compare/components/compare-add-slot';
import { CompareProductCard } from '@/domains/compare/components/compare-product-card';
import { CompareValueCell } from '@/domains/compare/components/compare-value-cell';
import {
  COMPARE_LABEL_COLUMN_WIDTH,
  COMPARE_PRODUCT_CARD_HEIGHT,
  COMPARE_PRODUCT_SLIDE_WIDTH,
  COMPARE_ROW_HEIGHT,
  COMPARE_SECTION_HEADER_HEIGHT
} from '@/domains/compare/lib/compare-constants';
import {
  buildCompareRows,
  formatCompareValue,
  groupCompareRows,
  isBestCell
} from '@/domains/compare/lib/compare-utils';
import { cn } from '@/lib/utils';
import type { DtoCompareProductResponse } from '@/services/-compare-post.schemas';

interface CompareTableProps {
  products: DtoCompareProductResponse[];
  canAddMore: boolean;
  highlightDiffs: boolean;
  removeItem: (productId: number) => Promise<void>;
}

export function CompareTable({ products, canAddMore, highlightDiffs, removeItem }: CompareTableProps) {
  const rows = buildCompareRows(products);
  const sections = groupCompareRows(rows);
  const showCarouselNav = products.length > 1;

  return (
    <div className='space-y-6'>
      {products.length === 1 && (
        <div className='border-accent/30 bg-accent/5 rounded-2xl border px-4 py-3 text-sm'>
          Add at least one more product to unlock side-by-side comparison highlights and the quick
          summary.
        </div>
      )}

      <div className='border-border/70 overflow-x-auto overflow-y-hidden rounded-3xl border shadow-sm'>
        <div className='min-w-[680px]'>
        <div className='flex'>
          {/* Fixed left: add slot + row labels */}
          <div
            className='bg-background border-border/60 shrink-0 border-r'
            style={{ width: COMPARE_LABEL_COLUMN_WIDTH + 200 }}
          >
            <div className='border-border/60 flex border-b'>
              <div
                className='border-border/60 shrink-0 border-r p-4'
                style={{ width: 200 }}
              >
                <CompareAddSlot canAddMore={canAddMore} />
              </div>
              <div
                className='text-muted-foreground flex items-end px-4 pb-4 text-xs font-semibold tracking-[0.18em] uppercase'
                style={{ width: COMPARE_LABEL_COLUMN_WIDTH }}
              >
                Details
              </div>
            </div>

            {[...sections.entries()].map(([sectionName, sectionRows]) => (
              <section key={sectionName}>
                <div
                  className='bg-muted/50 border-border/60 text-muted-foreground flex items-center border-b px-4 text-xs font-semibold tracking-[0.18em] uppercase'
                  style={{
                    height: COMPARE_SECTION_HEADER_HEIGHT,
                    marginLeft: 200
                  }}
                >
                  {sectionName}
                </div>

                {sectionRows.map((row, rowIndex) => (
                  <div
                    key={row.key}
                    className={cn(
                      'border-border/40 text-foreground flex items-center border-b px-4 text-sm font-medium last:border-b-0',
                      rowIndex % 2 === 0 ? 'bg-background' : 'bg-muted/20'
                    )}
                    style={{
                      minHeight: COMPARE_ROW_HEIGHT,
                      marginLeft: 200
                    }}
                  >
                    {row.label}
                  </div>
                ))}
              </section>
            ))}
          </div>

          {/* Embla carousel — each slide is one product column (card + values) */}
          <div className='relative min-w-0 flex-1'>
            <Carousel
              opts={{
                align: 'start',
                dragFree: true,
                containScroll: 'trimSnaps'
              }}
              className='w-full'
            >
              <CarouselContent className='ml-0'>
                {products.map((product) => (
                  <CarouselItem
                    key={product.id}
                    className='basis-[280px] pl-0'
                    style={{ maxWidth: COMPARE_PRODUCT_SLIDE_WIDTH }}
                  >
                    <div
                      className='border-border/60 flex h-full flex-col border-r'
                      style={{ width: COMPARE_PRODUCT_SLIDE_WIDTH }}
                    >
                      <div
                        className='border-border/60 shrink-0 border-b p-4'
                        style={{ height: COMPARE_PRODUCT_CARD_HEIGHT }}
                      >
                        <CompareProductCard
                          product={product}
                          onRemove={removeItem}
                          compact
                        />
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
                  </CarouselItem>
                ))}
              </CarouselContent>

              {showCarouselNav && (
                <>
                  <CarouselPrevious className='bg-background/95 top-[160px] left-2 z-10 shadow-md backdrop-blur' />
                  <CarouselNext className='bg-background/95 top-[160px] right-2 z-10 shadow-md backdrop-blur' />
                </>
              )}
            </Carousel>
          </div>
        </div>

        {products.length > 1 && (
          <p className='text-muted-foreground border-border/60 border-t px-4 py-3 text-center text-xs'>
            Drag or use arrows to scroll through compared products
          </p>
        )}
        </div>
      </div>
    </div>
  );
}
