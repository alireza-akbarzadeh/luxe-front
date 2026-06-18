import { WorkflowEditor } from '@/domains/workflows/containers/workflow-editor';

interface WorkflowEditorPageProps {
  params: Promise<{ workflowKey: string }>;
}

export default async function WorkflowEditorPage({ params }: WorkflowEditorPageProps) {
  const { workflowKey } = await params;
  return <WorkflowEditor workflowKey={workflowKey} />;
}
