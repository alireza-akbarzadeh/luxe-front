'use client';
import Link from 'next/link';

import { DynamicBreadcrumb } from '@/components/breadcrumb-list';
import { Button } from '@/components/ui/button';
import { CompareSkeleton } from '@/domains/compare/components/compare-skeleton';
import { CompareEmptyState } from '@/domains/compare/sections/compare-empty-state';
import { CompareHeader } from '@/domains/compare/sections/compare-header';
import { CompareSummary } from '@/domains/compare/sections/compare-summary';
import { CompareTable } from '@/domains/compare/sections/compare-table';

import useCompareController from './hooks/useCompareController';

export function CompareDomain() {
  const { items, compareProducts, isLoading, clearAll, highlightDiffs, setHighlightDiffs, isAuthenticated } =
    useCompareController();

  if (isLoading) {
    return <CompareSkeleton />;
  }

  if (!isAuthenticated) {
    return (
      <div className='app-container py-8 pt-24'>
        <DynamicBreadcrumb direction='column' segments={['Compare Products']} />
        <div className='py-20 text-center'>
          <h2 className='mb-2 text-2xl font-semibold'>Sign in to compare products</h2>
          <p className='text-muted-foreground mx-auto mb-8 max-w-md'>
            Save up to four products side by side to compare price, ratings, and seller details.
          </p>
          <Button asChild size='lg' className='rounded-full'>
            <Link href='/login?callbackUrl=%2Fcompare'>Sign in</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='app-container py-8 pt-24'>
      <DynamicBreadcrumb direction='column' segments={['Compare Products']} />
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
