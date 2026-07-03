'use client';

import { useLocale } from 'next-intl';
import { useEffect, useRef, useState } from 'react';

import type { Locale } from '@/i18n/config';

import { trackVoiceAssistantEvent } from '../lib/voice-assistant-analytics';

type SpeechRecognitionErrorCode =
  | 'no-speech'
  | 'aborted'
  | 'audio-capture'
  | 'network'
  | 'not-allowed'
  | 'service-not-allowed'
  | 'bad-grammar'
  | 'language-not-supported';

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: SpeechRecognitionErrorCode;
  message: string;
}

interface BrowserSpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onaudiostart: ((event: Event) => void) | null;
  onaudioend: ((event: Event) => void) | null;
  onend: ((event: Event) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onstart: ((event: Event) => void) | null;
}

type SpeechRecognitionCtor = new () => BrowserSpeechRecognition;

function localeToSpeechLang(locale: Locale): string {
  switch (locale) {
    case 'fa':
      return 'fa-IR';
    case 'es':
      return 'es-ES';
    default:
      return 'en-US';
  }
}

function getSpeechRecognitionCtor(): SpeechRecognitionCtor | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const win = window as Window & {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };

  return win.SpeechRecognition ?? win.webkitSpeechRecognition ?? null;
}

export type VoiceInputMode = 'push' | 'hold';

type UseSpeechRecognitionOptions = {
  /** Called when a listening session ends with finalized speech text. */
  onFinalTranscript?: (text: string) => void;
};

/**
 * Browser speech-to-text (Web Speech API).
 * Falls back gracefully when unsupported or permission is denied.
 */
export function useSpeechRecognition(options: UseSpeechRecognitionOptions = {}) {
  const onFinalTranscript = options.onFinalTranscript;
  const locale = useLocale() as Locale;
  const [isSupported] = useState(() => getSpeechRecognitionCtor() !== null);
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [permissionDenied, setPermissionDenied] = useState(false);
  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null);
  const startedAtRef = useRef<number | null>(null);
  const finalBufferRef = useRef('');

  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
      recognitionRef.current = null;
    };
  }, []);

  const stopListening = () => {
    recognitionRef.current?.stop();
  };

  const startListening = (mode: VoiceInputMode = 'push') => {
    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) {
      trackVoiceAssistantEvent('voice_unsupported');
      return;
    }

    recognitionRef.current?.abort();

    const recognition = new Ctor();
    recognition.lang = localeToSpeechLang(locale);
    recognition.continuous = mode === 'hold';
    recognition.interimResults = true;
    finalBufferRef.current = '';
    setInterimTranscript('');

    recognition.onstart = () => {
      startedAtRef.current = Date.now();
      setIsListening(true);
      setPermissionDenied(false);
      trackVoiceAssistantEvent('voice_started', { mode });
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = '';
      let finalText = finalBufferRef.current;

      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i];
        if (!result) {
          continue;
        }
        const chunk = result[0]?.transcript ?? '';
        if (result.isFinal) {
          finalText = `${finalText} ${chunk}`.trim();
        } else {
          interim = `${interim} ${chunk}`.trim();
        }
      }

      finalBufferRef.current = finalText;
      setInterimTranscript(finalText ? `${finalText} ${interim}`.trim() : interim);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        setPermissionDenied(true);
        trackVoiceAssistantEvent('voice_permission_denied');
      } else if (event.error !== 'aborted' && event.error !== 'no-speech') {
        trackVoiceAssistantEvent('voice_failed', { code: event.error });
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      const durationMs =
        startedAtRef.current != null ? Date.now() - startedAtRef.current : undefined;
      const text = finalBufferRef.current.trim();
      if (text) {
        onFinalTranscript?.(text);
        trackVoiceAssistantEvent('voice_completed', {
          durationMs: durationMs ?? 0,
          chars: text.length
        });
      }
      finalBufferRef.current = '';
      setInterimTranscript('');
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
    } catch {
      trackVoiceAssistantEvent('voice_failed', { code: 'start_exception' });
      setIsListening(false);
    }
  };

  const togglePushToTalk = () => {
    if (isListening) {
      stopListening();
      return;
    }
    startListening('push');
  };

  return {
    isSupported,
    isListening,
    interimTranscript,
    permissionDenied,
    startListening,
    stopListening,
    togglePushToTalk
  };
}
