import { isValidPhoneNumber } from 'react-phone-number-input';
import { z } from 'zod';
type ValidationT = (key: string) => string;

export function createLoginFormSchema(t: ValidationT) {
  return z.object({
    email: z.email(t('invalidEmail')),
    password: z.string().min(1, t('passwordRequired')),
    rememberMe: z.boolean()
  });
}

export function createRegisterFormSchema(t: ValidationT) {
  return z
    .object({
      firstName: z.string().min(2, t('firstNameRequired')),
      lastName: z.string().min(2, t('lastNameRequired')),
      email: z.string().email(t('invalidEmail')),
      phone: z.string().refine((val) => val === '' || isValidPhoneNumber(val), t('phoneE164')),
      password: z.string().min(8, t('passwordMinLength')),
      confirmPassword: z.string(),
      acceptTerms: z.boolean().refine((val) => val, {
        message: t('acceptTerms')
      }),
      acceptMarketing: z.boolean()
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('passwordsMismatch'),
      path: ['confirmPassword']
    });
}

export function createResetPasswordFormSchema(t: ValidationT) {
  return z
    .object({
      password: z.string().min(6, t('passwordMinLengthReset')),
      confirmPassword: z.string()
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('passwordsMismatch'),
      path: ['confirmPassword']
    });
}

export function createChangePasswordFormSchema(t: ValidationT) {
  return z
    .object({
      currentPassword: z.string().min(1, t('currentPasswordRequired')),
      newPassword: z.string().min(8, t('newPasswordMinLength')),
      confirmPassword: z.string()
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t('passwordsMismatch'),
      path: ['confirmPassword']
    });
}

/** @deprecated Use createLoginFormSchema with translations */
export const loginFormSchema = createLoginFormSchema((key) => key);

/** @deprecated Use createRegisterFormSchema with translations */
export const registerFormSchema = createRegisterFormSchema((key) => key);

/** @deprecated Use createResetPasswordFormSchema with translations */
export const resetPasswordFormSchema = createResetPasswordFormSchema((key) => key);

/** @deprecated Use createChangePasswordFormSchema with translations */
export const changePasswordFormSchema = createChangePasswordFormSchema((key) => key);
