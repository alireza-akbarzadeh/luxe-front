import { ICON_MAP } from '@/domains/admin/data';

export const MENU_ICON_OPTIONS = Object.keys(ICON_MAP).map((key) => ({
  label: key,
  value: key
}));
