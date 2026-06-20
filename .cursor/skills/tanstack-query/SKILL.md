---
name: tanstack-query
description: >
  Use when fetching, caching, or mutating server data in luxe-front — Orval useGet*/usePost*,
  invalidateQueries, get*QueryKey, prefetch/HydrationBoundary, enabled, staleTime, optimistic
  updates, or useInfiniteQuery. Apply when the user mentions TanStack Query, React Query, refetch,
  cache invalidation, or moving data out of Zustand/useState. Do not use for Orval regen (api-gen),
  raw fetch/axios, Zustand UI state, table wiring (tanstack-table), or form fields (admin-forms).
paths:
  - "src/services/**/*.ts"
  - "src/domains/**/*.tsx"
  - "src/domains/**/hooks/**/*.ts"
  - "src/lib/query-client.ts"
  - "src/app/**/*.tsx"
---

# Luxe TanStack Query

**Stack:** `@tanstack/react-query` v5 · **Orval-generated hooks** in `src/services/` · `getQueryClient()` · App Router **`HydrationBoundary`**.

**Default references:** `src/lib/query-client.ts`, `src/domains/discounts/sections/discount-form.tsx`, `src/app/(site)/page.tsx`, `src/components/buttons/useUpdateLike.ts`, `src/domains/store/lib/infinite-stores-query.ts`.

Adapted from [tanstack-skills/tanstack-query](https://github.com/tanstack-skills/tanstack-skills). Luxe **never** calls `fetch`/`axios` in components — all HTTP goes through Orval.

## Hard rules

| Always | Never |
|--------|-------|
| `useGet*` / `usePost*` from `@/services/-<path>-<method>` | Raw `useQuery({ queryFn: () => fetch(...) })` |
| `getGet*QueryKey()` for invalidation | Hand-written string query keys (except prefix scans — see below) |
| `getGet*QueryOptions()` for prefetch | Hand-editing `src/services/` |
| `useQueryClient()` + `invalidateQueries` after mutations | Server lists in Zustand |
| Types from `*.schemas.ts` (`Dto*`, `Get*200`) | Duplicate API types in `src/schemas/` |

Missing hook? → `/api-gen` (backend Swagger → restart → `pnpm api:gen`).

## Query keys (Orval)

Orval generates keys from OpenAPI paths:

```ts
import { getGetBrandsQueryKey, useGetBrands } from '@/services/-brands-get';

// Key factory — includes params when list is filtered
getGetBrandsQueryKey({ limit: 20, page: 1 });

// Hook
const { data, isLoading, isFetching, error, refetch } = useGetBrands(
  { limit: 20, page: 1 },
  { query: { staleTime: 60_000 } }
);
```

**Invalidation:**

```ts
void queryClient.invalidateQueries({ queryKey: getGetBrandsQueryKey() });
// Prefix: invalidates all param variants of that endpoint
```

For cross-list patches (likes), prefix match on path segment is OK: `queryKey: ['/products']` — see `useUpdateLike.ts`. Prefer **`get*QueryKey()`** for new code.

Details: [references/orval-query-patterns.md](references/orval-query-patterns.md).

## Global defaults

`src/lib/query-client.ts`:

- `staleTime: 60_000` (1 min)
- `refetchOnWindowFocus: false`
- Server: new `QueryClient` per request; browser: singleton via `getQueryClient()`

Override per hook when data is more/less volatile:

```tsx
useGetAdminReportsRevenue({ period }, { query: { staleTime: 5 * 60_000 } });
```

## Mutations (Orval)

```tsx
const queryClient = useQueryClient();

const { mutateAsync, isPending } = usePutCouponsId({
  mutation: {
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: getGetAdminCouponsQueryKey() });
      void queryClient.invalidateQueries({ queryKey: getGetCouponsIdQueryKey(id) });
      toast.success('Saved');
    },
  },
});

await mutateAsync({ id, data: mapFormToRequest(value) });
```

**Default pattern:** invalidate on success — optimistic updates only when UX needs instant feedback (likes, cart).

## Dependent queries

Use `enabled` — never conditional hooks:

```tsx
const { data: couponResponse } = useGetCouponsId(Number(discountId), {
  query: { enabled: isEdit && Boolean(discountId) },
});
```

## Admin tables + Query

List pages use **`useServerTable`** which calls your Orval `useGet*` internally — see `/tanstack-table`. You implement `getQueryParams`, `getRows`, `getTotal`; Query wiring is bundled.

## Infinite queries

Domain helper + hook pattern (`infinite-stores-query.ts`):

```ts
export function getInfiniteStoresQueryOptions(baseParams: StoresCatalogParams) {
  return {
    queryKey: getInfiniteStoresQueryKey(baseParams),
    queryFn: ({ pageParam, signal }) => getStores({ ...normalized, offset: pageParam }, undefined, signal),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => { /* offset math */ },
  };
}

export function useInfiniteStores(baseParams: StoresCatalogParams) {
  return useInfiniteQuery({ ...getInfiniteStoresQueryOptions(baseParams), staleTime: 60_000 });
}
```

Use imperative **`getStores`** from Orval for `queryFn`; export shared options for SSR prefetch.

## SSR prefetch (App Router)

```tsx
// app/(site)/page.tsx — Server Component
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query-client';
import { getGetProductsQueryOptions } from '@/services/-products-get';

export default async function HomePage() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(getGetProductsQueryOptions({ limit: 8, offset: 0 }));
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HomeDomains />
    </HydrationBoundary>
  );
}
```

Client child uses the **same** Orval hook — cache hits dehydrated state.

Storefront routes use this pattern; most admin dashboard pages are client-only with `useServerTable`.

## Optimistic updates

When needed (likes, cart):

1. `cancelQueries` for affected keys
2. Snapshot with `getQueryData`
3. `setQueryData` updater
4. Rollback in `onError`
5. `invalidateQueries` in `onSettled`

Reference: `src/components/buttons/useUpdateLike.ts`, `src/hooks/useCartController.ts`.

Do **not** optimistic-delete list rows in Zustand — use Query cache or wait for invalidation.

## Loading & error UI

```tsx
if (isLoading) return <Skeleton />;           // first load, no data
// isFetching — background refetch; keep showing data
if (isError) return <Error onRetry={() => refetch()} />;
```

Admin tables: `serverTable.isLoading && serverTable.rows.length === 0` for grid skeleton.

## Gotchas

- **`placeholderData` vs `initialData`:** prefer `placeholderData: (prev) => prev` for pagination UX if not using `useServerTable`.
- **Invalidation scope:** `getGetXQueryKey()` without params invalidates all variants — usually what you want after create/update/delete.
- **Don't store `data` in Zustand** — use Query cache; Zustand for dialogs/selection only (`/zustand`).
- **React Compiler:** avoid manual `useMemo` on query results unless profiling shows need.
- **Near-miss skills:** missing hook → `/api-gen`; table UI → `/tanstack-table`; tuning perf → `/luxe-react-performance`.

## Checklist

- [ ] Orval hook exists; types from `*.schemas.ts`
- [ ] Mutations invalidate `get*QueryKey()` (detail + list keys when both cached)
- [ ] No raw HTTP in components
- [ ] `enabled` for dependent fetches
- [ ] SSR routes: `prefetchQuery` + `HydrationBoundary` when appropriate
- [ ] `pnpm check`
