'use client';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { IconPlus } from '@tabler/icons-react';
import Image from 'next/image';
import { useGetProducts } from '~/src/services/-products-get';
import useCompareController from '~/src/domains/compare/hooks/useCompareController';

export function CompareDialogContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const { items, addItem, canAddMore } = useCompareController();

  const { data } = useGetProducts({ limit: 100 });
  const products = data?.data?.products || [];

  // Safely extract product items and filter
  const availableProducts = products.filter((p) => {
    const product = p.items;
    if (!product) return false;
    const matchesSearch =
      product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || product.category?.name === categoryFilter;
    const notInCompare = !items.includes(product.id!);
    return matchesSearch && matchesCategory && notInCompare;
  });

  const categories = Array.from(
    new Set(
      products.map((p) => p.items?.category?.name).filter((name): name is string => Boolean(name))
    )
  ) as string[];

  return (
    <div className='mt-4 space-y-4'>
      <Input
        placeholder='Search products...'
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <Select value={categoryFilter} onValueChange={setCategoryFilter}>
        <SelectTrigger>
          <SelectValue placeholder='Filter by category' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='All'>All Categories</SelectItem>
          {categories.map((cat) => (
            <SelectItem key={cat} value={cat}>
              {cat}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <ScrollArea className='h-75'>
        <div className='space-y-2'>
          {availableProducts.map(({ items: product }) => {
            if (!product) return null;
            return (
              <div
                key={product.id}
                className='hover:bg-muted flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors'
                onClick={() => {
                  if (canAddMore) addItem(product.id!);
                }}
              >
                <div className='bg-secondary relative h-12 w-12 overflow-hidden rounded-md'>
                  <Image
                    src={product.images?.[0] || '/placeholder.png'}
                    alt={product.name!}
                    fill
                    className='object-cover'
                  />
                </div>
                <div className='min-w-0 flex-1'>
                  <p className='truncate text-sm font-medium'>{product.name}</p>
                  <p className='text-muted-foreground text-xs'>
                    {product.category?.name} · ${product.price}
                  </p>
                </div>
                <IconPlus className='text-muted-foreground h-4 w-4' />
              </div>
            );
          })}
          {availableProducts.length === 0 && (
            <p className='text-muted-foreground py-8 text-center'>No products found</p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
