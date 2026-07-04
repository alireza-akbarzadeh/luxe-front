'use client';

import { IconMicrophone, IconMicrophoneOff, IconSquare } from '@tabler/icons-react';
import type { ComponentProps } from 'react';
import {
  forwardRef,
  useCallback,
  useEffect,
  useEffectEvent,
  useImperativeHandle,
  useRef,
  useState
} from 'react';

import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';

interface BrowserSpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  addEventListener(type: 'start' | 'end' | 'result' | 'error', listener: EventListener): void;
  removeEventListener(type: 'start' | 'end' | 'result' | 'error', listener: EventListener): void;
}

interface BrowserSpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface BrowserSpeechRecognitionErrorEvent extends Event {
  error: string;
}

type SpeechRecognitionCtor = new () => BrowserSpeechRecognition;

function getSpeechRecognitionCtor(): SpeechRecognitionCtor | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const win = window as unknown as Window & {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };

  return win.SpeechRecognition ?? win.webkitSpeechRecognition ?? null;
}

type SpeechInputMode = 'speech-recognition' | 'media-recorder' | 'none';

export function detectSpeechInputMode(): SpeechInputMode {
  if (getSpeechRecognitionCtor()) {
    return 'speech-recognition';
  }

  if (typeof window !== 'undefined' && 'MediaRecorder' in window && 'mediaDevices' in navigator) {
    return 'media-recorder';
  }

  return 'none';
}

export type SpeechInputHandle = {
  start: () => void;
  stop: () => void;
  toggle: () => void;
};

export type SpeechInputProps = Omit<ComponentProps<typeof Button>, 'onClick'> & {
  onTranscriptionChange?: (text: string) => void;
  /** Live partial transcript while the user is still speaking. */
  onInterimTranscriptionChange?: (text: string) => void;
  onListeningChange?: (listening: boolean) => void;
  onPermissionDenied?: () => void;
  /**
   * Callback for when audio is recorded using MediaRecorder fallback.
   * Return transcribed text — passed to onTranscriptionChange.
   */
  onAudioRecorded?: (audioBlob: Blob) => Promise<string>;
  lang?: string;
  /** Search bar: accent styling instead of destructive red while listening. */
  tone?: 'default' | 'search';
  /** Start listening once on mount (e.g. mobile search opened via mic). */
  autoStart?: boolean;
  onAutoStartConsumed?: () => void;
};

export const SpeechInput = forwardRef<SpeechInputHandle, SpeechInputProps>(function SpeechInput(
  {
    className,
    onTranscriptionChange,
    onInterimTranscriptionChange,
    onListeningChange,
    onPermissionDenied,
    onAudioRecorded,
    lang = 'en-US',
    tone = 'default',
    autoStart = false,
    onAutoStartConsumed,
    ...props
  },
  ref
) {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [mode] = useState<SpeechInputMode>(detectSpeechInputMode);
  const [isRecognitionReady, setIsRecognitionReady] = useState(false);
  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const autoStartHandledRef = useRef(false);

  const emitListening = useCallback(
    (listening: boolean) => {
      setIsListening(listening);
      onListeningChange?.(listening);
    },
    [onListeningChange]
  );

  const onTranscriptionChangeEvent = useEffectEvent((text: string) => {
    onTranscriptionChange?.(text);
  });

  const onInterimTranscriptionChangeEvent = useEffectEvent((text: string) => {
    onInterimTranscriptionChange?.(text);
  });

  const onAudioRecordedEvent = useEffectEvent(async (audioBlob: Blob) => {
    if (!onAudioRecorded) {
      return undefined;
    }
    return onAudioRecorded(audioBlob);
  });

  const onPermissionDeniedEvent = useEffectEvent(() => {
    setPermissionDenied(true);
    onPermissionDenied?.();
  });

  useEffect(() => {
    if (mode !== 'speech-recognition') {
      return;
    }

    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) {
      return;
    }

    const speechRecognition = new Ctor();
    speechRecognition.continuous = true;
    speechRecognition.interimResults = true;
    speechRecognition.lang = lang;

    const handleStart = () => {
      emitListening(true);
    };

    const handleEnd = () => {
      emitListening(false);
    };

    const handleResult = (event: Event) => {
      const speechEvent = event as BrowserSpeechRecognitionEvent;
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = speechEvent.resultIndex; i < speechEvent.results.length; i += 1) {
        const result = speechEvent.results[i];
        if (!result) {
          continue;
        }
        const chunk = result[0]?.transcript ?? '';
        if (result.isFinal) {
          finalTranscript += chunk;
        } else {
          interimTranscript += chunk;
        }
      }

      if (interimTranscript.trim()) {
        onInterimTranscriptionChangeEvent(interimTranscript.trim());
      }
      if (finalTranscript.trim()) {
        onTranscriptionChangeEvent(finalTranscript.trim());
      }
    };

    const handleError = (event: Event) => {
      const code = (event as BrowserSpeechRecognitionErrorEvent).error;
      if (code === 'not-allowed' || code === 'service-not-allowed') {
        onPermissionDeniedEvent();
      }
      emitListening(false);
    };

    speechRecognition.addEventListener('start', handleStart);
    speechRecognition.addEventListener('end', handleEnd);
    speechRecognition.addEventListener('result', handleResult);
    speechRecognition.addEventListener('error', handleError);

    recognitionRef.current = speechRecognition;
    const readyFrame = requestAnimationFrame(() => setIsRecognitionReady(true));

    return () => {
      cancelAnimationFrame(readyFrame);
      speechRecognition.removeEventListener('start', handleStart);
      speechRecognition.removeEventListener('end', handleEnd);
      speechRecognition.removeEventListener('result', handleResult);
      speechRecognition.removeEventListener('error', handleError);
      speechRecognition.stop();
      recognitionRef.current = null;
      requestAnimationFrame(() => setIsRecognitionReady(false));
    };
  }, [mode, lang, emitListening]);

  useEffect(
    () => () => {
      if (mediaRecorderRef.current?.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
      if (streamRef.current) {
        for (const track of streamRef.current.getTracks()) {
          track.stop();
        }
      }
    },
    []
  );

  const startMediaRecorder = useCallback(async () => {
    if (!onAudioRecorded) {
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream);
      audioChunksRef.current = [];

      const handleDataAvailable = (event: BlobEvent) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      const handleStop = async () => {
        for (const track of stream.getTracks()) {
          track.stop();
        }
        streamRef.current = null;

        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });

        if (audioBlob.size > 0) {
          setIsProcessing(true);
          try {
            const transcript = await onAudioRecordedEvent(audioBlob);
            if (transcript) {
              onTranscriptionChangeEvent(transcript);
            }
          } catch {
            // Error handling delegated to onAudioRecorded caller
          } finally {
            setIsProcessing(false);
          }
        }
      };

      const handleError = () => {
        emitListening(false);
        for (const track of stream.getTracks()) {
          track.stop();
        }
        streamRef.current = null;
      };

      mediaRecorder.addEventListener('dataavailable', handleDataAvailable);
      mediaRecorder.addEventListener('stop', handleStop);
      mediaRecorder.addEventListener('error', handleError);

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      emitListening(true);
    } catch {
      emitListening(false);
      onPermissionDeniedEvent();
    }
  }, [emitListening, onAudioRecorded]);

  const stopMediaRecorder = useCallback(() => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    emitListening(false);
  }, [emitListening]);

  const startListening = useCallback(() => {
    if (mode === 'speech-recognition' && recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch {
        emitListening(false);
      }
      return;
    }

    if (mode === 'media-recorder') {
      void startMediaRecorder();
    }
  }, [emitListening, mode, startMediaRecorder]);

  const stopListening = useCallback(() => {
    if (mode === 'speech-recognition') {
      recognitionRef.current?.stop();
      return;
    }

    if (mode === 'media-recorder') {
      stopMediaRecorder();
    }
  }, [mode, stopMediaRecorder]);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
      return;
    }
    startListening();
  }, [isListening, startListening, stopListening]);

  useImperativeHandle(
    ref,
    () => ({
      start: startListening,
      stop: stopListening,
      toggle: toggleListening
    }),
    [startListening, stopListening, toggleListening]
  );

  useEffect(() => {
    if (!autoStart || autoStartHandledRef.current || mode === 'none') {
      return;
    }
    if (mode === 'speech-recognition' && !isRecognitionReady) {
      return;
    }
    autoStartHandledRef.current = true;
    startListening();
    onAutoStartConsumed?.();
  }, [autoStart, isRecognitionReady, mode, onAutoStartConsumed, startListening]);

  const isDisabled =
    mode === 'none' ||
    (mode === 'speech-recognition' && !isRecognitionReady) ||
    (mode === 'media-recorder' && !onAudioRecorded) ||
    isProcessing;

  const pulseBorderClass = tone === 'search' ? 'border-accent/45' : 'border-destructive/35';

  return (
    <div className='relative inline-flex size-9 shrink-0 items-center justify-center overflow-visible'>
      {isListening
        ? [0, 1, 2].map((index) => (
            <div
              className={cn(
                'pointer-events-none absolute inset-0 animate-ping rounded-full border-2',
                pulseBorderClass
              )}
              key={index}
              style={{
                animationDelay: `${index * 0.3}s`,
                animationDuration: '2s'
              }}
            />
          ))
        : null}

      <Button
        type='button'
        className={cn(
          'relative z-10 size-8 rounded-full transition-all duration-300',
          tone === 'search'
            ? cn(
                'hover:bg-accent/10 bg-transparent shadow-none',
                isListening && 'bg-accent/15 text-accent ring-accent/30 ring-2',
                permissionDenied && 'text-muted-foreground'
              )
            : cn(
                isListening
                  ? 'bg-destructive hover:bg-destructive/80 text-white hover:text-white'
                  : 'bg-primary text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground'
              ),
          className
        )}
        disabled={isDisabled}
        onClick={toggleListening}
        aria-pressed={isListening}
        {...props}
      >
        {isProcessing ? <Spinner /> : null}
        {!isProcessing && permissionDenied ? <IconMicrophoneOff className='size-4' /> : null}
        {!isProcessing && !permissionDenied && isListening ? (
          <IconSquare className='size-4' />
        ) : null}
        {!isProcessing && !permissionDenied && !isListening ? (
          <IconMicrophone className='size-4' />
        ) : null}
      </Button>
    </div>
  );
});
