# Luxe stack performance patterns

## TanStack Query + Orval

```tsx
import { useGetAdminReportsRevenue } from '@/services/-admin-reports-revenue-get';
import { getGetProductsQueryKey } from '@/services/-products-get';
import { useQueryClient } from '@tanstack/react-query';

// Defaults: src/lib/query-client.ts (staleTime 60s, no refetch on focus)
const { data, isFetching, refetch } = useGetAdminReportsRevenue(
  { period },
  { query: { staleTime: 60_000 } }
);

// Mutations invalidate generated keys only
void queryClient.invalidateQueries({ queryKey: getGetProductsQueryKey() });
```

Prefetch (App Router):

```tsx
// Route-level: dehydrate Orval prefetch + HydrationBoundary where already used
```

## Zustand (client UI only)

```tsx
// Good — modal/selection
const open = useDeleteDialogStore((s) => s.open);

// Bad — list from API
const products = useProductStore((s) => s.products); // use TanStack Query
```

## shadcn + layout

- UI from `@/components/ui/*` — don't hand-edit primitives.
- Page shells: `Flex` / `Grid` / `Typography` (`/layout-typography`).
- Cards for dashboard sections — see `revenue-report` domain.

## Recharts + ChartContainer

```tsx
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

const chartData = useMemo(() => rows.map(mapRow), [rows, period]);

<ChartContainer config={revenueChartConfig} className='h-75 w-full'>
  <AreaChart data={chartData}>...</AreaChart>
</ChartContainer>
```

Config tokens: `domains/dashboard/lib/dashboard-utils.ts` (`revenueChartConfig`).

## Dynamic import (heavy client)

```tsx
import dynamic from 'next/dynamic';

const HeavyMap = dynamic(() => import('./map').then((m) => m.Map), {
  ssr: false,
  loading: () => <Skeleton className='h-64 w-full' />,
});
```

## Tables

```tsx
const serverTable = useServerTable({
  columns,
  getQueryParams,
  getRows,
  getTotal,
  useQuery: useGetCategories,
});

<Table.Root {...serverTable.rootProps}>
  <Table.Toolbar onRefresh={serverTable.refetch} />
  <Table.Grid isLoading={serverTable.isLoading} />
  <Table.Pagination />
</Table.Root>
```

## Forms

```tsx
const form = useAppForm({
  validators: { onChange: schema, onSubmit: schema },
  onSubmit: async ({ value }) => {
    await mutation.mutateAsync({ data: mapFormToRequest(value) });
  },
});
```

See `/admin-forms` — don't micro-optimize with raw TanStack Form APIs.
