import type { Page, Route } from '@playwright/test';

type MockRouteOptions = {
  status?: number;
  contentType?: string;
  body?: unknown;
  delayMs?: number;
};

/**
 * Intercepts browser-initiated requests only.
 * Next.js Server Actions call the API from the Node process — use @integration
 * tests with a real API, or stub at the API gateway layer.
 */
export async function mockJsonRoute(
  page: Page,
  urlPattern: string | RegExp,
  options: MockRouteOptions
): Promise<void> {
  await page.route(urlPattern, async (route: Route) => {
    if (options.delayMs) {
      await new Promise((resolve) => setTimeout(resolve, options.delayMs));
    }

    await route.fulfill({
      status: options.status ?? 200,
      contentType: options.contentType ?? 'application/json',
      body: JSON.stringify(options.body ?? {})
    });
  });
}
