# Action patterns (Luxe)

## Naming

| Kind | Pattern | Examples |
|------|---------|----------|
| Open/create UI | `open*` | `openCreateDialog`, `openAdjust`, `openSearchSheet` |
| Close UI | `close*` | `closeDialogs`, `closePanel`, `closeAdjust` |
| Select | `select*` / `setActive*` | `selectRole`, `setActiveStore` |
| Toggle | `set*` or `toggle*` | `setPaused`, `toggleSidebarCollapsed` |
| Clear collections | `clear*` | `clearEvents`, `clearRecentSearches` |
| Reset store | `reset` | always present |

Avoid LobeHub-style `internal_createTopic` — server creates belong in mutations.

## Dialog + edit ID pattern

Canonical Luxe pattern (`roles-store`, `menu-manager-store`):

```ts
openCreateDialog: () => set({ createDialogOpen: true, editRoleId: null }),
openEditDialog: (id) => set({ editRoleId: id, createDialogOpen: false }),
closeDialogs: () => set({ createDialogOpen: false, editRoleId: null }),
```

Separate `createDialogOpen` vs `editRoleId` when create and edit share one dialog; use `editingId` alone when one dialog handles both.

## Discriminated panel (complex editor)

When more than two modes, use a tagged union (`workflow-editor-store`):

```ts
type EditorPanel =
  | { type: 'closed' }
  | { type: 'edit-state'; state: DtoStateView }
  | { type: 'create-transition'; fromNodeId: string; toNodeId: string };

openEditState: (state) => set({ panel: { type: 'edit-state', state } }),
closePanel: () => set({ panel: { type: 'closed' } }),
```

Prefer this over `isCreateOpen`, `isEditOpen`, `selectedStateId`, etc.

## Functional updates

### List prepend with cap

```ts
addRecentSearch: (query, resultCount) => {
  if (!query.trim()) return;
  set((state) => ({
    recentSearches: [{ query, timestamp: Date.now(), resultCount }, ...filtered].slice(0, 10),
  }));
},
```

### Dedupe by id

```ts
ingestEvent: (evt) => {
  set((state) => {
    if (state.events.some((e) => e.id === evt.id)) return state;
    return { events: [evt, ...state.events].slice(0, MAX_EVENTS) };
  });
},
```

### No-op guard (avoid re-renders)

```ts
updateFilters: (updates) =>
  set((state) => {
    const isDifferent = Object.entries(updates).some(/* … */);
    if (!isDifferent) return {};
    return { filters: { ...state.filters, ...updates } };
  }),
```

## Component + mutation (not store)

```tsx
const closeDialogs = useRolesStore((s) => s.closeDialogs);
const { mutateAsync } = useDeleteAdminRolesId();

const onConfirmDelete = async () => {
  await mutateAsync({ id: selectedId });
  void queryClient.invalidateQueries({ queryKey: getGetAdminRolesQueryKey() });
  closeDialogs();
  toast.success('Deleted');
};
```

Optimistic list updates:

```tsx
usePutAdminItemsId({
  mutation: {
    onMutate: async (vars) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old) => patch(old, vars));
      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(queryKey, ctx.previous);
    },
    onSettled: () => void queryClient.invalidateQueries({ queryKey }),
  },
});
```

## Anti-patterns

- `async createItem() { await axios.post…; set({ items }) }` — use Orval mutation
- Storing `products: DtoProduct[]` from `useGetProducts` in Zustand
- Table `pageIndex` / `sorting` in Zustand — use nuqs + `useServerTable`
- Missing `reset()` — leaks dialog state across navigations
- `useFeatureStore()` without selector — re-renders on any field change
