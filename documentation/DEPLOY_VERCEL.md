# Deploy luxe-front on Vercel (API on Render)

Production layout:

```
Vercel (luxe-front)  →  Render (luxe-backend)  →  Neon Postgres
```

Backend setup: `luxe-backend/documentation/DEPLOY_RENDER.md`

---

## 1. Deploy the API first (Render)

1. Deploy `luxe-backend` on Render — live API: `https://luxe-3pvz.onrender.com`
2. Note the API base path: `https://luxe-3pvz.onrender.com/api/v1`
3. Confirm health:

```bash
curl https://luxe-3pvz.onrender.com/health/live
curl https://luxe-3pvz.onrender.com/api/v1/health/ready
```

4. On Render, set (replace with your Vercel URL once known):

```env
FRONTEND_URL=https://your-project.vercel.app
CORS_ALLOW_ORIGINS=https://your-project.vercel.app
```

---

## 2. Import project on Vercel

1. [vercel.com](https://vercel.com) → **Add New** → **Project**
2. Import the `luxe-front` GitHub repo
3. Framework preset: **Next.js**
4. Root directory: `.` (repo root)
5. Build command: default (`pnpm build` — runs Orval via `prebuild` using `openapi3.json`)

---

## 3. Environment variables (Vercel)

**Settings → Environment Variables → Production:**

| Variable | Required | Example |
|----------|----------|---------|
| `NEXT_PUBLIC_API_URL` | Yes | `https://luxe-3pvz.onrender.com/api/v1` |
| `BACKEND_API_URL` | Yes | `https://luxe-3pvz.onrender.com/api/v1` |
| `NEXT_PUBLIC_SITE_URL` | Yes | `https://your-project.vercel.app` or custom domain |

Optional (if you use them locally):

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_WS_URL` | WebSocket override |
| `NEXT_PUBLIC_APP_DOMAIN` | Auth redirect allowlist |
| `NEXT_PUBLIC_APP_ORIGIN` | Auth redirect allowlist |

You do **not** need `DATABASE_URL` on Vercel — the database is only used by the API on Render.

---

## 4. Deploy

Click **Deploy**. After the first deploy:

1. Copy the Vercel URL (e.g. `https://luxe-front-xxx.vercel.app`)
2. Update Render `FRONTEND_URL` and `CORS_ALLOW_ORIGINS` to that URL
3. Redeploy Render if CORS was wrong on first pass
4. Update `NEXT_PUBLIC_SITE_URL` on Vercel if you used a placeholder

---

## 5. Custom domain (optional)

1. Vercel → **Domains** → add your domain
2. Add the same domain to Render `CORS_ALLOW_ORIGINS` (comma-separated with `.vercel.app` if you keep both)
3. Update `NEXT_PUBLIC_SITE_URL` to the custom domain

---

## 6. Local dev vs production

| | Local | Production |
|---|--------|------------|
| Frontend | `pnpm dev` (:3000) | Vercel |
| API | `make run` (:8080) or Render URL | Render |
| DB | Local Postgres or Neon | Neon |

`.env.local` example:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
BACKEND_API_URL=http://localhost:8080/api/v1
```

---

## 7. Troubleshooting

| Issue | Fix |
|-------|-----|
| CORS error in browser | `CORS_ALLOW_ORIGINS` on Render must match exact Vercel origin |
| API 502 / slow first load | Render free tier cold start — wait or upgrade plan |
| Build fails on Orval | Ensure `openapi3.json` is committed and current. After backend Swagger changes: `OPENAPI_BASE_URL=https://luxe-3pvz.onrender.com pnpm openapi:sync` then commit `openapi3.json`. Live API Swagger UI: [luxe-3pvz.onrender.com/swagger](https://luxe-3pvz.onrender.com/swagger/index.html) |
| `Can't resolve '@/services/-…'` | Stale `openapi3.json` — missing routes (e.g. gift-finder, smart-bundles). Run `pnpm openapi:sync` from a deployed API, commit `openapi3.json`, redeploy Vercel |
| API calls go to `localhost:8080` in production | Remove `NEXT_PUBLIC_API_URL` / `BACKEND_API_URL` if set to localhost on Vercel; redeploy. Server code now ignores localhost in production and uses Render. |
| `https://localhost:8080/...` in logs | Wrong Vercel env or stale build — set both API vars to `https://luxe-3pvz.onrender.com/api/v1` and redeploy |
| Checkout shows “payment could not be started” / no Stripe redirect | On **Render**: `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET` (required in production), and `FRONTEND_URL=https://your-project.vercel.app`. Redeploy API after env changes. Confirm `GET /api/v1/payments/stripe-config` returns `"enabled": true`. |
| Vercel **Deployment Protection** (302 to Vercel login) | Disable protection for production, or use a public custom domain — protected previews block `/api/v1/*` rewrites for unauthenticated clients |
