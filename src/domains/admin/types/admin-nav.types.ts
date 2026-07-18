import type { DtoAdminNavRecentPage } from '@/services/-admin-nav-preferences-get.schemas';

export interface AdminNavLink {
  href: string;
  label: string;
  icon?: string;
}

export interface AdminNavPreferencesView {
  favorites: string[];
  recent: DtoAdminNavRecentPage[];
}

export interface AdminNavFavoriteToggleArgs {
  href: string;
  label: string;
}
