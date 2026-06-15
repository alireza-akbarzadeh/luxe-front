'use client';

import { IconShoppingBag } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

import { cartMoneyClassName, formatCartMoney } from '@/domains/cart/lib/cart-utils';
import { cn } from '@/lib/utils';
import type { ModelsOrderItem } from '~/src/services/-checkout-post.schemas';

interface OrderItemSummaryProps {
  orderItems: ModelsOrderItem[];
}

export function OrderItemSummary({ orderItems }: OrderItemSummaryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
      className='lg:col-span-2'
    >
      <div className='bg-card border-border/50 rounded-2xl border p-6'>
        <h2 className='mb-4 flex items-center gap-2 text-lg font-semibold'>
          <IconShoppingBag className='h-5 w-5' />
          Items in your order
        </h2>
        <div className='divide-border divide-y'>
          {orderItems?.map((item, index) => (
            <motion.div
              key={item.id ?? `${item.product_id}-${index}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 + index * 0.05 }}
              className='flex gap-4 py-4 first:pt-0 last:pb-0'
            >
              <div className='bg-muted relative h-20 w-20 shrink-0 overflow-hidden rounded-lg'>
                {item.product?.images?.[0] ? (
                  <Image
                    src={item.product.images[0]}
                    alt={item.product.name ?? 'Product'}
                    fill
                    className='object-cover'
                    sizes='80px'
                  />
                ) : null}
              </div>
              <div className='flex flex-1 flex-col sm:flex-row sm:justify-between'>
                <div>
                  <p className='font-medium'>{item.product?.name ?? 'Product'}</p>
                  <p className={cn('text-muted-foreground text-sm', cartMoneyClassName)}>
                    Qty: {item.quantity} × {formatCartMoney(item.price)}
                  </p>
                  {Number(item?.product?.colors?.length) > 0 && (
                    <p className='text-muted-foreground text-xs'>
                      Color: {item.product?.colors?.[0]}
                    </p>
                  )}
                </div>
                <p className={cn('mt-1 font-semibold sm:mt-0', cartMoneyClassName)}>
                  {formatCartMoney(item.total ?? (item.price ?? 0) * (item.quantity ?? 0))}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
