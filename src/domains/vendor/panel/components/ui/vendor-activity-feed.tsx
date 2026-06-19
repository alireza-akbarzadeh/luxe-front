'use client';

import {
  IconBell,
  IconMessage,
  IconPackage,
  IconReceipt,
  IconStar
} from '@tabler/icons-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { VENDOR_ACTIVITY } from '@/domains/vendor/panel/data/vendor-dashboard.data';
import { cn } from '@/lib/utils';

const ACTIVITY_ICONS = {
  order: IconReceipt,
  review: IconStar,
  stock: IconPackage,
  payout: IconReceipt,
  message: IconMessage
} as const;

export function VendorActivityFeed({ className }: { className?: string }) {
  return (
    <Card className={cn('border-border/40 bg-card/50 rounded-2xl shadow-none', className)}>
      <CardHeader className='pb-3'>
        <CardTitle className='text-base font-semibold'>Recent activity</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        {VENDOR_ACTIVITY.map((item) => {
          const Icon = ACTIVITY_ICONS[item.type as keyof typeof ACTIVITY_ICONS] ?? IconBell;
          return (
            <div key={item.id} className='flex items-start gap-3'>
              <div className='bg-muted/60 flex size-8 shrink-0 items-center justify-center rounded-lg'>
                <Icon className='text-muted-foreground size-4' aria-hidden />
              </div>
              <div className='min-w-0 flex-1'>
                <p className='text-sm leading-snug'>{item.message}</p>
                <p className='text-muted-foreground mt-0.5 text-xs'>{item.time}</p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
