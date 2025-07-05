import { z } from 'zod';

export const OrganisationTypeEnum = z.enum([
  'SCHOOL',
  'COLLEGE',
  'UNIVERSITY',
  'TRAINING_INSTITUTE',
  'COACHING',
  'OTHER',
]);

export const BoardTypeEnum = z.enum([
  'CBSE',
  'ICSE',
  'STATE',
  'INTERNATIONAL',
  'OTHER',
]);

export const ContactTypeEnum = z.enum([
  'PHONE',
  'EMAIL',
  'FAX',
  'MOBILE',
  'LANDLINE',
]);

export const AddressTypeEnum = z.enum([
  'MAIN',
  'BRANCH',
  'BILLING',
  'POSTAL',
]);

// Helper function to transform empty strings to undefined
const emptyStringToUndefined = z
  .string()
  .trim()
  .transform((val) => (val === '' ? undefined : val));

const AddressSchema = z.object({
  type: AddressTypeEnum.default('MAIN'),
  street: emptyStringToUndefined.optional(),
  area: emptyStringToUndefined.optional(),
  city: emptyStringToUndefined.optional(),
  state: emptyStringToUndefined.optional(),
  pincode: emptyStringToUndefined.optional(),
  country: emptyStringToUndefined.optional(),
  isPrimary: z.boolean().default(false),
});

const ContactInfoSchema = z.object({
  type: ContactTypeEnum.default('PHONE'),
  label: emptyStringToUndefined.optional(),
  value: z.string().trim().min(1, 'Contact value is required'),
  extension: emptyStringToUndefined.optional(),
  isPrimary: z.boolean().default(false),
  isPublic: z.boolean().default(true),
});

// Social Media schema
const SocialMediaSchema = z.object({
  facebook: z
    .string()
    .trim()
    .url()
    .optional()
    .or(z.literal('').transform(() => undefined)),
  instagram: z
    .string()
    .trim()
    .url()
    .optional()
    .or(z.literal('').transform(() => undefined)),
  twitter: z
    .string()
    .trim()
    .url()
    .optional()
    .or(z.literal('').transform(() => undefined)),
  linkedin: z
    .string()
    .trim()
    .url()
    .optional()
    .or(z.literal('').transform(() => undefined)),
  youtube: z
    .string()
    .trim()
    .url()
    .optional()
    .or(z.literal('').transform(() => undefined)),
  website: z
    .string()
    .trim()
    .url()
    .optional()
    .or(z.literal('').transform(() => undefined)),
});

export const OrganisationZodSchema = z.object({
  name: z.string().trim().min(1, 'Organisation name is required'),
  domain: emptyStringToUndefined.optional(),
  slug: z.string().trim().min(1, 'Slug is required'),
  logo: z
    .string()
    .trim()
    .url()
    .optional()
    .or(z.literal('').transform(() => undefined)),
  coverImage: z
    .string()
    .trim()
    .url()
    .optional()
    .or(z.literal('').transform(() => undefined)),
  established: z.date().optional(),
  motto: emptyStringToUndefined.optional(),
  description: emptyStringToUndefined.optional(),
  organisationType: OrganisationTypeEnum,
  boardType: BoardTypeEnum,
  address: z.array(AddressSchema).optional(),
  socialMedia: SocialMediaSchema.optional(),
  contactInfo: z.array(ContactInfoSchema).optional(),
  isActive: z.boolean().default(false),
});

export type IOrganisationZS = z.infer<typeof OrganisationZodSchema>;
export default OrganisationZodSchema;