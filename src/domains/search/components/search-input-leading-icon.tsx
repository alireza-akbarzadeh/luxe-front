'use client';

import { IconLoader2, IconSearch } from '@tabler/icons-react';

import { VoiceWaveform } from '@/domains/shopping-assistant/components/voice-waveform';

type SearchInputLeadingIconProps = {
  isLoading: boolean;
  isListening: boolean;
};

/** Left icon in search field — spinner, voice waveform, or search glyph. */
export function SearchInputLeadingIcon({ isLoading, isListening }: SearchInputLeadingIconProps) {
  if (isLoading) {
    return <IconLoader2 className='text-muted-foreground h-5 w-5 animate-spin' />;
  }
  if (isListening) {
    return <VoiceWaveform active compact className='h-5' />;
  }
  return <IconSearch className='text-muted-foreground h-5 w-5' />;
}
