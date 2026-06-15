import { IconArrowRight, IconGift, IconLayersLinked } from '@tabler/icons-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

export function WishlistFooter() {
  return (
    <div className='mt-12 border-t pt-8'>
      <p className='text-muted-foreground mb-4 text-center text-sm'>
        Looking for inspiration? Browse curated edits or send a gift card.
      </p>
      <div className='flex flex-col items-center justify-center gap-3 sm:flex-row'>
        <Link href='/shop'>
          <Button variant='outline' size='lg' className='gap-2 rounded-full'>
            Continue shopping
            <IconArrowRight className='h-4 w-4' />
          </Button>
        </Link>
        <Link href='/collections'>
          <Button variant='outline' size='lg' className='gap-2 rounded-full'>
            <IconLayersLinked className='h-4 w-4' />
            Collections
          </Button>
        </Link>
        <Link href='/gift-cards'>
          <Button variant='outline' size='lg' className='gap-2 rounded-full'>
            <IconGift className='h-4 w-4' />
            Gift cards
          </Button>
        </Link>
      </div>
    </div>
  );
}
