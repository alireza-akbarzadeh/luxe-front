import * as Sentry from '@sentry/nextjs';

const isSentryEnabledInDev = process.env['SENTRY_ENABLE_DEV'] === 'true';

export async function register() {
  if (process.env['NODE_ENV'] === 'development' && !isSentryEnabledInDev) {
    return;
  }

  if (process.env['NEXT_RUNTIME'] === 'nodejs') {
    await import('../sentry.server.config');
  }

  if (process.env['NEXT_RUNTIME'] === 'edge') {
    await import('../sentry.edge.config');
  }
}

export const onRequestError = Sentry.captureRequestError;
