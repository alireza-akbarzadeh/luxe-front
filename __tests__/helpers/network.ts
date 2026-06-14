import type { Page } from '@playwright/test';

/**
 * Tracks duplicate RSC refetch loops (e.g. notFound() during loading).
 */
export async function countRscRequests(page: Page, action: () => Promise<void>) {
  const requests: string[] = [];

  const handler = (url: string) => {
    if (url.includes('_rsc=')) {
      requests.push(url);
    }
  };

  page.on('request', (request) => handler(request.url()));

  await action();

  return requests;
}

export function assertNoRscStorm(requests: string[], maxRequests = 12) {
  const productPageRequests = requests.filter((url) => url.includes('/product/'));

  if (productPageRequests.length > maxRequests) {
    throw new Error(
      `Expected at most ${maxRequests} product RSC requests, got ${productPageRequests.length}. Possible render loop.`
    );
  }
}
