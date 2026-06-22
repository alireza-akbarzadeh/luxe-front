'use client';

import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { useLocaleFormatters } from '@/lib/i18n/use-locale-formatters';
import { cn } from '@/lib/utils';

import { useProductFilters } from '../useProductFilters';

export function ShopPagination({ page, totalPages }: { page: number; totalPages: number }) {
  const t = useTranslations('shop.pagination');
  const { formatInteger } = useLocaleFormatters();
  const { setPage } = useProductFilters();

  if (totalPages <= 1) return null;

  const pageNumbers = (() => {
    const maxVisible = 5;
    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    if (page <= 3) {
      return [1, 2, 3, 4, 5];
    }

    if (page >= totalPages - 2) {
      return Array.from({ length: maxVisible }, (_, index) => totalPages - maxVisible + index + 1);
    }

    return [page - 2, page - 1, page, page + 1, page + 2];
  })();

  return (
    <nav className='flex flex-wrap items-center justify-center gap-2 pt-8' aria-label={t('ariaLabel')}>
      <Button
        variant='outline'
        size='sm'
        disabled={page <= 1}
        onClick={() => setPage(page - 1)}
        className='rounded-full'
      >
        {t('previous')}
      </Button>

      <div className='flex items-center gap-1'>
        {pageNumbers.map((pageNum) => (
          <Button
            key={pageNum}
            variant={page === pageNum ? 'default' : 'outline'}
            size='sm'
            className={cn('w-10 rounded-full tabular-nums', page === pageNum && 'shadow-sm')}
            onClick={() => setPage(pageNum)}
            aria-current={page === pageNum ? 'page' : undefined}
          >
            {formatInteger(pageNum)}
          </Button>
        ))}
      </div>

      <Button
        variant='outline'
        size='sm'
        disabled={page >= totalPages}
        onClick={() => setPage(page + 1)}
        className='rounded-full'
      >
        {t('next')}
      </Button>
    </nav>
  );
}
