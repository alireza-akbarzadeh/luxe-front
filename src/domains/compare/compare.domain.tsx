'use client';

import { IconChevronRight } from '@tabler/icons-react';
import Link from 'next/link';

import { DynamicBreadcrumb } from '@/components/breadcrumb-list';
import { Button } from '@/components/ui/button';
import { CompareSkeleton } from '@/domains/compare/components/compare-skeleton';
import { CompareAiInsight } from '@/domains/compare/sections/compare-ai-insight';
import { CompareEmptyState } from '@/domains/compare/sections/compare-empty-state';
import { CompareHeader } from '@/domains/compare/sections/compare-header';
import { CompareSummary } from '@/domains/compare/sections/compare-summary';
import { CompareTable } from '@/domains/compare/sections/compare-table';

import useCompareController from './hooks/useCompareController';

const compareBreadcrumb = (
  <DynamicBreadcrumb
    items={[{ label: 'Compare' }]}
    direction='column'
    separator={<IconChevronRight className='h-3 w-3' />}
    className='text-muted-foreground text-xs'
    breadcrumbClassName='flex items-center gap-1.5'
    showBackButton={false}
  />
);

export function CompareDomain() {
  const controller = useCompareController();
  const {
    items,
    compareProducts,
    isLoading,
    clearAll,
    highlightDiffs,
    setHighlightDiffs,
    isAuthenticated,
    removeItem,
    canAddMore,
    maxCompare
  } = controller;

  if (isLoading) {
    return (
      <div className='app-container py-8 pt-24'>
        {compareBreadcrumb}
        <CompareSkeleton />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className='app-container py-8 pt-24'>
        {compareBreadcrumb}
        <div className='py-20 text-center'>
          <h2 className='mb-2 text-2xl font-semibold'>Sign in to compare products</h2>
          <p className='text-muted-foreground mx-auto mb-8 max-w-md'>
            Save up to four products side by side to compare price, ratings, seller details, and
            specifications.
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
      {compareBreadcrumb}

      <CompareHeader
        itemCount={items.length}
        maxCompare={maxCompare}
        clearAll={clearAll}
        highlightDiffs={highlightDiffs}
        setHighlightDiffs={setHighlightDiffs}
      />

      {items.length === 0 ? (
        <CompareEmptyState />
      ) : (
        <>
          <CompareTable
            products={compareProducts}
            canAddMore={canAddMore}
            highlightDiffs={highlightDiffs}
            removeItem={removeItem}
          />
          {items.length >= 2 ? <CompareAiInsight productIds={items} /> : null}
          {items.length >= 2 && <CompareSummary products={compareProducts} />}
        </>
      )}
    </div>
  );
}
