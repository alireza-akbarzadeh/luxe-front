import Image from 'next/image';
import Link from 'next/link';

import { cn } from '@/lib/utils';

interface DashboardBrandLogoProps {
  variant: 'admin' | 'vendor';
  collapsed?: boolean;
  href?: string;
  className?: string;
  onNavigate?: () => void;
}

/** Sidebar brand lockup — gold mark + LUXE ADMIN / LUXE VENDOR label. */
export function DashboardBrandLogo({
  variant,
  collapsed = false,
  href,
  className,
  onNavigate
}: DashboardBrandLogoProps) {
  const title = variant === 'admin' ? 'LUXE ADMIN' : 'LUXE VENDOR';
  const linkHref = href ?? (variant === 'admin' ? '/dashboard' : '/vendor/panel');

  return (
    <Link
      href={linkHref}
      onClick={onNavigate}
      className={cn(
        'flex min-w-0 items-center gap-2.5 rounded-lg transition-opacity hover:opacity-90',
        collapsed && 'justify-center',
        className
      )}
    >
      <Image
        src='/assets/logo.png'
        alt='Luxe'
        width={collapsed ? 28 : 32}
        height={collapsed ? 28 : 32}
        className='shrink-0'
        priority
      />
      {!collapsed ? (
        <span className='text-foreground truncate text-[11px] font-bold tracking-[0.16em] uppercase'>
          {title}
        </span>
      ) : null}
    </Link>
  );
}
