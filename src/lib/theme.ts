export type Theme = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'luxe-theme';

export function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function resolveTheme(theme: Theme): ResolvedTheme {
  return theme === 'system' ? getSystemTheme() : theme;
}

export function readStoredTheme(defaultTheme: Theme = 'system'): Theme {
  if (typeof window === 'undefined') return defaultTheme;
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === 'light' || stored === 'dark' || stored === 'system') return stored;
  return defaultTheme;
}

export function applyResolvedTheme(resolved: ResolvedTheme) {
  document.documentElement.classList.toggle('dark', resolved === 'dark');
}

/** Inline script for layout — runs before paint to avoid theme flash. Brand default is dark; 'system' is respected only when explicitly chosen. */
export const themeInitScript = `(function(){try{var k='${THEME_STORAGE_KEY}';var t=localStorage.getItem(k);var s=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';var r=t==='dark'||t==='light'?t:(t==='system'?s:'dark');document.documentElement.classList.toggle('dark',r==='dark');}catch(e){}})();`;
