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
import { cn } from '@/lib/utils';

import { useTableContext } from './table-context';

interface TableBodyProps<TData> {
  columnsCount: number;
  onRowDoubleClick?: (row: Row<TData>) => void;
  onClick?: (row: Row<TData>) => void;
  getDetailsUrl?: (row: Row<TData>) => string;
  extendMenuActions?: (row: Row<TData>) => React.ReactNode;
}

export function TableBody<TData>({
  columnsCount,
  onRowDoubleClick,
  onClick,
  getDetailsUrl,
  extendMenuActions
}: TableBodyProps<TData>) {
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

  return (
    <div className='border-border/40 bg-card/20 overflow-hidden overflow-x-auto rounded-4xl border backdrop-blur-2xl'>
      <table className='w-full min-w-250 text-sm'>
        <thead className='bg-muted/50 border-border/40 border-b'>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className={cn(
                    'text-muted-foreground p-5 text-left text-[10px] font-black tracking-widest uppercase',
                    header.column.id === 'name' && 'bg-muted/50 sticky left-0 z-20'
                  )}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className='divide-border/10 divide-y'>
          {rows.length > 0 ? (
            rows.map((row) => {
              const isRowSelected = row.getIsSelected();

              const currentCell = row.getVisibleCells().find((c) => c.column.id === activeColumnId);
              const cellValue = currentCell ? String(currentCell.getValue() ?? '') : '';

              const rowElement = (
                <tr
                  className='hover:bg-primary/3 data-[state=open]:bg-primary/5 cursor-pointer transition-colors'
                  onDoubleClick={() => onRowDoubleClick?.(row)}
                  onClick={() => {
                    onClick?.(row);
                    row.toggleSelected(!row.getIsSelected());
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      onMouseDown={() => setActiveColumnId(cell.column.id)}
                      key={cell.id}
                      className={cn(
                        'p-4',
                        cell.column.id === 'name' &&
                          'border-border/20 sticky left-0 z-10 border-r backdrop-blur-md'
                      )}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
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
                      <ContextMenuItem>
                        <a
                          href={getDetailsUrl(row)}
                          target='_blank'
                          rel='noreferrer noopener'
                          className='w-full cursor-pointer'
                        >
                          View Details
                        </a>
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
            <tr>
              <td colSpan={columnsCount} className='text-muted-foreground h-48 text-center italic'>
                No results found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
