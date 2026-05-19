import { Empty } from '@/components/empty';
import { Button } from '@/components/ui/button';
import { IconBasket } from '@tabler/icons-react';
import Link from 'next/link';

export function EmptyCart() {
  return (
    <Empty
      title='Your Cart is empty'
      icon={IconBasket}
      description='Add some items to your cart before checking out.'
      content={
        <Link href='/shop'>
          <Button size='lg' className='rounded-full'>
            Continue Shopping
          </Button>
        </Link>
      }
    />
  );
}
