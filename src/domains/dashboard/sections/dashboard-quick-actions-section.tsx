import { IconPackage, IconShoppingCart, IconTags, IconTicket } from '@tabler/icons-react';
import Link from 'next/link';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Flex } from '@/components/ui/flex';

import { DASHBOARD_QUICK_ACTIONS } from '../lib/dashboard-mappers';

const QUICK_ACTION_ICONS = {
  product: IconPackage,
  collection: IconTags,
  discount: IconTicket,
  order: IconShoppingCart
} as const;

export function DashboardQuickActionsSection() {
  return (
    <Card className='dashboard-card border-0 shadow-none'>
      <CardHeader>
        <CardTitle>Quick actions</CardTitle>
        <CardDescription>Jump into common admin workflows</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='grid gap-3 sm:grid-cols-2 xl:grid-cols-3'>
          {DASHBOARD_QUICK_ACTIONS.map((action) => {
            const Icon = QUICK_ACTION_ICONS[action.icon];
            return (
              <Link
                key={action.href}
                href={action.href}
                className='hover:bg-muted/40 flex items-start gap-3 rounded-xl border p-3 transition-colors'
              >
                <Flex
                  align='center'
                  justify='center'
                  className='bg-primary/10 text-primary h-9 w-9 shrink-0 rounded-lg'
                >
                  <Icon className='h-4 w-4' />
                </Flex>
                <div className='min-w-0'>
                  <p className='text-sm font-semibold'>{action.label}</p>
                  <p className='text-muted-foreground text-xs'>{action.description}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
