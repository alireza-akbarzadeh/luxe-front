'use client';

import { IconFilter } from '@tabler/icons-react';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  CUSTOMER_SEGMENT_OPTIONS,
  type CustomerSegment
} from '@/domains/customers-admin/lib/customer-segments';

const ALL_SEGMENTS_VALUE = 'all';

interface CustomerSegmentPickerProps {
  value: CustomerSegment;
  onSelect: (segment: CustomerSegment) => void;
}

function toSelectValue(segment: CustomerSegment): string {
  return segment || ALL_SEGMENTS_VALUE;
}

function fromSelectValue(value: string): CustomerSegment {
  return value === ALL_SEGMENTS_VALUE ? '' : (value as CustomerSegment);
}

/** CRM segment filter — Select on desktop, bottom drawer on mobile. */
export function CustomerSegmentPicker({ value, onSelect }: CustomerSegmentPickerProps) {
  return (
    <Select value={toSelectValue(value)} onValueChange={(next) => onSelect(fromSelectValue(next))}>
      <SelectTrigger
        size='sm'
        className='border-border/60 h-10 min-w-40 gap-2 rounded-xl border-dashed text-[10px] font-bold uppercase'
      >
        <IconFilter className='text-primary h-3.5 w-3.5 shrink-0' />
        <SelectValue placeholder='All segments' />
      </SelectTrigger>
      <SelectContent className='rounded-xl'>
        <SelectGroup>
          <SelectLabel>Segment</SelectLabel>
          {CUSTOMER_SEGMENT_OPTIONS.map((option) => (
            <SelectItem
              key={option.id || ALL_SEGMENTS_VALUE}
              value={toSelectValue(option.id)}
              className={`text-[10px] font-bold uppercase ${option.className ?? ''}`}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
