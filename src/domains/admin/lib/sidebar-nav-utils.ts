import { cn } from '@/lib/utils';

export function isPathActive(pathname: string, href?: string) {
  if (!href) return false;
  if (pathname === href) return true;
  if (href !== '/dashboard' && pathname.startsWith(`${href}/`)) return true;
  return false;
}

export function childLinkClasses(active: boolean) {
  return cn(
    'relative block rounded-lg px-3 py-2 text-xs font-medium transition-all',
    active
      ? 'dashboard-nav-item-active font-semibold'
      : 'text-muted-foreground hover:bg-white/4 hover:text-foreground'
  );
}

export function navItemClasses(isActive: boolean, isCollapsed: boolean) {
  return cn(
    'dashboard-nav-item group relative outline-none',
    isActive ? 'dashboard-nav-item-active' : '',
    isCollapsed && 'mx-auto h-10 w-10 justify-center px-0'
  );
}
