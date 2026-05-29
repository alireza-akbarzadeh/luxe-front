import { IconChevronRight, IconHome } from '@tabler/icons-react';
import Link from 'next/link';
import { useMemo } from 'react';

import { dashboard_SIDEBAR } from '../data';

export function DashboardBreadcrumbs({ pathname }: { pathname: string }) {
  const breadcrumbs = useMemo(() => {
    const paths = pathname.split('/').filter(Boolean);

    return paths.map((segment, index) => {
      const currentPath = '/' + paths.slice(0, index + 1).join('/');

      let label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');

      dashboard_SIDEBAR.forEach((group) => {
        group.items.forEach((item) => {
          if (item.href === currentPath) label = item.label;
          item.children?.forEach((child) => {
            if (child.href === currentPath) label = child.label;
          });
        });
      });

      return {
        label,
        href: currentPath,
        isLast: index === paths.length - 1
      };
    });
  }, [pathname]);

  if (breadcrumbs.length <= 1) return null;

  return (
    <nav className='hidden items-center gap-2 text-sm lg:flex'>
      <Link
        href='/dashboard'
        className='text-muted-foreground hover:text-primary transition-colors'
      >
        <IconHome size={15} />
      </Link>

      {breadcrumbs.map((crumb) => (
        <div key={crumb.href} className='flex items-center gap-2'>
          <IconChevronRight size={14} className='text-muted-foreground/50' />
          {crumb.isLast ? (
            <span className='text-foreground font-semibold tracking-tight'>{crumb.label}</span>
          ) : (
            <Link
              href={crumb.href}
              className='text-muted-foreground hover:text-foreground transition-colors'
            >
              {crumb.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}
