import { parseAsStringEnum, useQueryState } from 'nuqs';

import type { ReturnStatusFilter, ReturnTypeFilter } from '@/domains/returns-admin/returns.schema';
import { RETURN_STATUS_TABS, RETURN_TYPE_TABS } from '@/domains/returns-admin/returns.schema';

const STATUS_VALUES = RETURN_STATUS_TABS.map((tab) => tab.value);
const TYPE_VALUES = RETURN_TYPE_TABS.map((tab) => tab.value);

export function useReturnsQueryState() {
  const [status, setStatus] = useQueryState(
    'status',
    parseAsStringEnum<ReturnStatusFilter>([...STATUS_VALUES]).withDefault('all')
  );
  const [returnType, setReturnType] = useQueryState(
    'type',
    parseAsStringEnum<ReturnTypeFilter>([...TYPE_VALUES]).withDefault('all')
  );

  return { status, setStatus, returnType, setReturnType };
}
