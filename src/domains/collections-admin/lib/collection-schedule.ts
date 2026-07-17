/** Schedule helpers for admin collections — DatePicker (YYYY-MM-DD) ↔ ISO and live status labels. */

export type CollectionScheduleStatus = 'always' | 'scheduled' | 'live' | 'upcoming' | 'expired';

const DATE_ONLY = /^(\d{4})-(\d{2})-(\d{2})$/;

function pad(part: number): string {
  return String(part).padStart(2, '0');
}

function formatDateOnly(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** Maps DatePicker `YYYY-MM-DD` (or ISO) to API RFC3339. End dates use end-of-day local. */
export function toScheduleISO(value: string | undefined, endOfDay = false): string | undefined {
  const trimmed = value?.trim();
  if (!trimmed) return undefined;

  const dateOnly = DATE_ONLY.exec(trimmed);
  if (dateOnly) {
    const year = Number(dateOnly[1]);
    const month = Number(dateOnly[2]);
    const day = Number(dateOnly[3]);
    const local = endOfDay
      ? new Date(year, month - 1, day, 23, 59, 59, 999)
      : new Date(year, month - 1, day, 0, 0, 0, 0);
    return local.toISOString();
  }

  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) return undefined;
  return parsed.toISOString();
}

/** Maps API ISO timestamps to DatePicker `YYYY-MM-DD` values. */
export function fromScheduleISO(iso: string | undefined): string {
  if (!iso) return '';
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return '';
  return formatDateOnly(parsed);
}

export function getCollectionScheduleStatus(
  startsAt?: string,
  endsAt?: string,
  now = Date.now()
): CollectionScheduleStatus {
  const startMs = startsAt ? new Date(startsAt).getTime() : NaN;
  const endMs = endsAt ? new Date(endsAt).getTime() : NaN;
  const hasStart = Number.isFinite(startMs);
  const hasEnd = Number.isFinite(endMs);

  if (!hasStart && !hasEnd) return 'always';
  if (hasStart && startMs > now) return 'upcoming';
  if (hasEnd && endMs < now) return 'expired';
  if (hasStart || hasEnd) return 'live';
  return 'scheduled';
}

export function formatScheduleStatusLabel(status: CollectionScheduleStatus): string {
  switch (status) {
    case 'always':
      return 'Always on';
    case 'upcoming':
      return 'Scheduled';
    case 'live':
      return 'Live now';
    case 'expired':
      return 'Expired';
    default:
      return 'Scheduled';
  }
}

export function parseProductIds(values: string[]): number[] {
  return values.map((value) => Number(value)).filter((id) => Number.isFinite(id) && id > 0);
}
