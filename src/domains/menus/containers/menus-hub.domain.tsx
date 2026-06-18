'use client';

import { IconArrowRight, IconGlobe, IconLayoutSidebar, IconMenu2 } from '@tabler/icons-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useGetAdminMenuGroups } from '@/services/-admin-menu-groups-get';
import { useGetNavMenus } from '@/services/-nav-menus-get';

const menuDestinations = [
  {
    href: '/dashboard/menus/dashboard',
    title: 'Dashboard menu',
    description:
      'Manage admin sidebar groups, nested items, icons, routes, and permission scopes for the control panel.',
    icon: IconLayoutSidebar,
    accent: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
    ring: 'hover:border-violet-500/30 hover:shadow-violet-500/10',
    badge: 'Admin sidebar'
  },
  {
    href: '/dashboard/menus/site',
    title: 'Site menu',
    description:
      'Configure storefront header navigation — simple links and mega-menu dropdowns with columns and featured cards.',
    icon: IconGlobe,
    accent: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
    ring: 'hover:border-sky-500/30 hover:shadow-sky-500/10',
    badge: 'Storefront nav'
  }
] as const;

export function MenusHubDomain() {
  const { data: groupsResponse, isLoading: isGroupsLoading } = useGetAdminMenuGroups();
  const { data: navResponse, isLoading: isNavLoading } = useGetNavMenus();

  const dashboardGroupCount = groupsResponse?.data?.length ?? 0;
  const siteNavCount = navResponse?.data?.length ?? 0;

  const counts: Record<string, string> = {
    '/dashboard/menus/dashboard': isGroupsLoading
      ? '—'
      : `${dashboardGroupCount} group${dashboardGroupCount === 1 ? '' : 's'}`,
    '/dashboard/menus/site': isNavLoading
      ? '—'
      : `${siteNavCount} item${siteNavCount === 1 ? '' : 's'}`
  };

  return (
    <div className='bg-background min-h-screen'>
      <div className='bg-card/80 sticky top-0 z-20 border-b backdrop-blur-sm'>
        <div className='mx-auto max-w-400 px-6 py-5'>
          <div className='flex items-center gap-3'>
            <div className='bg-primary/10 flex h-9 w-9 items-center justify-center rounded-xl'>
              <IconMenu2 className='text-primary h-4.5 w-4.5' />
            </div>
            <div>
              <h1 className='text-xl font-black tracking-tight'>Menus</h1>
              <p className='text-muted-foreground text-[10px] font-bold tracking-widest uppercase'>
                Navigation management
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className='mx-auto max-w-400 px-6 py-8'>
        <p className='text-muted-foreground mb-8 max-w-2xl text-sm leading-relaxed'>
          Choose which navigation surface you want to edit. Dashboard menus power the admin sidebar;
          site menus power the public storefront header.
        </p>

        <div className='grid gap-5 md:grid-cols-2'>
          {menuDestinations.map((destination) => {
            const Icon = destination.icon;
            return (
              <Link
                key={destination.href}
                href={destination.href}
                className={cn(
                  'group border-border/60 bg-card/50 relative overflow-hidden rounded-3xl border p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg',
                  destination.ring
                )}
              >
                <div
                  className={cn(
                    'pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full opacity-40 blur-2xl',
                    destination.accent.split(' ')[0]
                  )}
                />

                <div className='relative flex h-full flex-col'>
                  <div className='mb-5 flex items-start justify-between gap-3'>
                    <div
                      className={cn(
                        'flex h-12 w-12 items-center justify-center rounded-2xl',
                        destination.accent
                      )}
                    >
                      <Icon className='h-6 w-6' />
                    </div>
                    <Badge variant='outline' className='text-[10px] font-bold uppercase'>
                      {destination.badge}
                    </Badge>
                  </div>

                  <h2 className='text-lg font-black tracking-tight'>{destination.title}</h2>
                  <p className='text-muted-foreground mt-2 flex-1 text-sm leading-relaxed'>
                    {destination.description}
                  </p>

                  <div className='border-border/50 mt-6 flex items-center justify-between border-t pt-4'>
                    <span className='text-muted-foreground text-[11px] font-semibold tracking-wide uppercase'>
                      {counts[destination.href]}
                    </span>
                    <span className='text-primary inline-flex items-center gap-1 text-xs font-bold uppercase transition group-hover:gap-2'>
                      Open
                      <IconArrowRight className='h-3.5 w-3.5' />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
