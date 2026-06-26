import { z } from 'zod';

export const VENDOR_ONBOARDING_STEP_IDS = [
  'account',
  'business',
  'store',
  'operations',
  'review'
] as const;

export type VendorOnboardingStepId = (typeof VENDOR_ONBOARDING_STEP_IDS)[number];

export const vendorOnboardingSchema = z
  .object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.email('Enter a valid email'),
    phone: z.string().optional(),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(8, 'Confirm your password'),
    businessLegalName: z.string().min(2, 'Legal business name is required'),
    businessType: z.enum(['individual', 'company', 'brand']),
    country: z.string().min(2, 'Country is required'),
    website: z.string().optional(),
    taxId: z.string().optional(),
    storeName: z.string().min(2, 'Store name is required'),
    storeDescription: z.string().min(20, 'Tell shoppers about your brand (min 20 chars)'),
    location: z.string().min(2, 'Primary location is required'),
    locationLat: z.number().optional(),
    locationLng: z.number().optional(),
    categoryIds: z.array(z.string()).min(1, 'Select at least one category'),
    logoUrl: z.string().optional(),
    shippingInfo: z.string().min(10, 'Describe how you ship orders'),
    returnPolicy: z.string().min(10, 'Describe your return policy'),
    fulfillmentModel: z.enum(['self', 'platform', 'hybrid']),
    acceptVendorTerms: z.boolean()
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  })
  .refine((value) => value.acceptVendorTerms, {
    message: 'You must accept the seller agreement',
    path: ['acceptVendorTerms']
  });

export type VendorOnboardingValues = z.infer<typeof vendorOnboardingSchema>;

export const vendorOnboardingDefaults: VendorOnboardingValues = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  businessLegalName: '',
  businessType: 'brand',
  country: '',
  website: '',
  taxId: '',
  storeName: '',
  storeDescription: '',
  location: '',
  locationLat: undefined,
  locationLng: undefined,
  categoryIds: [],
  logoUrl: '',
  shippingInfo: '',
  returnPolicy: '',
  fulfillmentModel: 'self',
  acceptVendorTerms: false
};

export const vendorOnboardingStepFields: Record<
  VendorOnboardingStepId,
  (keyof VendorOnboardingValues)[]
> = {
  account: ['firstName', 'lastName', 'email', 'phone', 'password', 'confirmPassword'],
  business: ['businessLegalName', 'businessType', 'country', 'website', 'taxId'],
  store: [
    'storeName',
    'storeDescription',
    'location',
    'locationLat',
    'locationLng',
    'categoryIds',
    'logoUrl'
  ],
  operations: ['shippingInfo', 'returnPolicy', 'fulfillmentModel'],
  review: ['acceptVendorTerms']
};
