/**
 * Resolves the Go API base URL for server-side fetches and Next.js rewrites.
 * Browser clients should use same-origin `/api/v1` (see api-client.ts).
 */
const DEV_API_BASE = 'http://localhost:8080/api/v1';

/** Last-resort production default — matches `.env.production` and Render deploy. */
const PRODUCTION_API_BASE = 'https://luxe-3pvz.onrender.com/api/v1';

function normalizeBaseUrl(url: string): string {
  return url.replace(/\/$/, '');
}

function isLocalhostUrl(url: string): boolean {
  return /localhost|127\.0\.0\.1/i.test(url);
}

/**
 * Server / build-time API base (no trailing slash).
 * In production, never returns localhost — mis-set Vercel env falls back to Render.
 */
export function resolveApiBaseUrl(): string {
  const raw = process.env['BACKEND_API_URL'] ?? process.env['NEXT_PUBLIC_API_URL'];
  const configured = raw ? normalizeBaseUrl(raw) : null;

  if (process.env.NODE_ENV === 'production') {
    if (!configured || isLocalhostUrl(configured)) {
      return PRODUCTION_API_BASE;
    }
    return configured;
  }

  return configured ?? DEV_API_BASE;
}
