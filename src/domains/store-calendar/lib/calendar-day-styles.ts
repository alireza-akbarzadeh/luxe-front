/**
 * Maps the backend `day_type` string to display styling.
 * Assumed values (not enumerated in the OpenAPI schema): working, weekend,
 * holiday, vendor_closed, special_working (or special), maintenance.
 * Unknown values fall back to the neutral "working" look.
 */
export interface DayTypeStyle {
  key: string;
  label: string;
  dot: string;
  badge: string;
  ring: string;
}

const DAY_TYPE_STYLES: Record<string, DayTypeStyle> = {
  working: {
    key: 'working',
    label: 'Working day',
    dot: 'bg-emerald-500',
    badge: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    ring: 'ring-emerald-500/40'
  },
  weekend: {
    key: 'weekend',
    label: 'Weekend',
    dot: 'bg-muted-foreground/50',
    badge: 'border-border bg-muted text-muted-foreground',
    ring: 'ring-border'
  },
  holiday: {
    key: 'holiday',
    label: 'Holiday',
    dot: 'bg-rose-500',
    badge: 'border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400',
    ring: 'ring-rose-500/40'
  },
  vendor_closed: {
    key: 'vendor_closed',
    label: 'Vendor closed',
    dot: 'bg-amber-500',
    badge: 'border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400',
    ring: 'ring-amber-500/40'
  },
  special_working: {
    key: 'special_working',
    label: 'Special working',
    dot: 'bg-sky-500',
    badge: 'border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-400',
    ring: 'ring-sky-500/40'
  },
  special: {
    key: 'special',
    label: 'Special working',
    dot: 'bg-sky-500',
    badge: 'border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-400',
    ring: 'ring-sky-500/40'
  },
  maintenance: {
    key: 'maintenance',
    label: 'Maintenance',
    dot: 'bg-violet-500',
    badge: 'border-violet-500/30 bg-violet-500/10 text-violet-600 dark:text-violet-400',
    ring: 'ring-violet-500/40'
  }
};

const FALLBACK_STYLE: DayTypeStyle = DAY_TYPE_STYLES['working']!;

export function getDayTypeStyle(dayType: string | undefined | null): DayTypeStyle {
  if (!dayType) return FALLBACK_STYLE;
  return DAY_TYPE_STYLES[dayType] ?? FALLBACK_STYLE;
}

/** Legend entries shown alongside the calendar grid. */
export const CALENDAR_LEGEND: DayTypeStyle[] = [
  DAY_TYPE_STYLES['working']!,
  DAY_TYPE_STYLES['weekend']!,
  DAY_TYPE_STYLES['holiday']!,
  DAY_TYPE_STYLES['vendor_closed']!,
  DAY_TYPE_STYLES['special_working']!,
  DAY_TYPE_STYLES['maintenance']!
];
