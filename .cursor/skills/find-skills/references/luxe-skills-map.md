# Luxe skill routing map

Use this before `npx skills find`. Invoke with `/skill-name` in Cursor Agent.

## luxe-front (`.cursor/skills/`)

| Skill | Triggers (examples) |
|-------|---------------------|
| `find-skills` | find/install skills, skills.sh, extend agent capabilities |
| `api-gen` | `pnpm api:gen`, missing `useGet*`, stale `Dto*`, Swagger changed, restart + regen |
| `tanstack-query` | Orval useGet*/mutations, invalidateQueries, prefetch, infinite query |
| `tanstack-table` | DataTable, useServerTable, ColumnDef, bulk delete, server pagination |
| `zustand` | client UI store, dialog/sheet state, reset(), persist, Query vs Zustand |
| `admin-forms` | useAppForm, Zod schema, form submit, mapper, json-field |
| `new-admin-domain` | new dashboard page, admin CRUD, server table, `/dashboard/*` route |
| `layout-typography` | div flex/grid, Typography, Grid/Flex props, section layout |
| `luxe-react-performance` | slow page, re-renders, bundle, Recharts, staleTime, TanStack Query tuning |
| `shadcn` | shadcn CLI add/search, Dialog/Sheet/Field, components.json, registries |
| `framer-motion` | motion/react animations, hero stagger, transform/opacity only |
| `frontend-design` | distinctive storefront/marketing visual direction, typography, palette |
| `design-taste-frontend` | anti-slop landing/portfolio redesign — not dashboards |
| `vercel-composition-patterns` | compound components, boolean prop proliferation, React 19 `use()` |

## luxe backend (`luxe/.cursor/skills/`)

| Skill | Triggers (examples) |
|-------|---------------------|
| `new-api-entity` | new table, migration, full CRUD domain, new REST resource |
| `add-api-endpoint` | bulk delete, extra action, new route on existing service |
| `find-skills` | find/install skills for Go/backend workflows |

## Cross-repo flows

| Flow | Skills / steps |
|------|----------------|
| Full-stack feature | `luxe` `/new-api-entity` → restart API → `luxe-front` `/api-gen` → `/new-admin-domain` |
| Swagger/DTO rename | `luxe` swagger + restart → `luxe-front` `/api-gen` → fix mappers |
| Admin form + layout | `/admin-forms` + `/layout-typography` |
| Admin table + cache | `/tanstack-table` + `/tanstack-query` |
| Dialog / selection UI state | `/zustand` (not Query, not nuqs) |
| Storefront motion | `/framer-motion` + `/frontend-design` or `/design-taste-frontend` |
| Slow dashboard / charts | `/luxe-react-performance` |
| shadcn component add | `/shadcn` — do not hand-edit `src/components/ui/*` |

## When to create a new local skill

- Repeats **3+ times** and is Luxe-specific (Orval, domains, Go layers, layout primitives)
- Not covered by AGENTS.md alone
- Needs checklist, gotchas, or evals

Do **not** duplicate content already in `.cursorrules` — skills are workflows, rules are always-on.

After adding a skill: update `eval-queries.json`, add `evals/evals.json`, and this map.
