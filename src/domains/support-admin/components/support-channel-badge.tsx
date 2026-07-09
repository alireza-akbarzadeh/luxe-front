import { IconMail, IconMessage, IconWorld } from '@tabler/icons-react';

import { Badge } from '@/components/ui/badge';
import { Flex } from '@/components/ui/flex';

const CHANNEL_ICONS = {
  email: IconMail,
  chat: IconMessage,
  web: IconWorld
} as const;

interface SupportChannelBadgeProps {
  channel?: string;
}

export function SupportChannelBadge({ channel }: SupportChannelBadgeProps) {
  const key = (channel ?? 'web') as keyof typeof CHANNEL_ICONS;
  const Icon = CHANNEL_ICONS[key] ?? IconWorld;
  const label = channel ? channel.charAt(0).toUpperCase() + channel.slice(1) : 'Web';

  return (
    <Badge variant='secondary' className='gap-1 font-normal'>
      <Flex align='center' className='gap-1'>
        <Icon className='size-3' aria-hidden />
        {label}
      </Flex>
    </Badge>
  );
}
