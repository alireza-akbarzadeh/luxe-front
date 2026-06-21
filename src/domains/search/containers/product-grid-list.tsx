'use client';

import { IconSearch } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { ProductCard } from '@/domains/shop/components/product-card';
import { ProductListRow } from '@/domains/shop/components/product-list-row';
import type { DtoProductWithLike } from '@/services/-products-get.schemas';

import { useSearchParams } from '../hooks/useSearchParams';

interface ProductGridListProps {
  products: DtoProductWithLike[];
  total: number;
}

export function ProductGridList(props: ProductGridListProps) {
  const { products, total } = props;
  const searchParams = useSearchParams();
  const t = useTranslations('search');

  const totalPages = Math.ceil(total / searchParams.perPage);

  return (
    <>
      <div
        className={
          searchParams.view === 'grid'
            ? 'grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-3 xl:grid-cols-4'
            : 'flex flex-col gap-4'
        }
      >
        {products.length > 0 ? (
          products.map((product, index) =>
            searchParams.view === 'grid' ? (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
                priority={index === 0}
              />
            ) : (
              <ProductListRow key={product.id} product={product} index={index} />
            )
          )
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='col-span-full py-16 text-center'
          >
            <div className='bg-secondary mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full'>
              <IconSearch className='text-muted-foreground h-10 w-10' />
            </div>
            <h3 className='mb-2 text-xl font-semibold'>{t('empty.title')}</h3>
            <p className='text-muted-foreground mx-auto mb-6 max-w-md'>
              {searchParams.query
                ? t('empty.withQuery', { query: searchParams.query })
                : t('empty.noQuery')}
            </p>
            <div className='flex flex-col justify-center gap-2 sm:flex-row'>
              <Button onClick={searchParams.clearAll}>{t('empty.clearAll')}</Button>
              <Button variant='outline' asChild>
                <Link href='/shop'>{t('empty.browseAll')}</Link>
              </Button>
            </div>
          </motion.div>
        )}
      </div>

      {totalPages > 1 ? (
        <div className='mt-8 flex items-center justify-center gap-2'>
          <Button
            variant='outline'
            size='sm'
            disabled={searchParams.page === 1}
            onClick={() => searchParams.setPage(searchParams.page - 1)}
          >
            {t('pagination.previous')}
          </Button>
          <div className='flex items-center gap-1'>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (searchParams.page <= 3) {
                pageNum = i + 1;
              } else if (searchParams.page >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = searchParams.page - 2 + i;
              }
              return (
                <Button
                  key={pageNum}
                  variant={searchParams.page === pageNum ? 'default' : 'outline'}
                  size='sm'
                  className='w-10'
                  onClick={() => searchParams.setPage(pageNum)}
                  aria-current={searchParams.page === pageNum ? 'page' : undefined}
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>
          <Button
            variant='outline'
            size='sm'
            disabled={searchParams.page === totalPages}
            onClick={() => searchParams.setPage(searchParams.page + 1)}
          >
            {t('pagination.next')}
          </Button>
        </div>
      ) : null}
    </>
  );
}
