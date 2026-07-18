'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { Flex } from '@/components/ui/flex';
import { Grid } from '@/components/ui/grid';
import { useCalendarDashboard } from '@/domains/store-calendar/hooks/use-calendar-dashboard';
import { useCalendarFilters } from '@/domains/store-calendar/hooks/use-calendar-filters';
import { CalendarDayDrawer } from '@/domains/store-calendar/sections/calendar-day-drawer';
import { CalendarKpiCards } from '@/domains/store-calendar/sections/calendar-kpi-cards';
import { CalendarMonthGrid } from '@/domains/store-calendar/sections/calendar-month-grid';
import { CalendarToolbar } from '@/domains/store-calendar/sections/calendar-toolbar';
import { DeliveryCalculatorCard } from '@/domains/store-calendar/sections/delivery-calculator-card';
import { DeliverySimulatorCard } from '@/domains/store-calendar/sections/delivery-simulator-card';
import { StoresStatusCard } from '@/domains/store-calendar/sections/stores-status-card';
import { UpcomingEventsCard } from '@/domains/store-calendar/sections/upcoming-events-card';
import { useStoreCalendarStore } from '@/domains/store-calendar/stores/store-calendar-store';
import type { CalendarQuickAction } from '@/domains/store-calendar/types/store-calendar.types';
import type { DtoSimulateDeliveryResponse } from '@/services/-admin-calendar-simulate-post.schemas';

const COMING_SOON_ACTIONS: Record<string, string> = {
  'vendor-closed': 'Vendor Closed',
  'special-working': 'Special Working',
  maintenance: 'Maintenance'
};

/** Composes the full Store Calendar & Delivery Planner dashboard from filters, queries, and sections. */
export function StoreCalendarDomain() {
  const { push } = useRouter();
  const filters = useCalendarFilters();
  const dashboard = useCalendarDashboard(filters);
  const openDrawer = useStoreCalendarStore((state) => state.openDrawer);
  const [simulateResult, setSimulateResult] = useState<DtoSimulateDeliveryResponse | undefined>();

  const handleDayAction = (date: string, action: CalendarQuickAction) => {
    if (action === 'add-holiday') {
      push(`/dashboard/calendar/holidays/create?date=${date}`);
      return;
    }
    if (action === 'view-details') {
      openDrawer(date);
      return;
    }
    const label = COMING_SOON_ACTIONS[action] ?? action;
    toast.info(`${label} is coming soon`, { description: 'This quick action is not wired up yet.' });
  };

  return (
    <Flex direction='column' spacing={6}>
      <CalendarToolbar filters={filters} />

      <CalendarKpiCards summary={dashboard.summary} isLoading={dashboard.isSummaryLoading} />

      <CalendarMonthGrid
        year={filters.year}
        month={filters.month}
        eventsByDate={dashboard.eventsByDate}
        onAction={handleDayAction}
      />

      <Grid cols={1} gap={4} className='sm:grid-cols-2 lg:grid-cols-4'>
        <DeliveryCalculatorCard result={simulateResult} />
        <DeliverySimulatorCard onResult={setSimulateResult} />
        <UpcomingEventsCard events={dashboard.upcomingEvents} isLoading={dashboard.isUpcomingLoading} />
        <StoresStatusCard stores={dashboard.storesStatus} isLoading={dashboard.isStoresStatusLoading} />
      </Grid>

      <CalendarDayDrawer />
    </Flex>
  );
}
