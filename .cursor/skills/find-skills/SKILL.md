---
name: find-skills
description: >
  Use when the user asks to find, install, or discover agent skills — "find a skill for X",
  "how do I do X", "is there a skill for…", or extending agent capabilities. Checks Luxe
  project skills in .cursor/skills/ first, then searches skills.sh via npx skills find.
  Do not use for executing Luxe tasks directly when a local /api-gen or /layout-typography
  skill already applies.
---

# Find Skills (Luxe)

**Default order:** local Luxe skill → project docs → ecosystem (`npx skills find`).

## Step 1 — Match local Luxe skills first

Before searching skills.sh, map the request to an **existing project skill** (invoke with `/skill-name`):

| User need | Repo | Skill |
|-----------|------|-------|
| Orval regen, missing hooks, Swagger/DTO changes | **luxe-front** | `/api-gen` |
| Flex/Grid/Typography, layout, section headings | **luxe-front** | `/layout-typography` |
| React perf, Query cache, Recharts, bundle, re-renders | **luxe-front** | `/luxe-react-performance` |
| New admin `/dashboard/*` page, CRUD list | **luxe-front** | `/new-admin-domain` |
| useAppForm, Zod, submit, mappers | **luxe-front** | `/admin-forms` |
| New Go entity (migration → Swagger) | **luxe** | `/new-api-entity` |
| New route on existing Go service | **luxe** | `/add-api-endpoint` |

Full map: [references/luxe-skills-map.md](references/luxe-skills-map.md).

If a local skill matches, **use it** — do not install a generic ecosystem skill that conflicts (e.g. raw fetch wrappers instead of Orval).

## Step 2 — Check project docs

| Topic | Read |
|-------|------|
| Front conventions | `AGENTS.md`, `.cursorrules`, `documentation/architecture.md` |
| Backend conventions | `luxe/AGENTS.md`, `luxe/.cursorrules` |
| Skill index | `.cursor/skills/README.md` (each repo) |

## Step 3 — Search ecosystem (only if local skill missing)

```bash
# Run from luxe-front or luxe repo root
npx skills find [query]
```

Browse leaderboard first: https://skills.sh/

**Quality bar before recommending:**

- Prefer **1K+ installs**; cautious under 100
- Prefer **vercel-labs**, **anthropics**, **microsoft** sources
- Read SKILL.md after install — skills run with agent permissions

**Install project-local (preferred for team):**

```bash
cd luxe-front   # or luxe
npx skills add <owner/repo@skill> -y
# Installs under .agents/skills/ (gitignored) — copy or adapt into .cursor/skills/ for team use
```

**Install globally (personal only):**

```bash
npx skills add <owner/repo@skill> -g -y
```

Curated external options for Luxe stack: [references/ecosystem-shortlist.md](references/ecosystem-shortlist.md).

## Step 4 — Present to user

Include: skill name, what it does, install count, install command, skills.sh link.

Example:

```
Local match: use /api-gen — Swagger changed → make swagger → restart API → pnpm api:gen.

External option: vercel-labs/agent-skills@react-best-practices (~185K installs)
npx skills add vercel-labs/agent-skills@react-best-practices -y
https://skills.sh/vercel-labs/agent-skills/react-best-practices
```

## Step 5 — Create a Luxe skill when none exists

If the task repeats and is **Luxe-specific**:

```text
.cursor/skills/<name>/SKILL.md
references/          # optional detail
evals/evals.json     # optional output tests
```

Follow patterns in sibling skills. Add to `references/luxe-skills-map.md` and `.cursor/skills/README.md`.

Generic scaffold: `npx skills init my-skill-name`

## Gotchas

- **Two repos:** `luxe-front` and `luxe` each have `.cursor/skills/` — pick repo by task.
- **Do not install skills that bypass Orval, useAppForm, DataTable, or Flex/Grid conventions.**
- **Swagger changes** always need local `/api-gen` workflow, not a third-party API client skill.
- **`.cursor/skills/`** = single committed skills root (team skills + `_vendor/` for third-party rule packs).
- **`npx skills add`** writes to `.agents/skills/` (gitignored) — merge into `.cursor/skills/` before sharing.
