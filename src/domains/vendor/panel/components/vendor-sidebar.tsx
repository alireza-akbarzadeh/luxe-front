'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { VENDOR_PANEL_NAV } from '@/domains/vendor/vendor-nav';
import { cn } from '@/lib/utils';

interface VendorSidebarProps {
  className?: string;
  onNavigate?: () => void;
}

export function VendorSidebar({ className, onNavigate }: VendorSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        'bg-card/95 flex h-full w-64 shrink-0 flex-col border-r border-border/60 backdrop-blur-sm',
        className
      )}
    >
      <div className='p-4'>
        <Link href='/vendor' className='block' onClick={onNavigate}>
          <p className='text-muted-foreground text-[10px] font-bold tracking-[0.18em] uppercase'>
            Luxe Vendor
          </p>
          <p className='text-foreground mt-1 text-sm font-semibold tracking-tight'>Seller panel</p>
        </Link>
      </div>

      <Separator className='opacity-40' />

      <ScrollArea className='flex-1 px-2 py-4'>
        <nav className='flex flex-col gap-1' aria-label='Vendor panel'>
          {VENDOR_PANEL_NAV.map((item) => {
            const isActive =
              item.href === '/vendor/panel'
                ? pathname === item.href
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors',
                  isActive
                    ? 'bg-accent text-accent-foreground font-medium'
                    : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                )}
              >
                <item.icon className='size-4 shrink-0' />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      <div className='border-border/60 border-t p-4'>
        <Link
          href='/'
          className='text-muted-foreground hover:text-foreground text-xs transition-colors'
          onClick={onNavigate}
        >
          ← Back to storefront
        </Link>
      </div>
    </aside>
  );
}
