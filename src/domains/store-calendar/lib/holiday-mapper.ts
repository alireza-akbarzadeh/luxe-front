import type { HolidayFormValues } from '@/domains/store-calendar/schemas/holiday-schema';
import type { DtoUpdateStoreHolidayRequest } from '@/services/-admin-calendar-holidays-{id}-put.schemas';
import type { DtoStoreHolidayResponse } from '@/services/-admin-calendar-holidays-get.schemas';
import type { DtoCreateStoreHolidayRequest } from '@/services/-admin-calendar-holidays-post.schemas';

function optionalText(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function optionalNumber(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function storeIdsFromForm(values: HolidayFormValues): number[] | undefined {
  if (values.apply_to !== 'stores' || !values.store_ids?.length) return undefined;
  return values.store_ids.map(Number).filter((id) => Number.isFinite(id));
}

/** Maps holiday form values to the create payload. */
export function mapFormToCreateHolidayRequest(
  values: HolidayFormValues
): DtoCreateStoreHolidayRequest {
  return {
    name: values.name.trim(),
    description: optionalText(values.description),
    holiday_type: values.holiday_type,
    start_date: values.start_date,
    end_date: values.end_date,
    is_recurring: values.is_recurring ?? false,
    recurrence_rule: values.is_recurring ? optionalText(values.recurrence_rule) : undefined,
    apply_to: values.apply_to,
    store_ids: storeIdsFromForm(values),
    vendor_id: values.apply_to === 'vendor' ? optionalNumber(values.vendor_id) : undefined,
    region: values.apply_to === 'region' ? optionalText(values.region) : undefined,
    priority: values.priority ?? undefined,
    notes: optionalText(values.notes),
    status: values.status
  };
}

/** Maps holiday form values to the update payload. */
export function mapFormToUpdateHolidayRequest(
  values: HolidayFormValues
): DtoUpdateStoreHolidayRequest {
  return { ...mapFormToCreateHolidayRequest(values) };
}

/** Maps an API holiday into edit-form values. */
export function mapHolidayToFormValues(holiday: DtoStoreHolidayResponse): HolidayFormValues {
  const holidayType = holiday.holiday_type;
  const validType =
    holidayType === 'national' ||
    holidayType === 'regional' ||
    holidayType === 'store' ||
    holidayType === 'vendor'
      ? holidayType
      : 'national';

  const applyTo = holiday.apply_to;
  const validApplyTo =
    applyTo === 'all' || applyTo === 'stores' || applyTo === 'vendor' || applyTo === 'region'
      ? applyTo
      : 'all';

  const status = holiday.status === 'published' ? 'published' : 'draft';

  return {
    name: holiday.name ?? '',
    description: holiday.description ?? '',
    holiday_type: validType,
    start_date: holiday.start_date ?? '',
    end_date: holiday.end_date ?? '',
    is_recurring: holiday.is_recurring ?? false,
    recurrence_rule: holiday.recurrence_rule ?? '',
    apply_to: validApplyTo,
    store_ids: (holiday.store_ids ?? []).map(String),
    vendor_id: holiday.vendor_id != null ? String(holiday.vendor_id) : '',
    region: holiday.region ?? '',
    priority: holiday.priority ?? null,
    notes: holiday.notes ?? '',
    status
  };
}
