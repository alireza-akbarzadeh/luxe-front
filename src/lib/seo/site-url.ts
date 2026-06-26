function normalizeSiteOrigin(raw: string): string {
  const trimmed = raw.replace(/\/$/, '');
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  const isLocal =
    trimmed.startsWith('localhost') ||
    trimmed.startsWith('127.0.0.1') ||
    trimmed.startsWith('[::1]');

  return `${isLocal ? 'http' : 'https'}://${trimmed}`;
}

/** Public site origin for canonical URLs, Open Graph, and sitemaps. */
export function getSiteUrl(): string {
  const configured = process.env['NEXT_PUBLIC_SITE_URL']?.trim();
  if (configured) {
    return normalizeSiteOrigin(configured);
  }

  const vercelHost = process.env['VERCEL_URL']?.trim();
  if (vercelHost) {
    return normalizeSiteOrigin(vercelHost);
  }

  return 'http://localhost:3000';
}

/** Build an absolute URL from a site-relative path. */
export function absoluteUrl(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${getSiteUrl()}${normalized}`;
}
