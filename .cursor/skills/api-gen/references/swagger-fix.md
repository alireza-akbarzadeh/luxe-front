# Fixing missing Orval hooks

Load when `pnpm api:gen` succeeds but the expected `-path-method.ts` file is absent.

## Luxe Swagger response shape

Controllers wrap data in `utils.Response`:

```go
// @Success 200 {object} utils.Response{data=dto.CategoryListResponse}
// @Failure 400 {object} utils.Response
// @Security BearerAuth
// @Router /api/v1/categories [get]
```

Common mistakes:

- `@Success 200 {object} dto.FooResponse` without `utils.Response{data=…}` — Orval may not match frontend expectations
- Missing `@Router` or wrong HTTP verb
- Route registered but handler has no Swagger comments — endpoint exists at runtime but won't appear in `/openapi`

## Fix loop

1. Add/fix comments on the handler in `internal/controllers/`
2. `make swagger` (never edit `docs/` manually)
3. Restart API
4. `pnpm api:gen`
5. `grep` for `-your-path-` in `src/services/`
