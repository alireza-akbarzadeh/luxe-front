import { IconChevronRight } from '@tabler/icons-react';
import Link from 'next/link';

export default function CartBreadcrumb() {
  return (
    <nav className='text-muted-foreground mb-8 flex items-center gap-2 text-sm'>
      <Link href='/' className='hover:text-foreground transition-colors'>
        Home
      </Link>
      <IconChevronRight className='h-4 w-4' />
      <span className='text-foreground'>Shopping Cart</span>
    </nav>
  );
}
