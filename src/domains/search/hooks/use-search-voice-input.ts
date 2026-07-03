'use client';

import { useEffect, useRef } from 'react';

import { useSpeechRecognition } from '@/domains/shopping-assistant/hooks/use-speech-recognition';

type UseSearchVoiceInputOptions = {
  /** Start listening once (e.g. mobile bar mic opened the search sheet). */
  autoStart?: boolean;
  onAutoStartConsumed?: () => void;
};

/**
 * Voice-to-text for the search input — transcript lands in the query field, not the AI assistant.
 */
export function useSearchVoiceInput(
  inputValue: string,
  onInputChange: (value: string) => void,
  options: UseSearchVoiceInputOptions = {}
) {
  const { autoStart = false, onAutoStartConsumed } = options;
  const baseValueRef = useRef('');

  const appendFinalTranscript = (spoken: string) => {
    const base = baseValueRef.current.trim();
    onInputChange(base ? `${base} ${spoken}`.trim() : spoken.trim());
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
    onInputChange(base ? `${base} ${live}`.trim() : live);
  }, [speech.interimTranscript, speech.isListening, onInputChange]);

  useEffect(() => {
    if (!autoStart || !speech.isSupported) {
      return;
    }
    baseValueRef.current = inputValue;
    speech.startListening('push');
    onAutoStartConsumed?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- one-shot auto-start when sheet opens
  }, [autoStart, speech.isSupported, onAutoStartConsumed, speech.startListening]);

  const toggleVoiceSearch = () => {
    if (speech.isListening) {
      speech.stopListening();
      return;
    }
    baseValueRef.current = inputValue;
    speech.startListening('push');
  };

  return {
    ...speech,
    toggleVoiceSearch
  };
}
