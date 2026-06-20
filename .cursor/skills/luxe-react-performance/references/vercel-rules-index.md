# Vercel React rules index (installed copy)

Vendored at `.cursor/skills/_vendor/vercel-react-best-practices/rules/` (from `vercel-labs/agent-skills`).

Read individual `.md` files when optimizing a specific issue. **Map SWR rules → TanStack Query** for Luxe.

## By priority

| Prefix | Category |
|--------|----------|
| `async-*` | Waterfalls, Suspense, parallel fetch |
| `bundle-*` | Imports, dynamic, preload |
| `server-*` | RSC, cache, serialization |
| `client-*` | Client fetch (→ Query for Luxe), listeners, localStorage |
| `rerender-*` | Transitions, memo discipline, derived state |
| `rendering-*` | Hydration, content-visibility, SVG |
| `js-*` | Micro-optimizations in hot loops |
| `advanced-*` | Effect events, refs |

## Luxe-adapted skill

Prefer **`.cursor/skills/luxe-react-performance/SKILL.md`** for stack-specific guidance before applying generic Vercel rules verbatim.

Source: [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) · [skills.sh](https://skills.sh/vercel-labs/agent-skills/vercel-react-best-practices)
