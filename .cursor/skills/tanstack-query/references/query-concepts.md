# TanStack Query concepts (Luxe mapping)

Upstream TanStack docs apply inside Luxe constraints below. Domain code uses **Orval**, not raw `queryOptions()` helpers.

## Server state vs client state

| TanStack Query | Zustand (`/zustand`) |
|----------------|----------------------|
| API entities, lists, totals | Dialog open, selected row for UI |
| Cart/like cache (Query) | Checkout wizard step flags |
| Prefetch + SSR hydration | Sidebar collapsed |

## Query lifecycle (v5)

| Flag | Meaning in Luxe |
|------|-----------------|
| `isPending` / `isLoading` | First fetch — show skeleton |
| `isFetching` | Any in-flight request — toolbar refresh spinner |
| `isError` | Show retry; log via toast in mutations |
| `isSuccess` | Render `data` — narrow with `?.data` for `UtilsResponse` wrappers |

Default freshness: **60s staleTime** — data won't refetch on remount within that window.

## Cancellation

Orval `queryFn` receives `{ signal }` from TanStack — passed to `customInstance` / axios. Automatic on unmount or key change. Call `cancelQueries` before optimistic updates.

## Pagination strategies

| Pattern | When |
|---------|------|
| **`useServerTable`** | Admin lists — offset/page in API params |
| **`useInfiniteQuery`** | Storefront infinite scroll — `infinite-*-query.ts` |
| **`useQuery` + `placeholderData`** | Rare manual pagination — prefer server table |

Do not duplicate pagination state in Zustand when `useServerTable` or nuqs handles it.

## Optimistic updates

Upstream checklist still applies:

1. `onMutate` → cancel + snapshot + `setQueryData`
2. `onError` → rollback from context
3. `onSettled` → invalidate

Luxe examples patch **`Get*200`** wrapper shape (`data.products`, `data.is_liked`). Match Orval types when writing updaters.

## SSR + Hydration

```
Server Component → getQueryClient() → prefetchQuery(get*QueryOptions)
                → dehydrate → HydrationBoundary
Client Component → useGet* (same params) → cache hit
```

Each server request gets a **new** QueryClient (`query-client.ts`). Do not share server clients across requests.

## Devtools

`TanstackQueryProvider` mounts devtools in development (`src/components/providers/client/tanstack-query.tsx`).

## Testing

Playwright E2E for flows; unit tests that need Query wrap with `QueryClientProvider` and `retry: false`. Not the primary Luxe testing path — see project Playwright docs.

## Extending beyond Orval

If an endpoint is missing:

1. Backend Swagger + `/api-gen` — **not** a parallel manual query layer
2. Temporary imperative `getX` only if hook generation failed and API is up for regen

## Related skills

| Task | Skill |
|------|-------|
| Regenerate hooks | `/api-gen` |
| Admin table UI | `/tanstack-table` |
| Dialog/selection state | `/zustand` |
| staleTime, waterfalls, charts | `/luxe-react-performance` |
