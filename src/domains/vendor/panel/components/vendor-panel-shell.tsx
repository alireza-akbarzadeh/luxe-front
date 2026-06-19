'use client';

import { IconMenu } from '@tabler/icons-react';
import Link from 'next/link';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import ThemeToggle from '@/components/ui/theme-toggle';
import { VendorSidebar } from '@/domains/vendor/panel/components/vendor-sidebar';
import type { UserPayload } from '@/lib/auth/auth-server';

interface VendorPanelShellProps {
  children: React.ReactNode;
  user: UserPayload;
}

export function VendorPanelShell({ children, user }: VendorPanelShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className='bg-background flex h-screen w-full overflow-hidden'>
      <VendorSidebar className='hidden md:flex' />

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side='left' className='w-72 border-none p-0'>
          <VendorSidebar onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className='flex min-w-0 flex-1 flex-col overflow-hidden'>
        <header className='border-border/60 bg-card/95 flex h-16 shrink-0 items-center justify-between gap-3 border-b px-4 md:px-6'>
          <div className='flex items-center gap-2'>
            <Button
              type='button'
              variant='ghost'
              size='icon'
              className='md:hidden'
              aria-label='Open vendor navigation'
              onClick={() => setMobileOpen(true)}
            >
              <IconMenu className='size-5' />
            </Button>
            <div>
              <p className='text-muted-foreground text-xs'>Signed in as</p>
              <p className='text-sm font-medium'>
                {user.first_name} {user.last_name}
              </p>
            </div>
          </div>

          <div className='flex items-center gap-2'>
            <ThemeToggle />
            <Button variant='outline' size='sm' asChild>
              <Link href='/vendor'>Vendor home</Link>
            </Button>
          </div>
        </header>

        <main className='flex-1 overflow-y-auto p-4 md:p-6'>{children}</main>
      </div>
    </div>
  );
}
