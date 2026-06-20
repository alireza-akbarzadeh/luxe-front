# Swagger contract sync (backend → frontend)

Load after any backend change that touches the OpenAPI contract.

## Required sequence (both repos)

Any change below → **`make swagger`** → **restart luxe API** → **`pnpm api:gen`** in luxe-front.

Skipping restart serves **stale** `/openapi`. Skipping `api:gen` leaves **stale** hooks and `Dto*` types in `src/services/`.

```bash
# luxe
make swagger
make run    # or restart the running process — OpenAPI is cached at startup

# luxe-front (API must be up; verify GET /openapi)
pnpm api:gen
pnpm check  # fix broken imports after renamed types
```

## When this applies

Run the full sequence if Swagger/OpenAPI changed because of:

| Change | Examples |
|--------|----------|
| **New endpoint** | New `@Router`, new admin route |
| **New DTO** | New request/response struct in `internal/dto/` |
| **Renamed DTO or field** | `DtoFoo` → `DtoBar`, JSON field rename |
| **Renamed route or method** | Path or HTTP verb change in `@Router` |
| **Response shape change** | New/removed fields, wrapper change, pagination shape |
| **Swagger comment fix** | `@Success`, `@Param`, tag, or `utils.Response{data=…}` correction |

## After regen on the frontend

- Update imports from `@/services/-…` and `*.schemas.ts` — **do not** hand-patch generated files.
- Update form **mappers** (`lib/*-mapper.ts`) if DTO field names changed — Zod form schemas stay separate from API types.
- Grep for old `Dto*` / hook names; run `pnpm check`.

## Do not

- Edit `src/services/` or `orval.config.js` by hand.
- Run `pnpm api:gen` while the backend is down (wipes `src/services/`).
- Assume `make swagger` alone updates the frontend — restart + `api:gen` are mandatory.
