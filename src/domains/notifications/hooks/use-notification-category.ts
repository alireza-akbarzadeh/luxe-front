'use client';

import { parseAsStringLiteral, useQueryState } from 'nuqs';
import { useState } from 'react';

import {
  NOTIFICATION_CATEGORIES,
  type NotificationCategory,
  type NotificationReadFilter
} from '@/domains/notifications/lib/notification-categories';

export function useNotificationCategory() {
  const [category, setCategory] = useQueryState(
    'category',
    parseAsStringLiteral(NOTIFICATION_CATEGORIES).withDefault('all')
  );
  const [readFilter, setReadFilter] = useState<NotificationReadFilter>('all');

  const handleCategoryChange = (value: NotificationCategory) => {
    void setCategory(value);
  };

  return {
    category,
    setCategory: handleCategoryChange,
    readFilter,
    setReadFilter
  };
}
