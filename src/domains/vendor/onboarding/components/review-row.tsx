import { Flex } from '@/components/ui/flex';

export function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <Flex
      justify='between'
      align='start'
      className='border-border/40 border-b pb-3 text-sm last:border-0'
    >
      <span className='text-muted-foreground'>{label}</span>
      <span className='max-w-[60%] text-end font-medium'>{value || '—'}</span>
    </Flex>
  );
}
