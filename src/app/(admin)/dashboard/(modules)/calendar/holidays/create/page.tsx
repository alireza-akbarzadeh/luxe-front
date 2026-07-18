'use client';

import { useSearchParams } from 'next/navigation';

import { HolidayForm } from '@/domains/store-calendar/sections/holiday-form';

export default function CreateCalendarHolidayPage() {
  const searchParams = useSearchParams();
  const defaultDate = searchParams.get('date') ?? undefined;

  return <HolidayForm defaultDate={defaultDate} />;
}
