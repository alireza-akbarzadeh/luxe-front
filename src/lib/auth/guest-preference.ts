/** Cookie set when the shopper chooses "Continue as guest" on `/welcome`. */
export const guestPreferenceCookieName = 'luxe_guest_choice';

export const guestPreferenceValue = 'continue';

export function isGuestPreference(value: string | undefined): boolean {
  return value === guestPreferenceValue;
}
