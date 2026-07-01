# Luxe Front — Agent Skills

**Single skills root:** `.cursor/skills/` (committed). Do not maintain a parallel `.agents/skills/` tree — CLI installs land in `.agents/` (gitignored); copy or adapt into here.

| Subfolder | Purpose |
|-----------|---------|
| `<skill-name>/` | Team-authored Luxe skills (`SKILL.md`, references, evals) |
| `_vendor/` | Third-party rule packs (e.g. Vercel React best practices) — read-only upstream copies |

Each skill has:

| Path | Purpose |
|------|---------|
| `SKILL.md` | Core instructions (loaded when skill triggers) |
| `references/` | Detail loaded on demand |
| `evals/evals.json` | **Output quality** test cases |
| `eval-queries.json` (root) | **Description triggering** test prompts |
| `scripts/` | Optional verifiers bundled with a skill |

## Skills

| Skill | When |
|-------|------|
| `find-skills` | Discover/install skills — **local skills first**, then skills.sh |
| `api-gen` | Orval regen after backend OpenAPI changes |
| `tanstack-query` | Server data — Orval hooks, invalidation, prefetch; not raw fetch |
| `tanstack-table` | Admin lists — `Table`, `useServerTable`, `*-columns.tsx` |
| `zustand` | Client UI stores — dialogs, selections; not server data |
| `admin-forms` | useAppForm + Zod + Orval mutations |
| `new-admin-domain` | New `/dashboard/*` feature scaffold |
| `layout-typography` | Flex/Grid/Typography instead of raw div + Tailwind layout/text |
| `luxe-react-performance` | React/Next perf — Query, Recharts, bundle, re-renders |
| `lighthouse-performance` | Lighthouse 90+ audits — LCP, TBT, RSC boundaries, CWV fix ranking |
| `shadcn` | Add/fix/compose shadcn/ui components via CLI |
| `framer-motion` | Storefront/marketing motion — `motion/react`, transform/opacity |
| `frontend-design` | Distinctive visual direction for new/redesigned marketing UI |
| `design-taste-frontend` | Anti-slop landing/portfolio redesigns (not admin dashboards) |
| `vercel-composition-patterns` | Compound components, boolean prop refactors (see `Table`) |

---

## 1. Description triggering (`eval-queries.json`)

Tests whether the **description** loads the right skill.

1. Pick train queries from `eval-queries.json`
2. Run in Cursor Agent; note false positives/negatives
3. Revise **description only** in `SKILL.md` (generalize, ≤1024 chars)
4. Validate on held-out `split: "validation"` queries

See [agentskills.io — optimizing descriptions](https://agentskills.io/skill-creation/optimizing-descriptions).

---

## 2. Output quality (`<skill>/evals/evals.json`)

Tests whether the skill produces **good outputs** on realistic tasks.

### Workspace layout

```
layout-typography/
├── SKILL.md
├── evals/
│   ├── evals.json
│   └── files/              # Input fixtures
└── scripts/
    └── verify-layout.mjs

layout-typography-workspace/
└── iteration-1/
    ├── refactor-form-section-shell/
    │   ├── with_skill/outputs/
    │   │   ├── refactored.tsx
    │   │   ├── grading.json
    │   │   └── timing.json
    │   └── without_skill/outputs/
    └── benchmark.json
```

### Run one eval (manual)

1. Snapshot skill or use `/skill-name` in Agent
2. Run the eval **prompt** from `evals/evals.json` (attach `files` if listed)
3. Save agent output to `…/with_skill/outputs/`
4. Repeat **without** the skill → `without_skill/outputs/`
5. Grade assertions → `grading.json`
6. For layout TSX outputs, run:

```bash
node .cursor/skills/layout-typography/scripts/verify-layout.mjs \
  layout-typography-workspace/iteration-1/refactor-form-section-shell/with_skill/outputs/refactored.tsx
```

### Iteration loop

1. Grade assertions + human review (`feedback.json`)
2. Update `SKILL.md` gotchas (not one-off prompt patches)
3. Rerun all evals in `iteration-2/`
4. Stop when pass rate plateaus or feedback is empty

See [agentskills.io — evaluating skill output quality](https://agentskills.io/skill-creation/evaluating-skills).

---

## Skill boundaries

| Skill | Should not steal from |
|-------|----------------------|
| `api-gen` | `new-admin-domain`, backend swagger authoring |
| `tanstack-query` | `api-gen`, `tanstack-table`, `zustand` |
| `tanstack-table` | `tanstack-query`, `useAppForm`, raw div layout |
| `zustand` | TanStack Query cache, nuqs table state, `useAppForm` |
| `admin-forms` | `layout-typography`, backend DTOs |
| `layout-typography` | `admin-forms`, DataTable |
| `new-admin-domain` | storefront routes, `api-gen` alone |
| `luxe-react-performance` | replacing Orval, useAppForm, DataTable, layout skills |
| `shadcn` | `layout-typography` (layout primitives), hand-edit `src/components/ui/*` |
| `framer-motion` | admin perf (`luxe-react-performance`), admin CRUD UI |
| `frontend-design` | admin dashboards, forms, tables |
| `design-taste-frontend` | dashboards, data tables, multi-step product UI |
| `vercel-composition-patterns` | Zustand stores, Orval/API layer |
| `find-skills` | executing workflows — routes to other skills |

## Eval coverage checklist

| Skill | `eval-queries.json` | `evals/evals.json` |
|-------|--------------------|--------------------|
| api-gen | yes | yes |
| admin-forms | yes | yes |
| layout-typography | yes | yes |
| new-admin-domain | yes | yes |
| luxe-react-performance | yes | yes |
| tanstack-query | yes | yes |
| tanstack-table | yes | yes |
| zustand | yes | yes |
| shadcn | yes | yes |
| framer-motion | yes | yes |
| frontend-design | yes | yes |
| design-taste-frontend | yes | yes |
| vercel-composition-patterns | yes | yes |
| find-skills | yes | yes |
