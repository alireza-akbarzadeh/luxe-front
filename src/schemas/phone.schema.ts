import { isValidPhoneNumber } from 'react-phone-number-input';
import { z } from 'zod';

type PhoneE164Options = {
  /** When false, empty string passes validation. */
  required?: boolean;
  requiredMessage?: string;
  invalidMessage?: string;
};

/** Zod string validated as E.164 (matches Go `validate:"e164"`). */
export function phoneE164String({
  required = true,
  requiredMessage = 'Phone number is required',
  invalidMessage = 'Enter a valid phone number in international format (e.g. +1234567890)'
}: PhoneE164Options = {}) {
  return z.string().superRefine((value, ctx) => {
    const trimmed = value.trim();

    if (!trimmed) {
      if (required) {
        ctx.addIssue({ code: 'custom', message: requiredMessage });
      }
      return;
    }

    if (!isValidPhoneNumber(trimmed)) {
      ctx.addIssue({ code: 'custom', message: invalidMessage });
    }
  });
}
