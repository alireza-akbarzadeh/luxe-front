---
name: api-gen
description: >
  Use when luxe-front needs fresh Orval hooks or types in src/services/ — after
  backend Swagger or route changes, when useGet*/usePost* hooks or Dto* types are
  missing, @/services/ imports fail, or the user mentions api:gen, OpenAPI, Orval,
  or regenerating the API client. Apply when Dto types or hooks are stale even if the
  user does not mention Orval. Do not use for writing Go handlers, UI layout, or
  admin page wiring when hooks already exist.
---

# API client regeneration

Run this exact sequence. Do not hand-edit `src/services/`.

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
- **Restart required after `make swagger`.** Editing `docs/` without restart serves stale OpenAPI.
- **Missing hook after regen** → Swagger comments missing/wrong on controller, not a frontend fix. Fix `@Router` / `@Success` → `make swagger` → restart → regen.
- **Form Zod schemas ≠ API types.** Form validation stays in `domains/*/schemas/`; request/response types come from `*.schemas.ts`.
- **`pnpm build` runs `prebuild` → `api:gen`.** CI needs a reachable OpenAPI or committed generated files.

## If hook still missing

Read [references/swagger-fix.md](references/swagger-fix.md) for Luxe Swagger comment patterns.
