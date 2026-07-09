'use client';

import { IconLoader2 } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';

import { useAppForm } from '@/components/forms/useAppForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Flex } from '@/components/ui/flex';
import { Grid } from '@/components/ui/grid';
import { GridItem } from '@/components/ui/grid-item';
import {
  mapTemplateFormToPayload,
  mapTemplateToFormValues
} from '@/domains/newsletters-admin/lib/template-mapper';
import {
  templateDefaultValues,
  templateFormSchema
} from '@/domains/newsletters-admin/schemas/newsletters.schema';
import { useGetAdminEmailTemplatesId } from '@/services/-admin-email-templates-{id}-get';
import { usePutAdminEmailTemplatesId } from '@/services/-admin-email-templates-{id}-put';
import { getGetAdminEmailTemplatesQueryKey } from '@/services/-admin-email-templates-get';
import { usePostAdminEmailTemplates } from '@/services/-admin-email-templates-post';

interface TemplateFormProps {
  templateId?: string;
  isEdit?: boolean;
}

export function TemplateForm({ templateId, isEdit = false }: TemplateFormProps) {
  const { push } = useRouter();
  const queryClient = useQueryClient();

  const { data: templateResponse, isLoading } = useGetAdminEmailTemplatesId(Number(templateId), {
    query: { enabled: isEdit && Boolean(templateId) }
  });
  const template = templateResponse?.data?.template;

  const { mutateAsync: createTemplate, isPending: isCreating } = usePostAdminEmailTemplates();
  const { mutateAsync: updateTemplate, isPending: isUpdating } = usePutAdminEmailTemplatesId();

  const form = useAppForm({
    defaultValues: templateDefaultValues,
    validators: { onChange: templateFormSchema, onSubmit: templateFormSchema },
    onSubmit: async ({ value }) => {
      try {
        const payload = mapTemplateFormToPayload(value);
        if (isEdit && template?.id) {
          await updateTemplate({ id: template.id, data: payload });
          toast.success('Template updated');
        } else {
          await createTemplate({ data: payload });
          toast.success('Template created');
        }
        void queryClient.invalidateQueries({ queryKey: getGetAdminEmailTemplatesQueryKey() });
        push('/dashboard/marketing/templates');
      } catch (error) {
        toast.error('Failed to save template', {
          description: error instanceof Error ? error.message : 'Something went wrong'
        });
      }
    }
  });

  useEffect(() => {
    if (isEdit && template?.id) form.reset(mapTemplateToFormValues(template));
  }, [isEdit, template, form]);

  if (isEdit && isLoading) {
    return (
      <Card>
        <CardContent className='p-6'>Loading…</CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEdit ? 'Edit template' : 'New email template'}</CardTitle>
        <CardDescription>
          Reusable HTML layout for campaigns. Use simple placeholders like {'{{name}}'}.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form.AppForm>
          <Grid cols={1} gap={4} className='sm:grid-cols-2'>
            <GridItem>
              <form.AppField name='name' children={(field) => <field.TextField label='Name' />} />
            </GridItem>
            <GridItem>
              <form.AppField name='slug' children={(field) => <field.TextField label='Slug' />} />
            </GridItem>
            <GridItem className='md:col-span-2'>
              <form.AppField
                name='subject'
                children={(field) => <field.TextField label='Subject line' />}
              />
            </GridItem>
            <GridItem className='md:col-span-2'>
              <form.AppField
                name='body_html'
                children={(field) => (
                  <field.TextArea label='HTML body' placeholder='<p>Hello...</p>' rows={12} />
                )}
              />
            </GridItem>
            <GridItem>
              <form.AppField
                name='status'
                children={(field) => (
                  <field.Select
                    label='Status'
                    options={[
                      { label: 'Draft', value: 'draft' },
                      { label: 'Active', value: 'active' },
                      { label: 'Archived', value: 'archived' }
                    ]}
                  />
                )}
              />
            </GridItem>
          </Grid>
          <Flex justify='end' className='mt-6 gap-2'>
            <Button
              type='button'
              variant='outline'
              onClick={() => push('/dashboard/marketing/templates')}
            >
              Cancel
            </Button>
            <form.Subscribe selector={(s) => s.isSubmitting}>
              {(isSubmitting) => (
                <Button type='submit' disabled={isSubmitting || isCreating || isUpdating}>
                  {(isSubmitting || isCreating || isUpdating) && (
                    <IconLoader2 className='me-2 size-4 animate-spin' />
                  )}
                  {isEdit ? 'Save changes' : 'Create template'}
                </Button>
              )}
            </form.Subscribe>
          </Flex>
        </form.AppForm>
      </CardContent>
    </Card>
  );
}
