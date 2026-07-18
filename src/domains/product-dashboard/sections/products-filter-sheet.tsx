'use client';

import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet';
import { BrandPicker } from '@/domains/brands/components/brand-picker';
import { CategoryPicker } from '@/domains/categories/components/category-picker';
import { useProductsQueryState } from '@/domains/product-dashboard/hooks/use-products-query';
import { GetProductsStatus } from '@/services/-products-get.schemas';

interface ProductsFilterSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReset: () => void;
}

export function ProductsFilterSheet({ open, onOpenChange, onReset }: ProductsFilterSheetProps) {
  const t = useTranslations('productDashboard.filters');
  const {
    status,
    setStatus,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    categoryId,
    setCategoryId,
    brandId,
    setBrandId,
    isDigital,
    setIsDigital
  } = useProductsQueryState();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side='right'
        className='flex h-full w-full max-w-full flex-col gap-0 p-0 sm:max-w-xl lg:max-w-2xl'
        onInteractOutside={(event) => {
          // Portaled Select / Combobox menus render outside the sheet — keep the sheet open.
          const target = event.target as HTMLElement | null;
          if (
            target?.closest(
              '[data-slot=select-content], [data-radix-popper-content-wrapper], [cmdk-root], [data-slot=popover-content]'
            )
          ) {
            event.preventDefault();
          }
        }}
        onPointerDownOutside={(event) => {
          const target = event.target as HTMLElement | null;
          if (
            target?.closest(
              '[data-slot=select-content], [data-radix-popper-content-wrapper], [cmdk-root], [data-slot=popover-content]'
            )
          ) {
            event.preventDefault();
          }
        }}
      >
        <SheetHeader className='border-border shrink-0 border-b px-6 py-5 pe-14 text-start'>
          <SheetTitle>{t('title')}</SheetTitle>
          <SheetDescription>{t('description')}</SheetDescription>
        </SheetHeader>

        <Flex
          direction='column'
          spacing={5}
          className='min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-5'
        >
          <div className='space-y-2'>
            <Label>{t('status')}</Label>
            <Select
              value={status}
              onValueChange={(value) => void setStatus(value as typeof status)}
            >
              <SelectTrigger className='h-11 w-full'>
                <SelectValue placeholder={t('statusPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>{t('statusAll')}</SelectItem>
                <SelectItem value={GetProductsStatus.active}>{t('statusActive')}</SelectItem>
                <SelectItem value={GetProductsStatus.draft}>{t('statusDraft')}</SelectItem>
                <SelectItem value={GetProductsStatus.archived}>{t('statusArchived')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className='grid gap-4 sm:grid-cols-2'>
            <div className='space-y-2'>
              <Label htmlFor='products-min-price'>{t('minPrice')}</Label>
              <Input
                id='products-min-price'
                type='number'
                min={0}
                step='0.01'
                placeholder={t('priceMinPlaceholder')}
                className='h-11'
                value={minPrice ?? ''}
                onChange={(event) => {
                  const value = event.target.value;
                  void setMinPrice(value === '' ? null : Number(value));
                }}
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='products-max-price'>{t('maxPrice')}</Label>
              <Input
                id='products-max-price'
                type='number'
                min={0}
                step='0.01'
                placeholder={t('priceMaxPlaceholder')}
                className='h-11'
                value={maxPrice ?? ''}
                onChange={(event) => {
                  const value = event.target.value;
                  void setMaxPrice(value === '' ? null : Number(value));
                }}
              />
            </div>
          </div>

          <CategoryPicker
            value={categoryId != null ? String(categoryId) : ''}
            onChange={(id) => void setCategoryId(id ? Number(id) : null)}
            label={t('category')}
            allowClear
            clearLabel={t('categoryAll')}
            placeholder={t('categoryPlaceholder')}
            searchPlaceholder={t('categorySearch')}
            emptyLabel={t('categoryEmpty')}
            searchingLabel={t('categorySearching')}
            enabled={open}
          />

          <BrandPicker
            value={brandId != null ? String(brandId) : ''}
            onChange={(id) => void setBrandId(id ? Number(id) : null)}
            label={t('brand')}
            allowClear
            clearLabel={t('brandAll')}
            placeholder={t('brandPlaceholder')}
            searchPlaceholder={t('brandSearch')}
            emptyLabel={t('brandEmpty')}
            searchingLabel={t('brandSearching')}
            enabled={open}
          />

          <div className='space-y-2'>
            <Label>{t('productType')}</Label>
            <Select
              value={isDigital}
              onValueChange={(value) => void setIsDigital(value as typeof isDigital)}
            >
              <SelectTrigger className='h-11 w-full'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>{t('typeAll')}</SelectItem>
                <SelectItem value='yes'>{t('typeDigital')}</SelectItem>
                <SelectItem value='no'>{t('typePhysical')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Flex>

        <SheetFooter className='border-border shrink-0 gap-2 border-t px-6 py-4 sm:justify-between'>
          <Button type='button' variant='ghost' onClick={onReset}>
            {t('reset')}
          </Button>
          <Button type='button' onClick={() => onOpenChange(false)}>
            {t('apply')}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
