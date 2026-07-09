import { TemplateForm } from '@/domains/newsletters-admin/sections/template-form';

interface EditTemplatePageProps {
  params: Promise<{ templateId: string }>;
}

export default async function EditTemplatePage(props: EditTemplatePageProps) {
  const { templateId } = await props.params;
  return <TemplateForm isEdit templateId={templateId} />;
}
