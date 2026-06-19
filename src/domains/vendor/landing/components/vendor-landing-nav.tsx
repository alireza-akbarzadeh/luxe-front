'use client';

import { IconMenu, IconX } from '@tabler/icons-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { Button, buttonVariants } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { VENDOR_NAV_LINKS } from '@/domains/vendor/landing/data/vendor-landing.data';
import { cn } from '@/lib/utils';

interface VendorLandingNavProps {
  isAuthenticated: boolean;
}

export function VendorLandingNav({ isAuthenticated }: VendorLandingNavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const startSellingHref = isAuthenticated
    ? '/vendor/panel'
    : '/register?callbackUrl=/vendor/panel';
  const signInHref = '/vendor/login?callbackUrl=/vendor/panel';

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled
          ? 'border-border/60 bg-background/80 border-b shadow-sm backdrop-blur-xl'
          : 'bg-transparent'
      )}
    >
      <nav
        aria-label='Vendor landing'
        className='mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:h-[4.5rem] lg:px-8'
      >
        <Link href='/vendor' className='flex items-center gap-2'>
          <span className='text-xl font-bold tracking-tight'>LUXE</span>
          <span className='text-muted-foreground hidden text-xs font-medium tracking-[0.2em] uppercase sm:inline'>
            Sellers
          </span>
        </Link>

        <ul className='hidden items-center gap-8 lg:flex'>
          {VENDOR_NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className='text-muted-foreground hover:text-foreground text-sm font-medium transition-colors'
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className='hidden items-center gap-2 lg:flex'>
          <Link href={signInHref} className={buttonVariants({ variant: 'ghost', size: 'sm' })}>
            Sign in
          </Link>
          <Link
            href={startSellingHref}
            className={cn(buttonVariants({ size: 'sm' }), 'rounded-full px-5')}
          >
            Start selling
          </Link>
        </div>

        <Button
          type='button'
          variant='ghost'
          size='icon'
          className='lg:hidden'
          aria-label='Open menu'
          onClick={() => setMobileOpen(true)}
        >
          <IconMenu className='size-5' />
        </Button>
      </nav>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side='right' className='w-full max-w-sm p-0'>
          <SheetTitle className='sr-only'>Vendor navigation</SheetTitle>
          <div className='flex items-center justify-between border-b p-4'>
            <span className='font-semibold'>Menu</span>
            <Button
              type='button'
              variant='ghost'
              size='icon'
              aria-label='Close menu'
              onClick={() => setMobileOpen(false)}
            >
              <IconX className='size-5' />
            </Button>
          </div>
          <div className='flex flex-col gap-1 p-4'>
            {VENDOR_NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className='hover:bg-muted rounded-lg px-3 py-2.5 text-sm font-medium'
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className='mt-auto flex flex-col gap-2 border-t p-4'>
            <Link
              href={signInHref}
              className={buttonVariants({ variant: 'outline' })}
              onClick={() => setMobileOpen(false)}
            >
              Sign in
            </Link>
            <Link
              href={startSellingHref}
              className={cn(buttonVariants(), 'rounded-full')}
              onClick={() => setMobileOpen(false)}
            >
              Start selling
            </Link>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
