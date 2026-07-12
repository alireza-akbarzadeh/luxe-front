'use client';

import { IconSearch, IconTrendingUp, IconX } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useEffect, useRef } from 'react';

import { AppDialog } from '@/components/app-dialog';
import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Input } from '@/components/ui/input';
import { Typography } from '@/components/ui/typography';

import { useCartAddItemsSearch } from '../hooks/use-cart-add-items-search';
import { CartAddItemsProductRow } from './cart-add-items-product-row';

interface CartAddItemsSearchDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/** Full-height product search drawer — add to basket inline without leaving cart. */
export function CartAddItemsSearchDrawer({ open, onOpenChange }: CartAddItemsSearchDrawerProps) {
  return (
    <AppDialog
      open={open}
      onOpenChange={onOpenChange}
      size='full'
      tabBarPadding={false}
      className='z-[80] h-[96dvh] max-h-[96dvh]'
      contentClassName='flex min-h-0 flex-1 flex-col overflow-hidden p-0 px-0 pb-0'
    >
      {open ? <CartAddItemsSearchDrawerContent onClose={() => onOpenChange(false)} /> : null}
    </AppDialog>
  );
}

function CartAddItemsSearchDrawerContent({ onClose }: { onClose: () => void }) {
  const t = useTranslations('cart.mobileSummary.addItemsDrawer');
  const tSearch = useTranslations('search');
  const inputRef = useRef<HTMLInputElement>(null);
  const { inputValue, setInputValue, products, trendingSearches, isLoading, hasQuery } =
    useCartAddItemsSearch();

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <>
      <Flex
        direction='column'
        spacing={0}
        className='border-border shrink-0 border-b px-5 py-4 text-start'
      >
        <Flex align='start' justify='between' spacing={3}>
          <Flex direction='column' spacing={1} className='min-w-0'>
            <Typography.H3 className='font-display text-xl'>{t('title')}</Typography.H3>
            <Typography.Muted className='text-sm'>{t('description')}</Typography.Muted>
          </Flex>
          <Button
            type='button'
            variant='ghost'
            size='sm'
            className='text-muted-foreground shrink-0'
            onClick={onClose}
          >
            {t('close')}
          </Button>
        </Flex>
      </Flex>

      <div className='border-border shrink-0 border-b px-5 py-4'>
        <div className='relative'>
          <div className='absolute start-3 top-1/2 flex -translate-y-1/2 items-center'>
            <IconSearch
              className={`h-4 w-4 ${isLoading ? 'text-accent animate-pulse' : 'text-muted-foreground'}`}
              aria-hidden
            />
          </div>
          <Input
            ref={inputRef}
            type='search'
            enterKeyHint='search'
            autoComplete='off'
            autoCorrect='off'
            spellCheck={false}
            placeholder={t('placeholder')}
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            className='focus:border-primary bg-background h-12 rounded-full ps-11 pe-12'
            aria-label={t('placeholder')}
          />
          {inputValue ? (
            <Button
              type='button'
              variant='ghost'
              size='icon'
              className='absolute end-2 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full'
              aria-label={tSearch('mobileSheet.clearSearch')}
              onClick={() => {
                setInputValue('');
                inputRef.current?.focus();
              }}
            >
              <IconX className='h-4 w-4' />
            </Button>
          ) : null}
        </div>
      </div>

      <div className='min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-3 pb-[max(1rem,env(safe-area-inset-bottom))]'>
        {!hasQuery && trendingSearches.length > 0 ? (
          <Flex direction='column' gap={3}>
            <Flex direction='row' align='center' gap={2}>
              <IconTrendingUp className='text-accent h-4 w-4' aria-hidden />
              <Typography.Muted className='text-xs font-medium tracking-wide uppercase'>
                {tSearch('suggestions.trending')}
              </Typography.Muted>
            </Flex>
            <Flex direction='row' wrap='wrap' gap={2}>
              {trendingSearches.map((term) => (
                <Button
                  key={term}
                  type='button'
                  variant='outline'
                  size='sm'
                  className='rounded-full'
                  onClick={() => setInputValue(term)}
                >
                  {term}
                </Button>
              ))}
            </Flex>
            <Typography.Muted className='text-sm leading-relaxed'>
              {t('emptyQuery')}
            </Typography.Muted>
          </Flex>
        ) : null}

        {hasQuery && isLoading ? (
          <Typography.Muted className='p-6 text-center text-sm' role='status'>
            {tSearch('suggestions.loading')}
          </Typography.Muted>
        ) : null}

        {hasQuery && !isLoading && products.length === 0 ? (
          <Typography.Muted className='p-6 text-center text-sm'>{t('noResults')}</Typography.Muted>
        ) : null}

        {products.length > 0 ? (
          <ul className='flex flex-col gap-2.5'>
            {products.map((product) => (
              <li key={product.id ?? product.slug ?? product.name}>
                <CartAddItemsProductRow product={product} />
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </>
  );
}
