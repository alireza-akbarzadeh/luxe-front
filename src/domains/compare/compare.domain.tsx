'use client';
import { DynamicBreadcrumb } from '@/components/breadcrumb-list';
import { CompareSkeleton } from '@/domains/compare/components/compare-skeleton';
import { CompareEmptyState } from '@/domains/compare/sections/compare-empty-state';
import { CompareHeader } from '@/domains/compare/sections/compare-header';
import { CompareSummary } from '@/domains/compare/sections/compare-summary';
import { CompareTable } from '@/domains/compare/sections/compare-table';
import useCompareController from './hooks/useCompareController';

export function CompareDomain() {
  const { items, compareProducts, isLoading, clearAll, highlightDiffs, setHighlightDiffs } =
    useCompareController();

  if (isLoading) {
    return <CompareSkeleton />;
  }

  return (
    <div className='mx-auto max-w-7xl px-4 py-8 pt-24'>
      <DynamicBreadcrumb segments={['Compare Products']} />
      <CompareHeader
        itemCount={items.length}
        maxCompare={4}
        clearAll={clearAll}
        highlightDiffs={highlightDiffs}
        setHighlightDiffs={setHighlightDiffs}
      />
      {items.length === 0 ? (
        <CompareEmptyState />
      ) : (
        <>
          <CompareTable />
          {items.length >= 2 && <CompareSummary products={compareProducts} />}
        </>
      )}
    </div>
  );
}
