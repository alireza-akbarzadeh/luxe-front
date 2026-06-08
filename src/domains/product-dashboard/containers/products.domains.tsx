'use client';
import { IconPlus } from '@tabler/icons-react';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Table } from '~/src/components/table/data-table';
import { productColumns } from '~/src/domains/product-dashboard/sections/product-columns';
import { useGetProducts } from '~/src/services/-products-get';
import type { DtoProductWithLike } from '~/src/services/-products-get.schemas';

export function ProductsDomains() {
  const { data, isLoading } = useGetProducts();
  const { push } = useRouter();
  const table = useReactTable({
    data: data?.data?.products ?? [],
    columns: productColumns,
    getCoreRowModel: getCoreRowModel()
  });

  return (
    <>
      <Flex direction='row' justify='between'>
        Products
        <Button asChild>
          <Link href='/dashboard/products/create'>
            <IconPlus />
            New Product
          </Link>
        </Button>
      </Flex>
      <Table.Root table={table}>
        {isLoading ? (
          <Table.Loading columnsCount={8} rowsCount={10} />
        ) : (
          <Table.Body<DtoProductWithLike>
            onRowDoubleClick={(row) => push(`/dashboard/products/edit/${row.original.id}`)}
            columnsCount={8}
          />
        )}

        <div className='border-border/40 border-t px-6 py-4'>
          <Table.Pagination />
        </div>
      </Table.Root>
    </>
  );
}
