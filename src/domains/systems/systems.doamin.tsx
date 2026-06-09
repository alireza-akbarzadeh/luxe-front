'use client';

import { IconEye, IconPencil, IconPlus, IconTrash } from '@tabler/icons-react';
import {
  type ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable
} from '@tanstack/react-table';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

import { AppDialog } from '@/components/app-dialog';
import { Table } from '@/components/table/data-table';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAppForm } from '~/src/components/forms/useAppForm';

// --------------- Zod Schema ---------------
const settingFormSchema = z.object({
  key: z.string().min(1, 'Key is required'),
  description: z.string().optional(),
  value: z.string().refine(
    (val) => {
      try {
        JSON.parse(val);
        return true;
      } catch {
        return false;
      }
    },
    { message: 'Invalid JSON' }
  )
});

// --------------- Type & Mock Data ---------------
interface Setting {
  id: number;
  key: string;
  value: any;
  rawValue: string;
  description?: string;
  updatedAt: string;
}

const initialSettings: Setting[] = [
  {
    id: 1,
    key: 'site_name',
    value: { en: 'Luxe Shop', ar: 'لوكس شوب' },
    rawValue: JSON.stringify({ en: 'Luxe Shop', ar: 'لوكس شوب' }, null, 2),
    description: 'The public name of the store',
    updatedAt: '2026-06-01T10:30:00Z'
  },
  {
    id: 2,
    key: 'maintenance_mode',
    value: false,
    rawValue: 'false',
    description: 'Toggles site-wide maintenance page',
    updatedAt: '2026-06-02T08:00:00Z'
  },
  {
    id: 3,
    key: 'homepage_banner',
    value: {
      image_url: 'https://example.com/banner.jpg',
      link: '/sale',
      alt_text: 'Summer Sale'
    },
    rawValue: JSON.stringify(
      {
        image_url: 'https://example.com/banner.jpg',
        link: '/sale',
        alt_text: 'Summer Sale'
      },
      null,
      2
    ),
    description: 'Hero banner shown on the homepage',
    updatedAt: '2026-06-05T14:15:00Z'
  }
];

// --------------- Helpers ---------------
function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

function truncate(str: string, len: number) {
  return str.length > len ? str.slice(0, len) + '…' : str;
}

// --------------- Main Component ---------------
export default function SettingsPage() {
  const [data, setData] = useState<Setting[]>(initialSettings);
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<SortingState>([]);

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSetting, setEditingSetting] = useState<Setting | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Setting | null>(null);

  const [isPending, startTransition] = useTransition();

  // --------------- Form setup ---------------
  const form = useAppForm({
    defaultValues: {
      key: '',
      description: '',
      value: ''
    },
    validators: {
      onChange: settingFormSchema,
      onBlur: settingFormSchema
    },
    onSubmit: ({ value, formApi }) => {
      startTransition(() => {
        const parsed = JSON.parse(value.value); // already validated
        if (editingSetting) {
          setData((prev) =>
            prev.map((s) =>
              s.id === editingSetting.id
                ? {
                    ...s,
                    key: value.key,
                    description: value.description,
                    value: parsed,
                    rawValue: value.value,
                    updatedAt: new Date().toISOString()
                  }
                : s
            )
          );
          toast.success('Setting updated');
        } else {
          const newSetting: Setting = {
            id: Date.now(),
            key: value.key,
            value: parsed,
            rawValue: value.value,
            description: value.description,
            updatedAt: new Date().toISOString()
          };
          setData((prev) => [newSetting, ...prev]);
          toast.success('Setting created');
        }
        resetForm();
      });
    }
  });

  // --------------- Dialog helpers ---------------
  const resetForm = () => {
    form.reset();
    setEditingSetting(null);
    setDialogOpen(false);
  };

  const openCreateDialog = () => {
    setEditingSetting(null);
    form.reset();
    setDialogOpen(true);
  };

  const openEditDialog = (setting: Setting) => {
    setEditingSetting(setting);
    form.setFieldValue('key', setting.key);
    form.setFieldValue('description', setting.description ?? '');
    form.setFieldValue('value', setting.rawValue);
    setDialogOpen(true);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setData((prev) => prev.filter((s) => s.id !== deleteTarget.id));
    toast.success('Setting deleted');
    setDeleteTarget(null);
  };

  // --------------- Table columns ---------------
  const columns: ColumnDef<Setting>[] = [
    {
      accessorKey: 'key',
      header: 'Key',
      cell: ({ getValue }) => (
        <span className='font-mono text-sm font-medium'>{getValue<string>()}</span>
      )
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ getValue }) => {
        const desc = getValue<string | undefined>();
        return (
          <span className='text-muted-foreground text-xs'>{desc ? truncate(desc, 50) : '—'}</span>
        );
      }
    },
    {
      id: 'valuePreview',
      header: 'Value',
      cell: ({ row }) => {
        const str = JSON.stringify(row.original.value);
        return (
          <code className='bg-muted rounded px-1.5 py-0.5 text-[11px]'>{truncate(str, 40)}</code>
        );
      }
    },
    {
      accessorKey: 'updatedAt',
      header: 'Updated',
      cell: ({ getValue }) => (
        <span className='text-muted-foreground text-xs'>{formatDate(getValue<string>())}</span>
      )
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className='flex items-center justify-end gap-1'>
          <Button
            variant='ghost'
            size='icon'
            className='h-7 w-7'
            onClick={() => {
              toast(
                <pre className='max-h-80 overflow-auto text-xs'>
                  {JSON.stringify(row.original.value, null, 2)}
                </pre>,
                { duration: 5000 }
              );
            }}
          >
            <IconEye className='h-3.5 w-3.5' />
          </Button>
          <Button
            variant='ghost'
            size='icon'
            className='h-7 w-7'
            onClick={() => openEditDialog(row.original)}
          >
            <IconPencil className='h-3.5 w-3.5' />
          </Button>
          <Button
            variant='ghost'
            size='icon'
            className='text-destructive hover:bg-destructive/10 h-7 w-7'
            onClick={() => setDeleteTarget(row.original)}
          >
            <IconTrash className='h-3.5 w-3.5' />
          </Button>
        </div>
      )
    }
  ];

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
      sorting
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: (row, columnId, filterValue) => {
      const search = String(filterValue).toLowerCase();
      return (
        row.original.key.toLowerCase().includes(search) ||
        row.original.description?.toLowerCase().includes(search)
      );
    }
  });

  return (
    <div className='space-y-6 p-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold tracking-tight'>System Settings</h1>
        <Button onClick={openCreateDialog} size='sm' className='gap-2'>
          <IconPlus className='h-4 w-4' />
          Add Setting
        </Button>
      </div>

      <Table.Root table={table}>
        <div className='bg-muted/5 border-border/40 flex items-center gap-3 border-b px-6 py-4'>
          <div className='flex-1'>
            <Table.Search placeholder='Search by key or description…' />
          </div>
          <div className='text-muted-foreground text-xs font-medium'>
            {table.getFilteredRowModel().rows.length} settings
          </div>
        </div>
        <div className='p-2'>
          <Table.Body
            columnsCount={columns.length}
            onRowDoubleClick={(row) => openEditDialog(row.original)}
          />
        </div>
        <div className='border-border/40 border-t px-6 py-4'>
          <Table.Pagination />
        </div>
      </Table.Root>

      {/* --------------- Create/Edit Dialog --------------- */}
      <AppDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!open) resetForm();
          setDialogOpen(open);
        }}
        title={editingSetting ? 'Edit Setting' : 'Create Setting'}
        description='Settings are stored as JSON. Use valid JSON for the value.'
        component='sheet'
        side='right'
        className='w-full max-w-xl'
      >
        <form.AppForm>
          <form.Root
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
            className='space-y-4'
          >
            {/* Key Field */}
            <form.AppField name='key'>
              {(field) => (
                <field.TextField label='Key' placeholder='e.g. site_name' className='h-12' />
              )}
            </form.AppField>

            {/* Description Field */}
            <form.AppField name='description'>
              {(field) => (
                <field.TextField
                  label='Description (optional)'
                  placeholder='A short note about this setting'
                  className='h-12'
                />
              )}
            </form.AppField>

            {/* Value Field (JSON) - using Textarea component */}
            <form.AppField name='value'>{(field) => <field.JsonField />}</form.AppField>

            {/* Actions */}
            <div className='flex justify-end gap-2 pt-4'>
              <Button type='button' variant='outline' onClick={resetForm}>
                Cancel
              </Button>
              <form.Submit isPending={isPending} label={editingSetting ? 'Update' : 'Create'} />
            </div>
          </form.Root>
        </form.AppForm>
      </AppDialog>

      {/* --------------- Delete Confirmation --------------- */}
      <AppDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title='Delete Setting'
        description={`Are you sure you want to delete “${deleteTarget?.key}”? This cannot be undone.`}
      >
        <div className='flex justify-end gap-2 pt-4'>
          <Button variant='outline' onClick={() => setDeleteTarget(null)}>
            Cancel
          </Button>
          <Button variant='destructive' onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </AppDialog>
    </div>
  );
}
