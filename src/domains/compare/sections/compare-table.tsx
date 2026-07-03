'use client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel';
import { CompareAddSlot } from '@/domains/compare/components/compare-add-slot';
import { CompareProductColumn } from '@/domains/compare/components/compare-product-column';
import {
  COMPARE_LABEL_COLUMN_WIDTH,
  COMPARE_PRODUCT_SLIDE_WIDTH,
  COMPARE_ROW_HEIGHT,
  COMPARE_SECTION_HEADER_HEIGHT
} from '@/domains/compare/lib/compare-constants';
import { buildCompareRows, groupCompareRows } from '@/domains/compare/lib/compare-utils';
import { cn } from '@/lib/utils';
import type { DtoCompareProductResponse } from '@/services/-compare-post.schemas';

interface CompareTableProps {
  products: DtoCompareProductResponse[];
  canAddMore: boolean;
  highlightDiffs: boolean;
  removeItem: (productId: number) => Promise<void>;
}

function CompareLabelsPanel({
  sections,
  canAddMore
}: {
  sections: ReturnType<typeof groupCompareRows>;
  canAddMore: boolean;
}) {
  return (
    <div
      className='bg-background border-border/60 shrink-0 border-r'
      style={{ width: COMPARE_LABEL_COLUMN_WIDTH + 200 }}
    >
      <div className='border-border/60 flex border-b'>
        <div className='border-border/60 shrink-0 border-r p-4' style={{ width: 200 }}>
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
            style={{ height: COMPARE_SECTION_HEADER_HEIGHT, marginLeft: 200 }}
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
              style={{ minHeight: COMPARE_ROW_HEIGHT, marginLeft: 200 }}
            >
              {row.label}
            </div>
          ))}
        </section>
      ))}
    </div>
  );
}

export function CompareTable({
  products,
  canAddMore,
  highlightDiffs,
  removeItem
}: CompareTableProps) {
  const rows = buildCompareRows(products);
  const sections = groupCompareRows(rows);

  return (
    <div className='space-y-6'>
      {products.length === 1 && (
        <div className='border-accent/30 bg-accent/5 rounded-2xl border px-4 py-3 text-sm'>
          Add at least one more product to unlock side-by-side comparison highlights and the quick
          summary.
        </div>
      )}

      {/* Desktop — all columns visible, equal width, no carousel */}
      <div className='border-border/70 hidden overflow-hidden rounded-3xl border shadow-sm lg:block'>
        <div className='flex'>
          <CompareLabelsPanel sections={sections} canAddMore={canAddMore} />
          <div
            className='grid min-w-0 flex-1'
            style={{
              gridTemplateColumns: `repeat(${Math.max(products.length, 1)}, minmax(0, 1fr))`
            }}
          >
            {products.map((product) => (
              <CompareProductColumn
                key={product.id}
                product={product}
                products={products}
                rows={rows}
                highlightDiffs={highlightDiffs}
                onRemove={removeItem}
                layout='fluid'
              />
            ))}
          </div>
        </div>
      </div>

      {/* Mobile / tablet — horizontal carousel */}
      <div className='border-border/70 overflow-x-auto overflow-y-hidden rounded-3xl border shadow-sm lg:hidden'>
        <div className='min-w-[680px]'>
          <div className='flex'>
            <CompareLabelsPanel sections={sections} canAddMore={canAddMore} />

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
                      <CompareProductColumn
                        product={product}
                        products={products}
                        rows={rows}
                        highlightDiffs={highlightDiffs}
                        onRemove={removeItem}
                        layout='fixed'
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>

                {products.length > 1 && (
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
              Swipe or use arrows to scroll through compared products
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
