---
name: zustand
description: >
  Use when adding or refactoring luxe-front Zustand stores — client UI state, dialog/sheet
  open flags, selections, wizard steps, panel modes, or store vs TanStack Query boundaries.
  Apply when the user mentions zustand, useFeatureStore, dialog state, reset(), persist, or
  moving state out of useState. Do not use for server data fetching (TanStack Query), table
  pagination/filters in URL (nuqs), form field state (useAppForm), or backend APIs.
paths:
  - "src/domains/**/stores/**/*.ts"
  - "src/domains/**/*.store.ts"
  - "src/store/**/*.ts"
---

# Luxe Zustand

**Stack:** Zustand · TanStack Query (server data) · nuqs (table URL state) · `useAppForm` (forms).

**Default references:** `src/domains/roles/stores/roles-store.ts`, `src/domains/inventory-admin/stores/inventory-store.ts`, `src/domains/workflows/stores/workflow-editor-store.ts`.

Adapted from [LobeHub zustand skill](https://github.com/lobehub/lobehub) — Luxe uses **functional stores**, not class-based actions.

## Hard rules

| Put in Zustand | Never put in Zustand |
|----------------|----------------------|
| Dialog/sheet open + `editingId` | Lists/entities from API (`useGet*`) |
| Selected row for delete/edit UI | Mutation + invalidation logic |
| Wizard step, checkout UI flags | Table pagination/sort/filters (use **nuqs**) |
| Sidebar collapsed, command palette | Form field values (`useAppForm`) |
| Ephemeral real-time buffer (WebSocket) | Auth session / tokens (`AuthProvider` + cookies) |

**API calls:** Orval hooks + `mutateAsync` in components — **not** inside store actions.

## Store scaffold

```ts
import { create } from 'zustand';

interface FeatureStoreState {
  dialogOpen: boolean;
  editingId: number | null;
}

interface FeatureStoreActions {
  openCreateDialog: () => void;
  openEditDialog: (id: number) => void;
  closeDialogs: () => void;
  reset: () => void;
}

type FeatureStore = FeatureStoreState & FeatureStoreActions;

const initialState: FeatureStoreState = {
  dialogOpen: false,
  editingId: null,
};

/** Client UI state for … — one-line JSDoc on exported hook. */
export const useFeatureStore = create<FeatureStore>()((set) => ({
  ...initialState,
  openCreateDialog: () => set({ dialogOpen: true, editingId: null }),
  openEditDialog: (id) => set({ dialogOpen: true, editingId: id }),
  closeDialogs: () => set({ dialogOpen: false, editingId: null }),
  reset: () => set(initialState),
}));
```

Always: `create<T>()((set) => …)` curried syntax · split **State** / **Actions** · `initialState` constant · **`reset()`** on every store.

## Action layers (Luxe mapping)

LobeHub uses `internal_*` + dispatch reducers. Luxe splits responsibilities differently:

| Layer | Where | Example |
|-------|-------|---------|
| **UI actions** | Zustand | `openAdjust(item)`, `closePanel()` |
| **Server writes** | Component + Orval mutation | `await mutation.mutateAsync({ data })` |
| **Cache updates** | TanStack Query | `invalidateQueries`, `onMutate` optimistic |
| **List/map merges** | Zustand `set((s) => …)` | `sales-feed` `ingestEvent` only |

Do **not** add `internal_*` prefixes or class `ActionImpl` — not used in this codebase.

## When to use functional `set` vs plain `set`

| Plain `set({ field: value })` | `set((state) => …)` |
|-------------------------------|---------------------|
| Toggle boolean | Merge into array/map |
| Set single ID / enum panel | Dedupe, slice caps, derive counts |
| Open/close dialog | Guard no-op when unchanged |

See [references/action-patterns.md](references/action-patterns.md).

## Optimistic updates

**Default:** TanStack Query mutation `onMutate` + rollback in `onError` — not Zustand.

**Exception:** live streams where Query is wrong — `src/domains/sales-feed/sales-store.ts` (`hydrateFromSnapshot`, `ingestEvent`). Document why in JSDoc.

**Deletes:** no optimistic UI in Zustand; confirm dialog + mutation + invalidate.

## Consumption

```tsx
// Selectors — avoid subscribing to whole store
const dialogOpen = useRolesStore((s) => s.createDialogOpen);
const openEditDialog = useRolesStore((s) => s.openEditDialog);

// Cleanup on unmount / logout
useEffect(() => () => useRolesStore.getState().reset(), []);
```

## Persist (rare)

Only user preferences or cross-session UI — not server data.

```ts
create<Store>()(
  persist(
    (set, get) => ({ /* … */ }),
    {
      name: 'luxe-<feature>-storage', // scoped per feature
      partialize: (state) => ({ /* only fields that should survive reload */ }),
    },
  ),
);
```

Examples: `search.store.ts`, `vendor-panel-store.ts`. Do not persist dialog open flags or editing IDs.

## File layout

```
src/domains/<domain>/stores/<feature>-store.ts   # preferred
src/store/<cross-cutting>.store.ts               # auth UI, cart only
```

Multiple small stores per domain OK (`workflow-editor-store.ts` + dialog store). Details: [references/store-organization.md](references/store-organization.md).

## Gotchas

- **Discriminated union for panels** — `WorkflowEditorState.panel` `{ type: 'edit-state'; state }` beats many booleans.
- **Mutually exclusive overlays** — closing one dialog clears related IDs (`inventory-store` adjust vs history).
- **DTO types in state** — OK for *UI context* (item being edited), not as a cached list replacement.
- **Do not duplicate** `.cursorrules` table/Query rules — this skill is store-specific workflow only.
- **Near-miss skills:** forms → `/admin-forms`; admin page scaffold → `/new-admin-domain`; perf → `/luxe-react-performance`.

## Checklist

- [ ] State is client-only UI (or documented WebSocket buffer)
- [ ] `FeatureStoreState` + `FeatureStoreActions` + `reset()`
- [ ] `create<T>()((set) => …)` with `initialState`
- [ ] Selectors in components; no server fetch in store
- [ ] Mutations stay in components with Orval hooks
- [ ] `pnpm check` on touched files
