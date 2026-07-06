'use client';

import { useEffect, useRef } from 'react';

import { useSpeechRecognition } from '@/domains/shopping-assistant/hooks/use-speech-recognition';

type UseVoiceChatInputOptions = {
  value: string;
  onChange: (value: string) => void;
  autoStart?: boolean;
  onAutoStartConsumed?: () => void;
};

/**
 * Voice-to-text for AI chat composers — appends speech into the message field.
 */
export function useVoiceChatInput({
  value,
  onChange,
  autoStart = false,
  onAutoStartConsumed
}: UseVoiceChatInputOptions) {
  const baseValueRef = useRef('');

  const appendFinalTranscript = (spoken: string) => {
    const base = baseValueRef.current.trim();
    onChange(base ? `${base} ${spoken}`.trim() : spoken.trim());
    baseValueRef.current = '';
  };

  const speech = useSpeechRecognition({ onFinalTranscript: appendFinalTranscript });

  useEffect(() => {
    if (!speech.isListening) {
      return;
    }
    const base = baseValueRef.current.trim();
    const live = speech.interimTranscript.trim();
    if (!live) {
      return;
    }
    onChange(base ? `${base} ${live}`.trim() : live);
  }, [speech.interimTranscript, speech.isListening, onChange]);

  useEffect(() => {
    if (!autoStart || !speech.isSupported) {
      return;
    }
    baseValueRef.current = value;
    speech.startListening('push');
    onAutoStartConsumed?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- one-shot auto-start
  }, [autoStart, speech.isSupported, onAutoStartConsumed, speech.startListening]);

  const toggleVoice = () => {
    if (speech.isListening) {
      speech.stopListening();
      return;
    }
    baseValueRef.current = value;
    speech.startListening('push');
  };

  const startHoldToTalk = () => {
    baseValueRef.current = value;
    speech.startListening('hold');
  };

  const stopHoldToTalk = () => {
    if (speech.isListening) {
      speech.stopListening();
    }
  };

  return {
    ...speech,
    toggleVoice,
    startHoldToTalk,
    stopHoldToTalk
  };
}
