import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import { VoiceWaveform } from '@/domains/shopping-assistant/components/voice-waveform';

export function FlexVoiceStatus({ label }: { label: string }) {
  return (
    <Flex
      direction='row'
      align='center'
      justify='center'
      spacing={2}
      className='bg-accent/5 rounded-xl px-3 py-2'
      role='status'
      aria-live='polite'
    >
      <VoiceWaveform active compact barClassName='bg-accent' />
      <Typography.Small className='text-accent font-medium'>{label}</Typography.Small>
    </Flex>
  );
}
