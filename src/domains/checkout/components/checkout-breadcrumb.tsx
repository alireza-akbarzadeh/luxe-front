import { IconChevronRight } from '@tabler/icons-react';
import Link from 'next/link';

export function CheckoutBreadcrumb() {
  return (
    <nav className='text-muted-foreground mb-4 flex items-center gap-2 text-sm sm:mb-8'>
      <Link href='/' className='hover:text-foreground transition-colors'>
        Home
      </Link>
      <IconChevronRight className='h-4 w-4' />
      <Link href='/cart' className='hover:text-foreground transition-colors'>
        Cart
      </Link>
      <IconChevronRight className='h-4 w-4' />
      <span className='text-foreground'>Checkout</span>
    </nav>
  );
}
