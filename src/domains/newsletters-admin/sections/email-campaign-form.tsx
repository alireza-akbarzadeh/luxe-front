'use client';

import { IconLoader2, IconSend } from '@tabler/icons-react';
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
  mapEmailCampaignFormToPayload,
  mapEmailCampaignToFormValues
} from '@/domains/newsletters-admin/lib/email-campaign-mapper';
import {
  emailCampaignDefaultValues,
  emailCampaignFormSchema,
  SEGMENT_OPTIONS
} from '@/domains/newsletters-admin/schemas/newsletters.schema';
import { useGetAdminEmailCampaignsId } from '@/services/-admin-email-campaigns-{id}-get';
import { usePutAdminEmailCampaignsId } from '@/services/-admin-email-campaigns-{id}-put';
import { usePostAdminEmailCampaignsIdSend } from '@/services/-admin-email-campaigns-{id}-send-post';
import { getGetAdminEmailCampaignsQueryKey } from '@/services/-admin-email-campaigns-get';
import { usePostAdminEmailCampaigns } from '@/services/-admin-email-campaigns-post';

interface EmailCampaignFormProps {
  campaignId?: string;
  isEdit?: boolean;
}

export function EmailCampaignForm({ campaignId, isEdit = false }: EmailCampaignFormProps) {
  const { push } = useRouter();
  const queryClient = useQueryClient();

  const { data: campaignResponse, isLoading } = useGetAdminEmailCampaignsId(Number(campaignId), {
    query: { enabled: isEdit && Boolean(campaignId) }
  });
  const campaign = campaignResponse?.data?.campaign;

  const { mutateAsync: createCampaign, isPending: isCreating } = usePostAdminEmailCampaigns();
  const { mutateAsync: updateCampaign, isPending: isUpdating } = usePutAdminEmailCampaignsId();
  const { mutateAsync: sendCampaign, isPending: isSending } = usePostAdminEmailCampaignsIdSend();

  const form = useAppForm({
    defaultValues: emailCampaignDefaultValues,
    validators: { onChange: emailCampaignFormSchema, onSubmit: emailCampaignFormSchema },
    onSubmit: async ({ value }) => {
      try {
        const payload = mapEmailCampaignFormToPayload(value);
        if (isEdit && campaign?.id) {
          await updateCampaign({ id: campaign.id, data: payload });
          toast.success('Campaign updated');
        } else {
          await createCampaign({ data: payload });
          toast.success('Campaign created');
        }
        void queryClient.invalidateQueries({ queryKey: getGetAdminEmailCampaignsQueryKey() });
        push('/dashboard/marketing/campaigns');
      } catch (error) {
        toast.error('Failed to save campaign', {
          description: error instanceof Error ? error.message : 'Something went wrong'
        });
      }
    }
  });

  useEffect(() => {
    if (isEdit && campaign?.id) form.reset(mapEmailCampaignToFormValues(campaign));
  }, [isEdit, campaign, form]);

  const handleSendNow = async () => {
    if (!campaign?.id) return;
    if (!window.confirm('Send this campaign to the selected segment now?')) return;
    try {
      const result = await sendCampaign({ id: campaign.id });
      toast.success('Campaign sent', {
        description: `${result.data?.enqueued_count ?? 0} emails queued`
      });
      void queryClient.invalidateQueries({ queryKey: getGetAdminEmailCampaignsQueryKey() });
    } catch (error) {
      toast.error('Failed to send campaign', {
        description: error instanceof Error ? error.message : 'Something went wrong'
      });
    }
  };

  if (isEdit && isLoading) {
    return (
      <Card>
        <CardContent className='p-6'>Loading…</CardContent>
      </Card>
    );
  }

  const canSend = isEdit && campaign?.status !== 'sent' && campaign?.status !== 'sending';

  return (
    <Card>
      <CardHeader>
        <Flex justify='between' align='start' className='gap-4'>
          <div>
            <CardTitle>{isEdit ? 'Edit email campaign' : 'New email campaign'}</CardTitle>
            <CardDescription>
              Target a subscriber segment and send via the existing email job queue.
            </CardDescription>
          </div>
          {canSend ? (
            <Button variant='secondary' onClick={() => void handleSendNow()} disabled={isSending}>
              {isSending ? (
                <IconLoader2 className='me-2 size-4 animate-spin' />
              ) : (
                <IconSend className='me-2 size-4' />
              )}
              Send now
            </Button>
          ) : null}
        </Flex>
      </CardHeader>
      <CardContent>
        <form.AppForm>
          <Grid cols={1} gap={4} className='sm:grid-cols-2'>
            <GridItem>
              <form.AppField
                name='name'
                children={(field) => <field.TextField label='Campaign name' />}
              />
            </GridItem>
            <GridItem>
              <form.AppField
                name='segment'
                children={(field) => (
                  <field.Select label='Audience segment' options={[...SEGMENT_OPTIONS]} />
                )}
              />
            </GridItem>
            <GridItem className='md:col-span-2'>
              <form.AppField
                name='subject'
                children={(field) => <field.TextField label='Email subject' />}
              />
            </GridItem>
            <GridItem>
              <form.AppField
                name='template_id'
                children={(field) => (
                  <field.NumberField
                    label='Template ID (optional)'
                    placeholder='Leave empty to use body below'
                  />
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
                      { label: 'Scheduled', value: 'scheduled' }
                    ]}
                  />
                )}
              />
            </GridItem>
            <GridItem className='md:col-span-2'>
              <form.AppField
                name='scheduled_at'
                children={(field) => <field.DatePicker label='Schedule date' />}
              />
            </GridItem>
            <GridItem className='md:col-span-2'>
              <form.AppField
                name='body_html'
                children={(field) => (
                  <field.TextArea label='HTML body (optional if template linked)' rows={10} />
                )}
              />
            </GridItem>
          </Grid>
          <Flex justify='end' className='mt-6 gap-2'>
            <Button
              type='button'
              variant='outline'
              onClick={() => push('/dashboard/marketing/campaigns')}
            >
              Cancel
            </Button>
            <form.Subscribe selector={(s) => s.isSubmitting}>
              {(isSubmitting) => (
                <Button type='submit' disabled={isSubmitting || isCreating || isUpdating}>
                  {(isSubmitting || isCreating || isUpdating) && (
                    <IconLoader2 className='me-2 size-4 animate-spin' />
                  )}
                  {isEdit ? 'Save changes' : 'Create campaign'}
                </Button>
              )}
            </form.Subscribe>
          </Flex>
        </form.AppForm>
      </CardContent>
    </Card>
  );
}
