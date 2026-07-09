import { parseAsStringEnum, useQueryState } from 'nuqs';

import type {
  SupportChannelFilter,
  SupportStatusFilter
} from '@/domains/support-admin/schemas/support.schema';
import {
  SUPPORT_CHANNEL_TABS,
  SUPPORT_STATUS_TABS
} from '@/domains/support-admin/schemas/support.schema';

const STATUS_VALUES = SUPPORT_STATUS_TABS.map((tab) => tab.value);
const CHANNEL_VALUES = SUPPORT_CHANNEL_TABS.map((tab) => tab.value);

/** URL-synced filters for the admin support ticket table. */
export function useSupportQueryState() {
  const [status, setStatus] = useQueryState(
    'status',
    parseAsStringEnum<SupportStatusFilter>([...STATUS_VALUES]).withDefault('all')
  );
  const [channel, setChannel] = useQueryState(
    'channel',
    parseAsStringEnum<SupportChannelFilter>([...CHANNEL_VALUES]).withDefault('all')
  );

  return { status, setStatus, channel, setChannel };
}
