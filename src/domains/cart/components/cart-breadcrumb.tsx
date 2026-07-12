import { IconChevronRight } from '@tabler/icons-react';
import Link from 'next/link';

export default function CartBreadcrumb() {
  return (
    <nav
      aria-label='Breadcrumb'
      className='text-muted-foreground mb-4 flex items-center gap-2 text-sm sm:mb-8'
    >
      <Link href='/' className='hover:text-foreground transition-colors'>
        Home
      </Link>
      <IconChevronRight className='h-4 w-4' aria-hidden />
      <Link href='/shop' className='hover:text-foreground transition-colors'>
        Shop
      </Link>
      <IconChevronRight className='h-4 w-4' aria-hidden />
      <span className='text-foreground font-medium'>Cart</span>
    </nav>
  );
}
