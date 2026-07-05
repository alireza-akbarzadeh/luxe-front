/** User-facing semver — bump package.json before a release. */
export const APP_VERSION = process.env['NEXT_PUBLIC_APP_VERSION'] ?? '0.0.0';

/** Deploy identity — changes on every production build (git SHA). */
export const APP_BUILD_ID = process.env['NEXT_PUBLIC_BUILD_ID'] ?? 'dev';

export function formatAppVersionLabel(version = APP_VERSION, buildId = APP_BUILD_ID): string {
  if (buildId === 'dev') {
    return `v${version}`;
  }
  return `v${version} (${buildId})`;
}
