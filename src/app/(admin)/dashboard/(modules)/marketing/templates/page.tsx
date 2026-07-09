import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import { TemplatesAdminDomain } from '@/domains/newsletters-admin/templates.admin.domain';

export default function TemplatesPage() {
  return (
    <Flex direction='column' className='gap-6'>
      <Flex direction='column' spacing={1}>
        <Typography.H2>Email templates</Typography.H2>
        <Typography.Muted>Reusable HTML layouts for campaigns.</Typography.Muted>
      </Flex>
      <TemplatesAdminDomain />
    </Flex>
  );
}
