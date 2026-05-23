// config/auth.ts
export const APP_CONFIG = {
  accessToken: {
    defaultMaxAge: 15 * 60, // 15 minutes in seconds
    rememberMeMaxAge: 7 * 24 * 60 * 60 // 7 days in seconds
  },
  refreshToken: {
    maxAge: 30 * 24 * 60 * 60 // 30 days in seconds
  },
  API_DEFAULT_TIMEOUT: 30000,
  MAX_RETRY_LIMIT: 3,
  MAX_AGE: 15 * 60 // 15 min
} as const;

export type AuthConfig = typeof APP_CONFIG;
