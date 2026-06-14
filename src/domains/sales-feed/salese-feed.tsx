'use client';

import {
  IconActivity,
  IconArrowLeft,
  IconHomeDollar,
  IconMusicPause,
  IconMusicPlus,
  IconShoppingCart,
  IconTimelineEventX,
  IconUsers
} from '@tabler/icons-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { useSalesFeedSocket } from '@/domains/sales-feed/hooks/useSalesFeedSocket';
import { STATUS_COLORS } from '@/domains/sales-feed/mock-data';
import { useSalesFeedStore } from '@/domains/sales-feed/sales-store';
import { LiveEventFeed } from '@/domains/sales-feed/sections/live-event-feed';
import { LiveStatCard } from '@/domains/sales-feed/sections/live-stats-card';
import { RevenueSparkling } from '@/domains/sales-feed/sections/revenue-sparkling';
import { StatusDonutChart } from '@/domains/sales-feed/sections/status-donut-chart';
import { cn } from '@/lib/utils';

const MAX_REVENUE_POINTS = 30;

function buildStatusData(counts: Record<string, number>) {
  return Object.keys(counts).map((name) => ({
    name,
    value: counts[name] ?? 0,
    color: STATUS_COLORS[name as keyof typeof STATUS_COLORS]
  }));
}

export function LiveSaleFeedDomain() {
  useSalesFeedSocket();

  const events = useSalesFeedStore((s) => s.events);
  const revenueData = useSalesFeedStore((s) => s.revenueData);
  const statusCounts = useSalesFeedStore((s) => s.statusCounts);
  const totalOrders = useSalesFeedStore((s) => s.totalOrders);
  const totalRevenue = useSalesFeedStore((s) => s.totalRevenue);
  const activeUsers = useSalesFeedStore((s) => s.activeUsers);
  const eventsPerMin = useSalesFeedStore((s) => s.eventsPerMin);
  const paused = useSalesFeedStore((s) => s.paused);
  const connected = useSalesFeedStore((s) => s.connected);
  const lastRevDelta = useSalesFeedStore((s) => s.lastRevDelta);
  const lastOrderDelta = useSalesFeedStore((s) => s.lastOrderDelta);
  const setPaused = useSalesFeedStore((s) => s.setPaused);
  const clearEvents = useSalesFeedStore((s) => s.clearEvents);

  const statusData = buildStatusData(statusCounts);
  const latestRevenue = revenueData[revenueData.length - 1];

  const isLive = connected && !paused;

  return (
    <div className='bg-background min-h-screen'>
      {/* HEADER */}
      <div className='bg-card/80 sticky top-0 z-20 border-b backdrop-blur-sm'>
        <div className='mx-auto max-w-[1600px] px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <Link href='/dashboard/orders'>
                <Button
                  variant='ghost'
                  size='sm'
                  className='h-8 gap-1.5 rounded-lg text-[10px] font-bold uppercase'
                >
                  <IconArrowLeft className='h-3.5 w-3.5' /> Orders
                </Button>
              </Link>
              <div className='bg-border h-4 w-px' />
              <div className='flex items-center gap-3'>
                <div className='flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10'>
                  <IconActivity className='h-5 w-5 text-emerald-600' />
                </div>
                <div>
                  <h1 className='text-lg font-black tracking-tight'>Live Sales Feed</h1>
                  <p className='text-muted-foreground text-[10px] font-bold tracking-widest uppercase'>
                    Real-time activity
                  </p>
                </div>
              </div>
              <div
                className={cn(
                  'flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-black tracking-widest uppercase transition-all',
                  !connected
                    ? 'border-destructive/40 bg-destructive/10 text-destructive'
                    : paused
                      ? 'border-amber-300 bg-amber-50 text-amber-700'
                      : 'border-emerald-300 bg-emerald-50 text-emerald-700'
                )}
              >
                <span
                  className={cn(
                    'h-2 w-2 rounded-full',
                    !connected
                      ? 'bg-destructive'
                      : paused
                        ? 'bg-amber-400'
                        : 'animate-pulse bg-emerald-500'
                  )}
                />
                {!connected ? 'Connecting…' : paused ? 'Paused' : 'Live'}
              </div>
            </div>
            <Button
              variant='outline'
              size='sm'
              onClick={() => setPaused(!paused)}
              className='h-9 gap-2 rounded-xl text-[10px] font-bold uppercase'
            >
              {paused ? (
                <>
                  <IconMusicPlus className='h-3.5 w-3.5' /> Resume
                </>
              ) : (
                <>
                  <IconMusicPause className='h-3.5 w-3.5' /> Pause
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className='mx-auto max-w-[1600px] space-y-8 px-6 py-8'>
        {/* KPI STRIP */}
        <div className='grid grid-cols-2 gap-4 lg:grid-cols-4'>
          <LiveStatCard
            label='Total Orders'
            value={totalOrders} // ✅ pass number, not formatted string
            delta={lastOrderDelta}
            icon={IconShoppingCart}
            iconColor='text-primary'
            iconBg='bg-primary/10'
            pulse={isLive}
          />
          <LiveStatCard
            label='Revenue Today'
            value={`$${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} // ✅ string is now allowed
            delta={lastRevDelta}
            icon={IconHomeDollar}
            iconColor='text-emerald-600'
            iconBg='bg-emerald-50'
            pulse={isLive}
          />
          <LiveStatCard
            label='Active Users'
            value={activeUsers}
            icon={IconUsers}
            iconColor='text-violet-600'
            iconBg='bg-violet-50'
            pulse={isLive}
            // ✅ delta and deltaLabel are optional, no error
          />
          <LiveStatCard
            label='Events / min'
            value={eventsPerMin}
            icon={IconTimelineEventX}
            iconColor='text-amber-600'
            iconBg='bg-amber-50'
            pulse={isLive}
          />
        </div>

        {/* CHARTS ROW */}
        <div className='grid grid-cols-1 gap-6 xl:grid-cols-3'>
          <div className='bg-card rounded-2xl border p-5 shadow-sm xl:col-span-2'>
            <div className='mb-4 flex items-center justify-between'>
              <div>
                <h2 className='text-sm font-black tracking-widest uppercase'>Revenue Stream</h2>
                <p className='text-muted-foreground mt-0.5 text-[10px]'>
                  Rolling {MAX_REVENUE_POINTS}-sample window
                </p>
              </div>
              <div className='text-right'>
                <p className='text-xl font-black tabular-nums'>
                  $
                  {latestRevenue?.revenue.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  }) ?? '—'}
                </p>
                <p className='text-muted-foreground text-[10px]'>latest snapshot</p>
              </div>
            </div>
            <RevenueSparkling data={revenueData} />
          </div>
          <div className='bg-card rounded-2xl border p-5 shadow-sm'>
            <div className='mb-4'>
              <h2 className='text-sm font-black tracking-widest uppercase'>Order Status</h2>
              <p className='text-muted-foreground mt-0.5 text-[10px]'>Live distribution</p>
            </div>
            <StatusDonutChart data={statusData} />
          </div>
        </div>

        {/* LIVE FEED */}
        <div className='bg-card rounded-2xl border p-5 shadow-sm'>
          <div className='mb-4 flex items-center justify-between'>
            <div>
              <h2 className='text-sm font-black tracking-widest uppercase'>Live Activity Feed</h2>
              <p className='text-muted-foreground mt-0.5 text-[10px]'>
                {events.length} events captured · newest first
              </p>
            </div>
            {events.length > 0 && (
              <Button
                variant='ghost'
                size='sm'
                onClick={clearEvents}
                className='text-muted-foreground text-[10px] font-bold uppercase'
              >
                Clear
              </Button>
            )}
          </div>
          <LiveEventFeed events={events} />
        </div>
      </div>
    </div>
  );
}
