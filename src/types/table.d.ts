import '@tanstack/react-table';

declare module '@tanstack/react-table' {
  interface FilterFns {
    multiSelect: FilterFn<unknown>;
    fuzzy: FilterFn<unknown>;
    dateRange: FilterFn<unknown>;
  }
}
