# Luxe Front — Architecture

High-level design for developers and AI agents. For coding rules see `.cursorrules` and `AGENTS.md`.

## Request flow

```
Browser
  → Next.js App Router (RSC by default)
  → Domain component ("use client" when needed)
  → Orval hook (useQuery / useMutation) in src/services/
  → customInstance (axios) in src/lib/api/api-client.ts
  → luxe-backend /api/v1/*
```

Admin layout: `src/app/(admin)/dashboard/layout.tsx` — auth gate, `AppSidebarLayout`, backend-driven nav.

## Directory layout

```
src/
  app/                    # Routes only — thin pages delegate to domains
    (admin)/dashboard/    # Admin UI (/dashboard/*)
    (store)/              # Storefront routes
  domains/<domain>/       # Feature code (primary pattern)
    components/
    containers/
    sections/             # columns, forms, table sections
    schemas/              # Zod (forms); NOT API types
    stores/               # Zustand (UI state only)
    lib/                  # domain helpers
  components/
    ui/                   # shadcn — avoid hand-editing
    forms/                # useAppForm + field components
    table/                # DataTable (Table.*)
  services/               # GENERATED — Orval API clients + types
  stores/                 # Global Zustand slices
  lib/                    # Shared utils, api client
```

**Note:** Older docs may say `src/features/` — this codebase uses **`src/domains/`**.

## API generation (Orval)

The frontend does **not** define REST types by hand. They come from the backend OpenAPI spec.

### Pipeline

```
luxe-backend: Go DTOs + @Router Swagger comments
       ↓
make swagger  →  docs/swagger.json (gitignored on backend)
       ↓
Restart API   →  GET /openapi serves converted OpenAPI 3
       ↓
luxe-front: pnpm api:gen
       ↓
code-generator.js  →  fetch /openapi, write orval.config.js
       ↓
orval  →  src/services/-*.ts + *.schemas.ts
```

### Commands

```bash
# Backend (from luxe-backend/)
make swagger
make run          # restart required — OpenAPI cached at startup

# Frontend (from luxe-front/)
pnpm api:gen      # OPENAPI_BASE_URL defaults to http://localhost:8080
```

`pnpm build` runs `prebuild` → `api:gen` automatically.

### Using generated clients

**Query:**

```ts
import { useGetWorkflowsKey } from '@/services/-workflows-{key}-get';
import type { DtoWorkflowDefinitionView } from '@/services/-workflows-{key}-get.schemas';

const { data, isLoading, refetch } = useGetWorkflowsKey('order');
const definition = data?.data;
```

**Mutation + invalidation:**

```ts
import { usePostAdminWorkflowsIdStates } from '@/services/-admin-workflows-{id}-states-post';
import { getGetWorkflowsKeyQueryKey } from '@/services/-workflows-{key}-get';

const queryClient = useQueryClient();
await createState({ id: workflowId, data: payload });
await queryClient.invalidateQueries({ queryKey: getGetWorkflowsKeyQueryKey(workflowKey) });
```

**Types:** import from sibling `*.schemas.ts`, e.g. `ModelsWorkflow`, `GetAdminWorkflows200`, `DtoCreateWorkflowStateRequest`.

### Rules

| Do | Don't |
|----|--------|
| Import hooks from `@/services/-...` | Edit files in `src/services/` |
| Use `get*QueryKey()` for invalidation | Hand-write query key strings |
| Run `pnpm api:gen` after backend API changes | Manually patch `.schemas.ts` |
| Ensure API is running before `api:gen` | Run `api:gen` against a stale/down server |

If generation fails mid-run, `src/services/` may be empty — re-run with backend up.

## State

| Concern | Tool | Location |
|---------|------|----------|
| Server/API data | TanStack Query | Orval hooks, query cache |
| Table pagination/filters/sort | URL (`nuqs`) + `useServerTable` | not Zustand |
| Modals, selection, drafts | Zustand | `domains/*/stores/` |
| Form draft | TanStack Form via `useAppForm` | component-local |

## Forms

- Hook: `src/components/forms/useAppForm.ts`
- Schemas: Zod v4 in `domains/<x>/schemas/` or `src/schemas/`
- Validation: prefer `safeParse` in `validators.onChange` (see `discount-form.tsx`)
- Submit: Orval `useMutation` hooks, toast via `sonner`

## Tables

- Component: `src/components/table/data-table.tsx` — `Table.Root`, `Table.Toolbar`, `Table.Grid`, `Table.Pagination`
- Server-driven: `useServerTable` + Orval `useQuery` with URL params
- Client lists: `useTableState` + local data
- Columns: `sections/*-columns.tsx` as `ColumnDef<T>[]`

## Admin routes pattern

```tsx
// src/app/(admin)/dashboard/workflows/page.tsx
import { WorkflowsDomain } from '@/domains/workflows/workflows.domain';
export default function WorkflowsPage() {
  return <WorkflowsDomain />;
}
```

Nav items come from backend `/user-menu-structure` — new admin pages may need a menu entry in backend seed/config.

## Testing

- E2E: Playwright in `tests/` or project e2e folder
- Tags: `@smoke`, `@auth`, `@integration`
- `pnpm test:smoke` for quick CI-style checks

## Related repos

| Repo | Role |
|------|------|
| `luxe-backend` | API source of truth; Swagger drives Orval |
| `luxe-mobile` | Separate client; own API layer |

When changing shared API contracts, update **backend first**, then regenerate front (and mobile separately).
