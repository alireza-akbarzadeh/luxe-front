import {
  parseAsString,
  parseAsInteger,
  parseAsFloat,
  parseAsBoolean,
  parseAsStringEnum,
  parseAsArrayOf
} from 'nuqs';

import type { SortKey, ViewMode } from '@/domains/store/store.types';

const SORT_VALUES: SortKey[] = [
  'popular',
  'top_rated',
  'most_followed',
  'recently_joined',
  'name_asc'
];
const VIEW_VALUES: ViewMode[] = ['grid', 'compact', 'list'];
export const storeFiltersParsers = {
  search: parseAsString.withDefault(''),
  category: parseAsArrayOf(parseAsString).withDefault([]),
  rating: parseAsFloat.withDefault(0),
  verified: parseAsBoolean.withDefault(false),
  location: parseAsString.withDefault(''),
  shippingSpeed: parseAsString.withDefault('any'),
  freeShipping: parseAsBoolean.withDefault(false),
  newOnly: parseAsBoolean.withDefault(false),
  followersMin: parseAsInteger.withDefault(0),
  storeSize: parseAsString.withDefault('any'),
  sort: parseAsStringEnum<SortKey>(SORT_VALUES).withDefault('popular'),
  view: parseAsStringEnum<ViewMode>(VIEW_VALUES).withDefault('grid'),
  page: parseAsInteger.withDefault(1)
};
export type StoreFiltersState = {
  [K in keyof typeof storeFiltersParsers]: ReturnType<
    (typeof storeFiltersParsers)[K]['parseServerSide']
  >;
};
