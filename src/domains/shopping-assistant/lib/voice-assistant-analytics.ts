/** Lightweight voice-shopping analytics — hook for future GTM / product analytics. */
export type VoiceAssistantEvent =
  | 'voice_started'
  | 'voice_completed'
  | 'voice_failed'
  | 'voice_permission_denied'
  | 'voice_unsupported';

export function trackVoiceAssistantEvent(
  event: VoiceAssistantEvent,
  detail?: Record<string, string | number | boolean>
) {
  if (typeof window === 'undefined') {
    return;
  }

  window.dispatchEvent(
    new CustomEvent('luxe:voice-assistant', {
      detail: { event, ...detail, ts: Date.now() }
    })
  );
}
