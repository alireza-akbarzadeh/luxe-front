import { PrivacyRuleForm } from '@/domains/privacy-rules/sections/privacy-rule-form';

interface EditPrivacyRulePageProps {
  params: Promise<{ ruleId: string }>;
}

export default async function EditPrivacyRulePage({ params }: EditPrivacyRulePageProps) {
  const { ruleId } = await params;
  return <PrivacyRuleForm isEdit ruleId={ruleId} />;
}
