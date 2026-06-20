# Luxe Front — Agent Skills

Project skills live under `.cursor/skills/`. Each skill has:

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
| `layout-typography` | Flex/Grid/Typography instead of raw div + Tailwind layout/text |
| `api-gen` | Orval regen after backend OpenAPI changes |
| `new-admin-domain` | New `/dashboard/*` feature scaffold |
| `admin-forms` | useAppForm + Zod + Orval mutations |

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
| `layout-typography` | `admin-forms`, DataTable |
| `new-admin-domain` | storefront routes, `api-gen` alone |
| `admin-forms` | `layout-typography`, backend DTOs |
