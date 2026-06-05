import { IconPackage, IconPlus, IconTags, IconTicket, IconUserPlus } from '@tabler/icons-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { NotificationCenter } from '@/domains/admin/components/notificaiton-center';
import { UserProfile } from '@/domains/admin/components/user-profile';

export function HeaderActions() {
  return (
    <div className='ml-auto flex items-center gap-1.5'>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            className='hover:bg-primary/10 hover:text-primary hidden h-9 gap-2 rounded-xl px-3 transition-all sm:flex'
          >
            <IconPlus className='h-4 w-4' />
            <span className='text-xs font-bold tracking-wider uppercase'>Create</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align='end'
          className='border-border/40 bg-popover/95 z-50 w-60 rounded-2xl p-2 shadow-2xl backdrop-blur-md'
        >
          <DropdownMenuLabel className='text-muted-foreground px-3 py-2 text-[10px] font-bold tracking-widest uppercase'>
            Inventory & Sales
          </DropdownMenuLabel>
          <DropdownMenuSeparator className='opacity-50' />

          {/* New Product */}
          <DropdownMenuItem
            asChild
            className='hover:bg-muted/20 focus:bg-muted/80 flex cursor-pointer items-center gap-3 rounded-xl p-2.5 transition-colors'
          >
            <Link href='/dashboard/products/create'>
              <div className='shrink-0 rounded-lg bg-blue-500/10 p-2'>
                <IconPackage className='h-4 w-4 text-blue-500' />
              </div>
              <div className='flex min-w-0 flex-1 flex-col'>
                <span className='text-foreground text-sm font-semibold tracking-tight'>
                  New Product
                </span>
                <span className='text-muted-foreground truncate text-[10px]'>
                  Add item to digital catalog
                </span>
              </div>
              <kbd className='text-muted-foreground bg-muted border-border/40 rounded border px-1.5 py-0.5 font-mono text-[9px] select-none'>
                P
              </kbd>
            </Link>
          </DropdownMenuItem>

          {/* New Collection */}
          <DropdownMenuItem
            asChild
            className='hover:bg-muted/80 focus:bg-muted/80 flex cursor-pointer items-center gap-3 rounded-xl p-2.5 transition-colors'
          >
            <Link href='/dashboard/collections/create'>
              <div className='shrink-0 rounded-lg bg-pink-500/10 p-2'>
                <IconTags className='h-4 w-4 text-pink-500' />
              </div>
              <div className='flex min-w-0 flex-1 flex-col'>
                <span className='text-foreground text-sm font-semibold tracking-tight'>
                  New Collection
                </span>
                <span className='text-muted-foreground truncate text-[10px]'>
                  Group products by theme
                </span>
              </div>
              <kbd className='text-muted-foreground bg-muted border-border/40 rounded border px-1.5 py-0.5 font-mono text-[9px] select-none'>
                C
              </kbd>
            </Link>
          </DropdownMenuItem>

          {/* New Discount / Coupon */}
          <DropdownMenuItem
            asChild
            className='hover:bg-muted/80 focus:bg-muted/80 flex cursor-pointer items-center gap-3 rounded-xl p-2.5 transition-colors'
          >
            <Link href='/dashboard/discounts/create'>
              <div className='shrink-0 rounded-lg bg-purple-500/10 p-2'>
                <IconTicket className='h-4 w-4 text-purple-500' />
              </div>
              <div className='flex min-w-0 flex-1 flex-col'>
                <span className='text-foreground text-sm font-semibold tracking-tight'>
                  Create Coupon
                </span>
                <span className='text-muted-foreground truncate text-[10px]'>
                  Generate promotional code
                </span>
              </div>
              <kbd className='text-muted-foreground bg-muted border-border/40 rounded border px-1.5 py-0.5 font-mono text-[9px] select-none'>
                D
              </kbd>
            </Link>
          </DropdownMenuItem>

          {/* New Customer Profile */}
          <DropdownMenuItem
            asChild
            className='hover:bg-muted/80 focus:bg-muted/80 flex cursor-pointer items-center gap-3 rounded-xl p-2.5 transition-colors'
          >
            <Link href='/dashboard/customers/create'>
              <div className='shrink-0 rounded-lg bg-emerald-500/10 p-2'>
                <IconUserPlus className='h-4 w-4 text-emerald-500' />
              </div>
              <div className='flex min-w-0 flex-1 flex-col'>
                <span className='text-foreground text-sm font-semibold tracking-tight'>
                  Add Customer
                </span>
                <span className='text-muted-foreground truncate text-[10px]'>
                  Register manual retail account
                </span>
              </div>
              <kbd className='text-muted-foreground bg-muted border-border/40 rounded border px-1.5 py-0.5 font-mono text-[9px] select-none'>
                U
              </kbd>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className='bg-border/40 mx-2 hidden h-6 w-px sm:block' />
      <NotificationCenter />
      <UserProfile variant='header' />
    </div>
  );
}
