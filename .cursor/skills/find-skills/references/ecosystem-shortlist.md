# Ecosystem skills (optional for Luxe)

Install only when **no local Luxe skill** fits. Verify SKILL.md before use.

## Worth evaluating (check skills.sh for current install counts)

| Skill | Source | Luxe status |
|-------|--------|-------------|
| `zustand` | `lobehub/lobehub` | **Adapted** → `/zustand` (Luxe functional stores; no class ActionImpl) |
| `tanstack-table` | `tanstack-skills/tanstack-skills` | **Adapted** → `/tanstack-table` (use `Table` + `useServerTable`, not raw useReactTable) |
| `tanstack-query` | `tanstack-skills/tanstack-skills` | **Adapted** → `/tanstack-query` (Orval hooks + get*QueryKey, not raw fetch) |
| `vercel-react-best-practices` | `vercel-labs/agent-skills` | **Adapted** → `/luxe-react-performance` (vendor rules in `_vendor/vercel-react-best-practices/`) |
| `vercel-composition-patterns` | `vercel-labs/agent-skills` | Installed → `/vercel-composition-patterns` (align with existing `Table` compound API) |
| `shadcn` | shadcn CLI skill | Installed → `/shadcn` (canonical: `.cursor/skills/shadcn/`; remove duplicate `.cursor/shadcn/`) |
| `framer-motion` | community | Installed → `/framer-motion` (storefront motion; use `motion/react`) |
| `frontend-design` | Anthropic/community | Installed → `/frontend-design` (marketing UI direction) |
| `design-taste-frontend` | community | Installed → `/design-taste-frontend` (landing/portfolio only) |
| `web-design-guidelines` | `vercel-labs/agent-skills` | UI/a11y review — complements `/layout-typography` |
| `playwright-e2e-init` | `shipshitdev/library` | Luxe has Playwright — adapt, don't replace `@smoke` conventions |

Install raw Vercel skill (optional — team skill is preferred):

```bash
npx skills add vercel-labs/agent-skills@vercel-react-best-practices -y
```

Then use **`/luxe-react-performance`**, not the raw skill, for day-to-day work.

Search commands:

```bash
npx skills find react performance
npx skills find playwright e2e
npx skills find code review
npx skills find openapi orval
```

## Usually skip for Luxe

- Generic REST/axios client skills → use Orval `/api-gen`
- Generic form skills → use `/admin-forms` + `useAppForm`
- Generic React table skills → use custom `DataTable`
- Skills that teach raw `div` layout → conflicts with `/layout-typography`

## After installing external skill

1. Read full SKILL.md — reject steps that conflict with `AGENTS.md`
2. If team-wide: copy adapted version into `.cursor/skills/<name>/` and trim
3. Add eval case in `evals/evals.json` if it becomes critical
