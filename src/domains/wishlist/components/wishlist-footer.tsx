import { IconArrowRight } from '@tabler/icons-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

export function WishlistFooter() {
  return (
    <div className='mt-12 border-t pt-8 text-center'>
      <p className='text-muted-foreground mb-4 text-sm'>
        Looking for more? Discover new arrivals and bestsellers.
      </p>
      <Link href='/shop'>
        <Button variant='outline' size='lg' className='gap-2 rounded-full'>
          Continue Shopping
          <IconArrowRight className='h-4 w-4' />
        </Button>
      </Link>
    </div>
  );
}
