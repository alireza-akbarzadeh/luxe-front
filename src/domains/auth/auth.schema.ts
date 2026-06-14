import { z } from 'zod';

export const loginFormSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean()
});

export const registerFormSchema = z
  .object({
    firstName: z.string().min(2, 'First name is required'),
    lastName: z.string().min(2, 'Last name is required'),
    email: z.string().email('Invalid email address'),
    phone: z
      .string()
      .refine(
        (val) => val === '' || /^\+?[1-9]\d{1,14}$/.test(val),
        'Phone number must be in E.164 format (e.g., +1234567890)'
      ),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    acceptTerms: z.boolean().refine((val) => val, {
      message: 'You must accept terms'
    }),
    acceptMarketing: z.boolean()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  });
