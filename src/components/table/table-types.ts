import type { Row } from '@tanstack/react-table';
import type { ReactNode } from 'react';

interface StatusOption {
  label: string;
  value?: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

interface SearchProps {
  columnId: string;
  placeholder: string;
}

interface FilterTabsProps {
  columnId: string;
  options: string[];
}

interface StatusFiltersProps {
  columnId: string;
  options: StatusOption[];
  title?: string;
}

interface BodyProps<TData> {
  columnsCount: number;
  onRowDoubleClick?: (row: Row<TData>) => void;
  onClick?: (row: Row<TData>) => void;
}
interface BulkActionsProps<TData> {
  onDelete?: (rows: Row<TData>[]) => void;
  onDownload?: (rows: Row<TData>[]) => void;
  deleteTitle?: string;
  deleteDescription?: string;
}

// ---------- Main TableToolbar Component (Enhanced) ----------

interface BaseTableToolbarProps {
  searchPlaceholder?: string;
  isLoading?: boolean;
  showSearch?: boolean;
  children?: ReactNode;

  showColumnVisibility?: boolean;
  showSorting?: boolean;
  showExport?: boolean;
  showBulkActions?: boolean;
  /** Hide column visibility, sorting, export, and row count on mobile/tablet. Default true. */
  compactOnMobile?: boolean;
  onDelete?: () => void;
}

interface WithRefresh {
  showRefresh: true;
  onRefresh: () => void;
}
interface WithoutRefresh {
  showRefresh?: false;
  onRefresh?: never;
}

interface WithCreate {
  showCreate: true;
  onCreate: () => void;
}
interface WithoutCreate {
  showCreate?: false;
  onCreate?: never;
}

interface WithClear {
  showClear: true;
  onClearFilter?: () => void;
}
interface WithoutClear {
  showClear?: false;
  onClearFilter?: never;
}

type TableToolbarProps = BaseTableToolbarProps &
  (WithRefresh | WithoutRefresh) &
  (WithCreate | WithoutCreate) &
  (WithClear | WithoutClear);

export type {
  BodyProps,
  BulkActionsProps,
  FilterTabsProps,
  SearchProps,
  StatusFiltersProps,
  StatusOption,
  TableToolbarProps
};
