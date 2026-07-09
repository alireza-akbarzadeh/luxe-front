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
import { useProductsQueryState } from '@/domains/product-dashboard/hooks/use-products-query';
import { useGetBrands } from '@/services/-brands-get';
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

  const { data: brandsData } = useGetBrands({ limit: 100, page: 1 });
  const brandOptions =
    brandsData?.data?.brands?.map((brand) => ({
      label: brand.name ?? `Brand #${brand.id}`,
      value: String(brand.id)
    })) ?? [];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side='right' className='flex w-full flex-col sm:max-w-md'>
        <SheetHeader>
          <SheetTitle>Filter products</SheetTitle>
          <SheetDescription>
            Narrow the catalog by status, price, category, and product type.
          </SheetDescription>
        </SheetHeader>

        <Flex direction='column' spacing={4} className='flex-1 overflow-y-auto px-1 py-2'>
          <div className='space-y-2'>
            <Label>Status</Label>
            <Select
              value={status}
              onValueChange={(value) => void setStatus(value as typeof status)}
            >
              <SelectTrigger>
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
                value={maxPrice ?? ''}
                onChange={(event) => {
                  const value = event.target.value;
                  void setMaxPrice(value === '' ? null : Number(value));
                }}
              />
            </div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='products-category-id'>Category ID</Label>
            <Input
              id='products-category-id'
              type='number'
              min={1}
              placeholder='Optional'
              value={categoryId ?? ''}
              onChange={(event) => {
                const value = event.target.value;
                void setCategoryId(value === '' ? null : Number(value));
              }}
            />
          </div>

          <div className='space-y-2'>
            <Label>Brand</Label>
            <Select
              value={brandId != null ? String(brandId) : 'all'}
              onValueChange={(value) => void setBrandId(value === 'all' ? null : Number(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder='All brands' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All brands</SelectItem>
                {brandOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-2'>
            <Label>Product type</Label>
            <Select
              value={isDigital}
              onValueChange={(value) => void setIsDigital(value as typeof isDigital)}
            >
              <SelectTrigger>
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

        <SheetFooter className='gap-2 sm:justify-between'>
          <Button type='button' variant='ghost' onClick={onReset}>
            Reset filters
          </Button>
          <Button type='button' onClick={() => onOpenChange(false)}>
            Apply
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
