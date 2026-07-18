'use client';

import { Badge } from '@/components/ui/badge';
import { Flex } from '@/components/ui/flex';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Typography } from '@/components/ui/typography';

import type { ExcelImportColumn } from './excel-import.types';

type ExcelColumnGuideProps = {
  columns: ExcelImportColumn[];
  note?: string;
};

/** Compact expected-column reference shown before upload. */
export function ExcelColumnGuide({
  columns,
  note = 'Gold headers in the template are required.'
}: ExcelColumnGuideProps) {
  return (
    <div className='border-border overflow-hidden rounded-lg border'>
      <Flex
        direction='row'
        justify='between'
        align='center'
        className='bg-muted/40 border-b px-3 py-2'
      >
        <Typography.Text className='text-sm font-medium'>Template columns</Typography.Text>
        <Typography.Muted className='text-xs'>{note}</Typography.Muted>
      </Flex>
      <div className='max-h-44 overflow-y-auto overscroll-contain'>
        <Table>
          <TableHeader className='bg-muted/30 text-muted-foreground sticky top-0 z-10 text-xs uppercase backdrop-blur-sm'>
            <TableRow className='hover:bg-transparent'>
              <TableHead className='px-3'>Column</TableHead>
              <TableHead className='px-3'>Need</TableHead>
              <TableHead className='px-3'>Notes</TableHead>
              <TableHead className='px-3'>Example</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {columns.map((column) => (
              <TableRow key={column.key} className='align-top'>
                <TableCell className='px-3 font-mono text-xs'>{column.key}</TableCell>
                <TableCell className='px-3'>
                  <Badge variant={column.required ? 'default' : 'outline'}>
                    {column.required ? 'required' : 'optional'}
                  </Badge>
                </TableCell>
                <TableCell className='text-muted-foreground px-3 text-xs whitespace-normal'>
                  {column.description ?? '—'}
                </TableCell>
                <TableCell className='text-muted-foreground px-3 font-mono text-xs'>
                  {column.example ?? '—'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
