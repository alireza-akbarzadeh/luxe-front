# Store organization (Luxe)

## Where stores live

| Scope | Path | Examples |
|-------|------|----------|
| Domain UI | `src/domains/<domain>/stores/*-store.ts` | `roles-store`, `inventory-store`, `menu-manager-store` |
| Domain root (legacy OK) | `src/domains/<domain>/*.store.ts` | `checkout.store.ts`, `search.store.ts` |
| App-wide client UI | `src/store/*.store.ts` | `auth.store.ts`, `card.store.ts` |

**New stores:** prefer `stores/<feature>-store.ts` under the domain.

## One store vs many

| One store | Split stores |
|-----------|--------------|
| Related dialogs sharing selection context | Unrelated UI (editor panel vs create-workflow dialog) |
| Admin list page: row actions + delete dialog | Checkout wizard vs global cart |

Example — two stores in one file (`workflow-editor-store.ts`):

- `useWorkflowEditorStore` — canvas panel modes
- `useCreateWorkflowDialogStore` — simple `{ open, setOpen }`

## State shape guidelines

```ts
// Good — UI flags + context for the open dialog
adjustTarget: DtoInventoryItemResponse | null;
historyProductId: number | null;

// Good — wizard
currentStep: CheckoutStepId;
completedSteps: CheckoutStepId[];

// Bad — server list cache
items: DtoProduct[];
isLoading: boolean;
```

## Real-time exception

`sales-feed/sales-store.ts` holds derived dashboard metrics fed by WebSocket + snapshot API. Still:

- Initial load via Query/hydrate hook calling `hydrateFromSnapshot`
- Not a substitute for REST list endpoints elsewhere

## Persist scope

Use `persist` only when UX needs survival across reloads:

| Persist | Do not persist |
|---------|----------------|
| Recent searches, view mode | `dialogOpen`, `editingId` |
| Sidebar collapsed, active vendor store | Mutation error strings |
| User preference toggles | Table filters (URL instead) |

Storage key: `luxe-<feature>-storage`. Use `partialize`.

## Cross-store access

Avoid `useOtherStore.getState()` inside store actions unless unavoidable (rare). Prefer orchestration in the component or a small hook:

```tsx
function useCloseAllAdminDialogs() {
  const resetRoles = useRolesStore((s) => s.reset);
  const resetInventory = useInventoryStore((s) => s.reset);
  return () => {
    resetRoles();
    resetInventory();
  };
}
```

## Related skills

| Need | Skill |
|------|-------|
| Form fields + submit | `/admin-forms` |
| Admin page + table | `/new-admin-domain` |
| Query cache / perf | `/luxe-react-performance` |
| API types / hooks | `/api-gen` |
