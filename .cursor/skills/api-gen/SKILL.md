---
name: api-gen
description: >
  Use when luxe-front needs fresh Orval hooks or types in src/services/ — after
  backend Swagger or route changes, when useGet*/usePost* hooks or Dto* types are
  missing, @/services/ imports fail, Dto or hook renames after backend changes, or the user
  mentions api:gen, OpenAPI, Orval, or regenerating the API client. Apply when Dto types or hooks are stale even if the
  user does not mention Orval. Do not use for writing Go handlers, UI layout, or
  admin page wiring when hooks already exist.
---

# API client regeneration

Run this exact sequence. Do not hand-edit `src/services/`.

## When backend Swagger changes

If **luxe** changed DTOs, routes, response shapes, or Swagger comments → full sync required:

```text
luxe: make swagger → restart API → luxe-front: pnpm api:gen → pnpm check
```

Applies to: new endpoints, new/renamed `Dto*`, renamed fields, renamed paths/methods, `@Success` / wrapper fixes. Details: [references/swagger-contract-sync.md](references/swagger-contract-sync.md).

**Never** patch `src/services/` manually for contract changes — regen after restart.

## Checklist

```text
- [ ] luxe: make swagger
- [ ] Restart API (OpenAPI cached at process start)
- [ ] curl -sf http://localhost:8080/openapi | head -c 200
- [ ] luxe-front: pnpm api:gen
- [ ] grep src/services/ for expected hook filename
- [ ] pnpm check
```

## Commands

```bash
# luxe
make swagger && make run

# luxe-front — backend must be up first
pnpm api:gen
# OPENAPI_BASE_URL=http://localhost:8080 pnpm api:gen  # override
```

OpenAPI URL resolves from `OPENAPI_BASE_URL`, else `NEXT_PUBLIC_API_URL` (strips `/api/v1`), else `http://localhost:8080`.

## After generation

```ts
import { useGetProducts, getGetProductsQueryKey } from '@/services/-products-get';
import type { DtoProductWithLike } from '@/services/-products-get.schemas';
```

Invalidate with `get*QueryKey()` factories only.

## Gotchas

- **`pnpm api:gen` wipes `src/services/` first** (`code-generator.js`). If the backend is down, generation fails and services may be empty — fix backend, then re-run.
- **Restart required after `make swagger`.** Editing `docs/` without restart serves stale OpenAPI — frontend `api:gen` will pull old spec.
- **Renamed DTO/field/route** → regen then fix imports and `lib/*-mapper.ts`; Zod form schemas in `domains/*/schemas/` are separate from Orval types.
- **Backend agent finished Swagger?** Confirm API was **restarted** before running `pnpm api:gen`.
- **Missing hook after regen** → Swagger comments missing/wrong on controller, not a frontend fix. Fix `@Router` / `@Success` → `make swagger` → restart → regen.
- **Form Zod schemas ≠ API types.** Form validation stays in `domains/*/schemas/`; request/response types come from `*.schemas.ts`.
- **`pnpm build` runs `scripts/prebuild.mjs` then `next build`.** Vercel/CI uses committed `openapi3.json`; keep it updated via `pnpm openapi:sync`.

## If hook still missing

Read [references/swagger-fix.md](references/swagger-fix.md) for Luxe Swagger comment patterns.
