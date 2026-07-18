'use client';

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
          <SheetTitle>Filter products</SheetTitle>
          <SheetDescription>
            Narrow the catalog by status, price, category, brand, and product type. Filters sync to
            the URL and the products API.
          </SheetDescription>
        </SheetHeader>

        <Flex direction='column' spacing={5} className='min-h-0 flex-1 overflow-y-auto px-6 py-5'>
          <div className='space-y-2'>
            <Label>Status</Label>
            <Select
              value={status}
              onValueChange={(value) => void setStatus(value as typeof status)}
            >
              <SelectTrigger className='h-11 w-full'>
                <SelectValue placeholder='All statuses' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All</SelectItem>
                <SelectItem value={GetProductsStatus.active}>Active</SelectItem>
                <SelectItem value={GetProductsStatus.draft}>Draft</SelectItem>
                <SelectItem value={GetProductsStatus.archived}>Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className='grid gap-4 sm:grid-cols-2'>
            <div className='space-y-2'>
              <Label htmlFor='products-min-price'>Min price</Label>
              <Input
                id='products-min-price'
                type='number'
                min={0}
                step='0.01'
                placeholder='0'
                className='h-11'
                value={minPrice ?? ''}
                onChange={(event) => {
                  const value = event.target.value;
                  void setMinPrice(value === '' ? null : Number(value));
                }}
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='products-max-price'>Max price</Label>
              <Input
                id='products-max-price'
                type='number'
                min={0}
                step='0.01'
                placeholder='Any'
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
            allowClear
            clearLabel='All categories'
            placeholder='All categories'
            enabled={open}
          />

          <BrandPicker
            value={brandId != null ? String(brandId) : ''}
            onChange={(id) => void setBrandId(id ? Number(id) : null)}
            allowClear
            clearLabel='All brands'
            placeholder='All brands'
            enabled={open}
          />

          <div className='space-y-2'>
            <Label>Product type</Label>
            <Select
              value={isDigital}
              onValueChange={(value) => void setIsDigital(value as typeof isDigital)}
            >
              <SelectTrigger className='h-11 w-full'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All types</SelectItem>
                <SelectItem value='yes'>Digital only</SelectItem>
                <SelectItem value='no'>Physical only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Flex>

        <SheetFooter className='border-border shrink-0 gap-2 border-t px-6 py-4 sm:justify-between'>
          <Button type='button' variant='ghost' onClick={onReset}>
            Reset filters
          </Button>
          <Button type='button' onClick={() => onOpenChange(false)}>
            Done
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
