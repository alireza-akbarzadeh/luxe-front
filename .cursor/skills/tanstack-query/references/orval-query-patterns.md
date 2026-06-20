# Orval + TanStack Query patterns

Orval generates per-endpoint files under `src/services/`:

| Export | Use |
|--------|-----|
| `getFeature` | Imperative client (prefetch `queryFn`, infinite scroll) |
| `useGetFeature` | React hook |
| `getGetFeatureQueryKey(params?)` | Invalidation / cache lookup |
| `getGetFeatureQueryOptions(params?, options?)` | `prefetchQuery`, `ensureQueryData` |
| `usePostFeature` / `usePutFeatureId` | Mutations |

Import pattern:

```ts
import { getGetBrandsQueryKey, useGetBrands } from '@/services/-brands-get';
import type { DtoBrandResponse, GetBrands200 } from '@/services/-brands-get.schemas';
```

## List response shapes

Inspect `Get*200` in schemas — wrappers vary:

```ts
// categories
(data) => data?.data?.categories ?? []

// brands (via lib helper)
getBrandsFromListResponse(data)

// Always pair with getTotal for server tables
(data) => data?.data?.total
```

Add `lib/*-list.ts` when mapping is non-trivial.

## Hook options

```tsx
useGetFeature(params, {
  query: {
    enabled: Boolean(id),
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    retry: 1,
    select: (res) => res.data?.item, // derived slice
  },
});
```

Orval passes options into generated `getGetFeatureQueryOptions`.

## Mutations

Generated hooks accept `{ mutation: { onSuccess, onError, onMutate, onSettled } }`:

```tsx
const createMutation = usePostAdminStores({
  mutation: {
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: getGetAdminStoresQueryKey() });
    },
  },
});

await createMutation.mutateAsync({ data: payload });
```

Use **`mutateAsync`** in forms (`useAppForm` `onSubmit`); **`isPending`** for button loading.

## Invalidation recipes

| After | Invalidate |
|-------|------------|
| Create list item | `getGetItemsQueryKey()` |
| Update item | list key + `getGetItemsIdQueryKey(id)` |
| Delete item | list key (detail key optional `removeQueries`) |
| Bulk delete | list key; `resetRowSelection()` on table |

```ts
void queryClient.invalidateQueries({ queryKey: getGetAdminCategoriesQueryKey() });

// Exact detail key
void queryClient.invalidateQueries({
  queryKey: getGetCouponsIdQueryKey(coupon.id),
});
```

## Prefetch

```ts
await queryClient.prefetchQuery(getGetProductsQueryOptions(params));
// or
await queryClient.ensureQueryData(getGetProductsIdQueryOptions(String(slug)));
```

Use **`get*QueryOptions`** from Orval — not manual `{ queryKey, queryFn }`.

## Imperative fetch (non-hook)

```ts
import { getBrands } from '@/services/-brands-get';

const res = await getBrands({ limit: 10 });
```

Rare — prefer hooks. Useful in Server Actions or scripts, not in `"use client"` components when a hook exists.

## Anti-patterns

```tsx
// WRONG
useQuery({ queryKey: ['brands'], queryFn: () => axios.get('/brands') });

// WRONG
queryClient.invalidateQueries({ queryKey: ['admin', 'brands'] });

// WRONG — editing generated file
// src/services/-brands-get.ts
```

## Regeneration

Contract change → `/api-gen`. Query patterns stay the same; hook names/paths may change with OpenAPI.
