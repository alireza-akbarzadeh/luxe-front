---
name: api-gen
description: Regenerates Orval API clients from the luxe-backend OpenAPI spec. Use when backend routes or DTOs changed, a hook or type is missing in src/services/, or the user mentions api:gen, OpenAPI, or Orval.
---

# Luxe Front — API client regeneration

## Prerequisites

- Backend running at `http://localhost:8080` (or set `OPENAPI_BASE_URL`)
- `GET /openapi` returns valid JSON before running generation

## Workflow

```text
Task Progress:
- [ ] Backend: make swagger (from luxe repo)
- [ ] Backend: restart API (OpenAPI is cached at startup)
- [ ] Verify: curl -sf http://localhost:8080/openapi | head
- [ ] Frontend: pnpm api:gen (from luxe-front)
- [ ] Grep src/services/ for the new hook
- [ ] Update domain imports; run pnpm check
```

### Backend (luxe repo)

```bash
cd luxe
make swagger
make run   # or restart the running process
```

### Frontend (luxe-front repo)

```bash
cd luxe-front
pnpm api:gen
```

Override URL if needed:

```bash
OPENAPI_BASE_URL=http://localhost:8080 pnpm api:gen
```

## After generation

Import pattern:

```ts
import { useGetProducts, getGetProductsQueryKey } from '@/services/-products-get';
import type { DtoProductWithLike } from '@/services/-products-get.schemas';
```

Invalidate with generated `get*QueryKey()` — never hand-write query keys.

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| `src/services/` empty or partial | Backend was down during `api:gen`; restart API, re-run |
| Hook missing after gen | Add Swagger comments on controller → `make swagger` → restart → regen |
| Types wrong / stale | Restart backend; do not hand-edit `src/services/*` |
| Build fails on CI | `prebuild` runs `api:gen`; CI must reach OpenAPI or use committed services |

## Hard rules

- Never edit `src/services/` or `orval.config.js` by hand
- Never use raw `fetch`/`axios` in components — use generated hooks
- API types live in `*.schemas.ts`; form-only Zod schemas stay in `domains/*/schemas/`

## Reference

- `documentation/architecture.md` — full Orval pipeline
- `AGENTS.md` — import examples
