import type { TemplateFormValues } from '@/domains/newsletters-admin/schemas/newsletters.schema';
import type { ModelsEmailTemplate } from '@/services/-admin-email-templates-get.schemas';
import type { DtoCreateEmailTemplateRequest } from '@/services/-admin-email-templates-post.schemas';

export function mapTemplateToFormValues(template: ModelsEmailTemplate): TemplateFormValues {
  return {
    name: template.name ?? '',
    slug: template.slug ?? '',
    subject: template.subject ?? '',
    body_html: template.body_html ?? '',
    status: (template.status as TemplateFormValues['status']) ?? 'draft'
  };
}

export function mapTemplateFormToPayload(
  values: TemplateFormValues
): DtoCreateEmailTemplateRequest {
  return {
    name: values.name,
    slug: values.slug,
    subject: values.subject,
    body_html: values.body_html,
    status: values.status
  };
}
