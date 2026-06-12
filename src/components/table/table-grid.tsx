// table-body.tsx
import { flexRender, type Row } from '@tanstack/react-table';
import * as React from 'react';
import { toast } from 'sonner';

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger
} from '@/components/ui/context-menu';
import {
  Table,
  TableBody as UiTableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

import { useTableContext } from './table-context';

interface TableGridProps<TData> {
  columnsCount: number;
  onRowDoubleClick?: (row: Row<TData>) => void;
  onClick?: (row: Row<TData>) => void;
  getDetailsUrl?: (row: Row<TData>) => string;
  extendMenuActions?: (row: Row<TData>) => React.ReactNode;
}

export function TableGrid<TData>({
  columnsCount,
  onRowDoubleClick,
  onClick,
  getDetailsUrl,
  extendMenuActions
}: TableGridProps<TData>) {
  const { table } = useTableContext<TData>();
  const rows = table.getRowModel().rows;

  const [activeColumnId, setActiveColumnId] = React.useState<string | null>(null);

  const copyToClipboard = async (text: string, description: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${description} copied to clipboard`);
    } catch {
      toast.error('Failed to copy value');
    }
  };

  const density = table.options.meta?.density || 'normal';
  const cellPadding = {
    compact: 'py-1 px-2',
    normal: 'py-3 px-4',
    relaxed: 'py-5 px-6'
  }[density];

  return (
    <div className='border-border/40 bg-card/20 overflow-hidden overflow-x-auto border-x backdrop-blur-2xl'>
      <Table className='min-w-250'>
        <TableHeader className='bg-muted/50 [&_tr]:border-border/40'>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className='hover:bg-transparent'>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className={cn(
                    'text-muted-foreground h-auto p-5 text-[10px] font-black tracking-widest uppercase',
                    header.column.id === 'name' && 'bg-muted/50 sticky left-0 z-20'
                  )}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <UiTableBody className='[&_tr]:border-border/10'>
          {rows.length > 0 ? (
            rows.map((row) => {
              const isRowSelected = row.getIsSelected();

              const currentCell = row.getVisibleCells().find((c) => c.column.id === activeColumnId);
              const cellValue = currentCell ? String(currentCell.getValue() ?? '') : '';

              const rowElement = (
                <TableRow
                  data-state={isRowSelected ? 'selected' : undefined}
                  className={cn(
                    'hover:bg-primary/5 data-[state=selected]:bg-primary/5 cursor-pointer transition-colors'
                  )}
                  onDoubleClick={() => onRowDoubleClick?.(row)}
                  onClick={() => {
                    onClick?.(row);
                    row.toggleSelected(!row.getIsSelected());
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      onMouseDown={() => setActiveColumnId(cell.column.id)}
                      key={cell.id}
                      className={cn(
                        cellPadding,
                        'p-4 whitespace-normal',
                        cell.column.id === 'name' &&
                          'border-border/20 bg-card/40 sticky left-0 z-10 border-r backdrop-blur-md'
                      )}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              );

              return (
                <ContextMenu key={row.id}>
                  <ContextMenuTrigger asChild>{rowElement}</ContextMenuTrigger>
                  <ContextMenuContent className='w-56'>
                    {/* --- GLOBAL, REUSABLE ACTIONS --- */}
                    <div className='text-muted-foreground px-2 py-1.5 text-[10px] font-black tracking-wider uppercase opacity-70'>
                      Actions: {activeColumnId ? cellValue : 'Row'}
                    </div>
                    <ContextMenuSeparator />

                    <ContextMenuItem
                      disabled={!activeColumnId || !cellValue}
                      onClick={() => copyToClipboard(cellValue, `${cellValue} value`)}
                    >
                      Copy Cell Value
                      <ContextMenuShortcut>⌘C</ContextMenuShortcut>
                    </ContextMenuItem>

                    <ContextMenuItem
                      onClick={() =>
                        copyToClipboard(JSON.stringify(row.original, null, 2), 'Row data object')
                      }
                    >
                      Copy Full Row (JSON)
                    </ContextMenuItem>

                    <ContextMenuSeparator />

                    {/* Standardized selection toggles */}
                    <ContextMenuItem
                      onClick={() => row.toggleSelected(!isRowSelected)}
                      className={
                        isRowSelected
                          ? 'text-amber-600 focus:bg-amber-50 focus:text-amber-600 dark:focus:bg-amber-950/20'
                          : ''
                      }
                    >
                      {isRowSelected ? 'Deselect Row' : 'Select Row'}
                    </ContextMenuItem>

                    {getDetailsUrl && (
                      <ContextMenuItem onClick={() => window.open(getDetailsUrl(row), '_blank')}>
                        View Details
                      </ContextMenuItem>
                    )}

                    {extendMenuActions && (
                      <>
                        <ContextMenuSeparator />
                        {extendMenuActions(row)}
                      </>
                    )}
                  </ContextMenuContent>
                </ContextMenu>
              );
            })
          ) : (
            <TableRow className='hover:bg-transparent'>
              <TableCell
                colSpan={columnsCount}
                className='text-muted-foreground h-48 text-center italic'
              >
                No results found
              </TableCell>
            </TableRow>
          )}
        </UiTableBody>
      </Table>
    </div>
  );
}
