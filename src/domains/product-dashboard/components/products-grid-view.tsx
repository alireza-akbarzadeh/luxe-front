'use client';

import Link from 'next/link';

import { AppImage } from '@/components/ui/app-image';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Flex } from '@/components/ui/flex';
import { Text } from '@/components/ui/typography';
import { formatPrice } from '@/domains/home/lib/home-utils';
import { ProductRowActions } from '@/domains/product-dashboard/components/product-row-actions';
import { IMAGE_FALLBACK } from '@/lib/images';
import { cn } from '@/lib/utils';
import type { DtoProductWithLike } from '@/services/-products-get.schemas';

interface ProductsGridViewProps {
  products: DtoProductWithLike[];
  onOpen?: (product: DtoProductWithLike) => void;
}

export function ProductsGridView({ products, onOpen }: ProductsGridViewProps) {
  if (products.length === 0) {
    return (
      <Text variant='muted' className='py-12 text-center text-sm'>
        No products match your filters.
      </Text>
    );
  }

  return (
    <div className='grid gap-4 p-3 sm:grid-cols-2 md:p-0 lg:grid-cols-3 xl:grid-cols-4'>
      {products.map((product) => {
        const stock = product.stock ?? 0;
        const href = `/dashboard/products/edit/${product.id}`;

        return (
          <Card
            key={product.id}
            className='dashboard-card group overflow-hidden border-0 shadow-none transition-opacity hover:opacity-95'
          >
            <Link href={href} className='block' onClick={() => onOpen?.(product)}>
              <div className='bg-muted/30 relative aspect-square overflow-hidden'>
                <AppImage
                  src={product.images?.[0] ?? IMAGE_FALLBACK}
                  alt={product.name ?? 'Product'}
                  fill
                  sizes='(max-width: 640px) 50vw, 25vw'
                  className='object-cover transition-transform group-hover:scale-[1.02]'
                />
                <Flex
                  direction='row'
                  className='absolute top-2 right-2 left-2 justify-between gap-1'
                >
                  <Flex direction='row' className='gap-1'>
                    {product.is_new ? (
                      <Badge
                        variant='outline'
                        className='bg-background/80 border-emerald-500/40 text-[10px]'
                      >
                        New
                      </Badge>
                    ) : null}
                    {product.is_digital ? (
                      <Badge variant='secondary' className='bg-background/80 text-[10px]'>
                        Digital
                      </Badge>
                    ) : null}
                  </Flex>
                  <ProductRowActions product={product} />
                </Flex>
              </div>
              <CardContent className='space-y-2 p-4'>
                <Text variant='small' className='line-clamp-2 font-semibold'>
                  {product.name ?? 'Untitled product'}
                </Text>
                <Text variant='muted' className='text-xs'>
                  SKU: {product.sku ?? '—'}
                </Text>
                <Flex direction='row' align='center' justify='between' className='gap-2'>
                  <Text variant='small' className='font-semibold tabular-nums'>
                    {formatPrice(product.price ?? 0)}
                  </Text>
                  <Text
                    variant='muted'
                    className={cn(
                      'text-xs tabular-nums',
                      stock <= 5 && 'text-destructive font-medium'
                    )}
                  >
                    {stock} in stock
                  </Text>
                </Flex>
                {product.category?.name ? (
                  <Text variant='muted' className='text-[11px]'>
                    {product.category.name}
                  </Text>
                ) : null}
              </CardContent>
            </Link>
          </Card>
        );
      })}
    </div>
  );
}
