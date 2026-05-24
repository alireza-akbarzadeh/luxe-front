'use client';
import { IconMinus, IconPlus } from '@tabler/icons-react';

interface ProductQuantityProps {
  value: number; // current cart count for this product
  onIncrement: () => void;
  onDecrement: () => void;
  stock: number;
}

export default function ProductQuantity(props: ProductQuantityProps) {
  const { value, onIncrement, onDecrement, stock } = props;
  const isOutOfStock = stock <= 0;
  const isMaxReached = value >= stock;

  const stockMessage = () => {
    if (isOutOfStock) return 'Out of stock';
    if (stock === 1) return 'Only 1 left in stock';
    return `Only ${stock} left in stock`;
  };

  return (
    <div>
      <p className='mb-3 text-sm font-medium'>Quantity</p>

      {isOutOfStock ? (
        <div className='rounded-md border border-red-200 bg-red-50 p-3 text-center text-sm text-red-700'>
          <p className='font-medium'>Out of stock</p>
          <p className='text-xs'>This product is currently not available.</p>
        </div>
      ) : (
        <div className='flex items-center gap-4'>
          <div className='border-border flex items-center rounded-full border'>
            <button
              onClick={onDecrement}
              disabled={value <= 0}
              className='hover:bg-secondary rounded-l-full p-3 disabled:opacity-50'
              aria-label='Decrease quantity'
            >
              <IconMinus className='h-4 w-4' />
            </button>
            <span className='w-10 text-center text-sm font-medium'>{value}</span>
            <button
              onClick={onIncrement}
              disabled={isMaxReached}
              className='hover:bg-secondary rounded-r-full p-3 disabled:opacity-50'
              aria-label='Increase quantity'
            >
              <IconPlus className='h-4 w-4' />
            </button>
          </div>
          <p className='text-muted-foreground text-xs'>{stockMessage()}</p>
        </div>
      )}
    </div>
  );
}
