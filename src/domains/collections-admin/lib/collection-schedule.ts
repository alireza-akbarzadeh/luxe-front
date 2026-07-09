/** Schedule helpers for admin collections — datetime-local ↔ ISO and live status labels. */

export type CollectionScheduleStatus = 'always' | 'scheduled' | 'live' | 'upcoming' | 'expired';

export function toScheduleISO(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  if (!trimmed) return undefined;
  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) return undefined;
  return parsed.toISOString();
}

export function fromScheduleISO(iso: string | undefined): string {
  if (!iso) return '';
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return '';
  const pad = (part: number) => String(part).padStart(2, '0');
  return `${parsed.getFullYear()}-${pad(parsed.getMonth() + 1)}-${pad(parsed.getDate())}T${pad(parsed.getHours())}:${pad(parsed.getMinutes())}`;
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
