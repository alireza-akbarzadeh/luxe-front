import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import { EmailCampaignsAdminDomain } from '@/domains/newsletters-admin/email-campaigns.admin.domain';

export default function EmailCampaignsPage() {
  return (
    <Flex direction='column' className='gap-6'>
      <Flex direction='column' spacing={1}>
        <Typography.H2>Email campaigns</Typography.H2>
        <Typography.Muted>
          Segmented sends — not merchandising campaigns under Promotions.
        </Typography.Muted>
      </Flex>
      <EmailCampaignsAdminDomain />
    </Flex>
  );
}
