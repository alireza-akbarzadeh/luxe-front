/** Public site origin for canonical URLs, Open Graph, and sitemaps. */
export function getSiteUrl(): string {
  const configured = process.env['NEXT_PUBLIC_SITE_URL']?.trim();
  if (configured) {
    return configured.replace(/\/$/, '');
  }

  const vercelHost = process.env['VERCEL_URL']?.trim();
  if (vercelHost) {
    return `https://${vercelHost.replace(/\/$/, '')}`;
  }

  return 'http://localhost:3000';
}

/** Build an absolute URL from a site-relative path. */
export function absoluteUrl(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${getSiteUrl()}${normalized}`;
}
