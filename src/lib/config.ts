// config/auth.ts
export const APP_CONFIG = {
  accessToken: {
    defaultMaxAge: 15 * 60, // 15 minutes — short-lived; refresh handles renewal
    rememberMeMaxAge: 15 * 24 * 60 * 60 // 15 days in seconds
  },
  refreshToken: {
    maxAge: 15 * 24 * 60 * 60 // 15 days — must match backend JWT_REFRESH_TOKEN_EXPIRY
  },
  API_DEFAULT_TIMEOUT: 30000,
  MAX_RETRY_LIMIT: 3,
  MAX_AGE: 15 * 60, // 15 min
  CONTAINER_SPACING_PADDING: 'lg:px-20'
} as const;

export type AuthConfig = typeof APP_CONFIG;
