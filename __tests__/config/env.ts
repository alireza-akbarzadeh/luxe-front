import config from '@/_config';

const truthy = (value: string | undefined) =>
  value === '1' || value === 'true' || value === 'yes';

export const testEnv = {
  baseURL: process.env['PLAYWRIGHT_BASE_URL'] ?? `http://${config.server.host}:${config.server.port}`,
  apiURL: process.env['PLAYWRIGHT_API_URL'] ?? process.env['NEXT_PUBLIC_API_URL'] ?? 'http://localhost:8080/api/v1',
  useSystemChrome: truthy(process.env['PLAYWRIGHT_USE_SYSTEM_CHROME']),
  skipBrowserDownload: truthy(process.env['PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD']),
  isCI: process.env['CI'] !== undefined,
  integrationEnabled: truthy(process.env['E2E_INTEGRATION']),
  credentials: {
    email: process.env['E2E_USER_EMAIL'] ?? '',
    password: process.env['E2E_USER_PASSWORD'] ?? ''
  },
  authStoragePath: '__tests__/.auth/user.json'
} as const;

export function hasIntegrationCredentials(): boolean {
  return Boolean(testEnv.credentials.email && testEnv.credentials.password);
}
