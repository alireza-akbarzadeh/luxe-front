'use client';

import { IconChevronLeft, IconChevronRight, IconDownload, IconPlus, IconUpload } from '@tabler/icons-react';
import Link from 'next/link';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Typography } from '@/components/ui/typography';
import { StoreSelect } from '@/domains/store-calendar/components/store-select';
import type { useCalendarFilters } from '@/domains/store-calendar/hooks/use-calendar-filters';
import { monthLabel } from '@/domains/store-calendar/lib/calendar-format';

const REGION_OPTIONS = ['all', 'North', 'South', 'East', 'West', 'Central'] as const;
const STATUS_OPTIONS = [
  { label: 'All Status', value: 'all' },
  { label: 'Draft', value: 'draft' },
  { label: 'Published', value: 'published' }
] as const;

interface CalendarToolbarProps {
  filters: ReturnType<typeof useCalendarFilters>;
}

/** Title, filters, month navigator, search, and primary actions for the calendar dashboard. */
export function CalendarToolbar({ filters }: CalendarToolbarProps) {
  const notImplemented = (feature: string) => () =>
    toast.info(`${feature} is coming soon`, { description: 'This action is not wired up yet.' });

  return (
    <Flex direction='column' spacing={4}>
      <Flex direction='row' align='start' justify='between' wrap='wrap' spacing={3}>
        <Flex direction='column' spacing={1}>
          <Typography.H2>Store Calendar &amp; Delivery Planner</Typography.H2>
          <Typography.Muted>
            Manage store holidays, working hours, and delivery date rules across all locations
          </Typography.Muted>
        </Flex>

        <Flex direction='row' spacing={2} wrap='wrap'>
          <Button variant='outline' onClick={notImplemented('Import')}>
            <IconUpload className='size-4' />
            Import
          </Button>
          <Button variant='outline' onClick={notImplemented('Export')}>
            <IconDownload className='size-4' />
            Export
          </Button>
          <Button variant='outline' asChild>
            <Link href='/dashboard/calendar/schedules'>Create Working Schedule</Link>
          </Button>
          <Button asChild>
            <Link href='/dashboard/calendar/holidays/create'>
              <IconPlus className='size-4' />
              Create Holiday
            </Link>
          </Button>
        </Flex>
      </Flex>

      <Flex direction='row' align='center' spacing={3} wrap='wrap'>
        <Flex
          direction='row'
          align='center'
          spacing={1}
          className='rounded-md border bg-card px-1.5 py-1'
        >
          <Button
            variant='ghost'
            size='icon-xs'
            aria-label='Previous month'
            onClick={() => void filters.goToMonth(-1)}
          >
            <IconChevronLeft className='size-4' />
          </Button>
          <Typography.Text className='w-32 text-center text-sm font-medium'>
            {monthLabel(filters.year, filters.month)}
          </Typography.Text>
          <Button
            variant='ghost'
            size='icon-xs'
            aria-label='Next month'
            onClick={() => void filters.goToMonth(1)}
          >
            <IconChevronRight className='size-4' />
          </Button>
        </Flex>

        <Button variant='outline' size='sm' onClick={() => void filters.goToToday()}>
          Today
        </Button>

        <StoreSelect
          value={filters.storeId}
          onChange={(id) => void filters.setStoreId(id)}
          className='w-[180px]'
        />

        <Select
          value={filters.region ?? 'all'}
          onValueChange={(value) => void filters.setRegion(value === 'all' ? null : value)}
        >
          <SelectTrigger size='sm' className='w-[160px]' aria-label='Filter by region'>
            <SelectValue placeholder='All Regions' />
          </SelectTrigger>
          <SelectContent>
            {REGION_OPTIONS.map((region) => (
              <SelectItem key={region} value={region}>
                {region === 'all' ? 'All Regions' : region}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.status ?? 'all'}
          onValueChange={(value) => void filters.setStatus(value === 'all' ? null : value)}
        >
          <SelectTrigger size='sm' className='w-[150px]' aria-label='Filter by status'>
            <SelectValue placeholder='All Status' />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          value={filters.search}
          onChange={(event) => void filters.setSearch(event.target.value)}
          placeholder='Search holidays or stores…'
          className='w-[220px]'
          aria-label='Search calendar'
        />
      </Flex>
    </Flex>
  );
}
