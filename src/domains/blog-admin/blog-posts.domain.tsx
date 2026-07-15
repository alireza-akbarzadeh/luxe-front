'use client';

import { IconPencil, IconTrash } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { toast } from 'sonner';

import type { TableState } from '@/components/table/data-table';
import { Table, useServerTable } from '@/components/table/data-table';
import { DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Flex } from '@/components/ui/flex';
import { Text } from '@/components/ui/typography';
import {
  getBlogPostsFromListResponse,
  getBlogPostsTotalFromListResponse
} from '@/domains/blog-admin/lib/blog-post-list';
import { blogPostColumns } from '@/domains/blog-admin/sections/blog-post-columns';
import { useMediaDevices } from '@/hooks/useMediaDevices';
import { deleteAdminBlogPostsId } from '@/services/-admin-blog-posts-{id}-delete';
import {
  getGetAdminBlogPostsQueryKey,
  useGetAdminBlogPosts
} from '@/services/-admin-blog-posts-get';
import type {
  DtoBlogListResponse,
  DtoBlogPostListItem
} from '@/services/-admin-blog-posts-get.schemas';

export function BlogPostsDomain() {
  const { push } = useRouter();
  const queryClient = useQueryClient();
  const { isDesktop } = useMediaDevices();

  const getQueryParams = useCallback(
    (state: TableState, filter: string) => ({
      limit: state.pagination.pageSize,
      page: state.pagination.pageIndex + 1,
      search: filter || undefined
    }),
    []
  );

  const getRows = useCallback(
    (data: DtoBlogListResponse | undefined) => getBlogPostsFromListResponse(data),
    []
  );

  const getTotal = useCallback(
    (data: DtoBlogListResponse | undefined) => getBlogPostsTotalFromListResponse(data),
    []
  );

  const serverTable = useServerTable({
    columns: blogPostColumns,
    initialPageSize: 15,
    getQueryParams,
    getRows,
    getTotal,
    useQuery: useGetAdminBlogPosts
  });

  const handleDeletePost = useCallback(
    async (post: DtoBlogPostListItem) => {
      if (!post.id) return;

      const confirmed = window.confirm(`Delete article "${post.title ?? 'this post'}"?`);
      if (!confirmed) return;

      try {
        await deleteAdminBlogPostsId(post.id);
        void queryClient.invalidateQueries({ queryKey: getGetAdminBlogPostsQueryKey() });
        toast.success('Post deleted');
      } catch (error) {
        toast.error('Failed to delete post', {
          description: error instanceof Error ? error.message : 'Something went wrong'
        });
      }
    },
    [queryClient]
  );

  const handleBulkDelete = useCallback(async () => {
    const ids = Object.entries(serverTable.tableState.rowSelection)
      .filter(([, selected]) => selected)
      .map(([id]) => Number(id))
      .filter((id) => Number.isFinite(id));

    if (ids.length === 0) {
      toast.error('Select at least one post');
      return;
    }

    const confirmed = window.confirm(`Delete ${ids.length} selected post(s)?`);
    if (!confirmed) return;

    try {
      await Promise.all(ids.map((id) => deleteAdminBlogPostsId(id)));
      void queryClient.invalidateQueries({ queryKey: getGetAdminBlogPostsQueryKey() });
      serverTable.tableState.resetRowSelection();
      toast.success('Selected posts deleted');
    } catch (error) {
      toast.error('Failed to delete selected posts', {
        description: error instanceof Error ? error.message : 'Something went wrong'
      });
    }
  }, [queryClient, serverTable.tableState]);

  return (
    <Table.Root {...serverTable.rootProps}>
      <Table.Toolbar
        searchPlaceholder='Search by title or slug'
        showRefresh
        onRefresh={serverTable.refetch}
        isLoading={serverTable.isFetching}
        showCreate
        onCreate={() => push('/dashboard/blog/create')}
        showClear
        showColumnVisibility={isDesktop}
        showBulkActions={isDesktop}
        onDelete={isDesktop ? handleBulkDelete : undefined}
      />

      {!isDesktop ? (
        <Flex
          direction='row'
          align='center'
          justify='between'
          className='border-border/40 bg-background/50 border-b px-4 py-3'
        >
          <Text variant='muted' className='text-[10px] font-bold tracking-widest uppercase'>
            {serverTable.total.toLocaleString()} posts
          </Text>
          <Text variant='muted' className='text-[10px]'>
            Tap to edit
          </Text>
        </Flex>
      ) : null}

      {isDesktop ? (
        <Table.Grid<DtoBlogPostListItem>
          isLoading={serverTable.isLoading && serverTable.rows.length === 0}
          onRowDoubleClick={(row) => {
            const id = row.original.id;
            if (id) push(`/dashboard/blog/edit/${id}`);
          }}
          extendMenuActions={(row) => (
            <>
              <DropdownMenuItem
                className='gap-2 text-[11px] font-semibold'
                onClick={() => push(`/dashboard/blog/edit/${row.original.id}`)}
              >
                <IconPencil className='size-3.5' />
                Edit post
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className='text-destructive gap-2 text-[11px] font-semibold'
                onClick={() => void handleDeletePost(row.original)}
              >
                <IconTrash className='size-3.5' />
                Delete post
              </DropdownMenuItem>
            </>
          )}
        />
      ) : (
        <Table.MobileList<DtoBlogPostListItem>
          isLoading={serverTable.isLoading && serverTable.rows.length === 0}
          renderCard={(row) => (
            <Flex direction='column' spacing={1} className='p-4'>
              <Text className='font-medium'>{row.original.title || 'Untitled'}</Text>
              <Text variant='muted' className='text-xs'>
                {row.original.status || 'draft'} · {row.original.section_type || 'article'}
              </Text>
            </Flex>
          )}
          onCardClick={(row) => {
            const id = row.original.id;
            if (id) push(`/dashboard/blog/edit/${id}`);
          }}
        />
      )}

      <Table.Pagination />
    </Table.Root>
  );
}
