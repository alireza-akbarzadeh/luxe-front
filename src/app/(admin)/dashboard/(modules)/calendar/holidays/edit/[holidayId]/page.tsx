import { HolidayForm } from '@/domains/store-calendar/sections/holiday-form';

export default async function EditCalendarHolidayPage({
  params
}: {
  params: Promise<{ holidayId: string }>;
}) {
  const { holidayId } = await params;

  return <HolidayForm isEdit holidayId={holidayId} />;
}
