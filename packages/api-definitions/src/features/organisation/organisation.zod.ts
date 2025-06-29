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

export const OrganisationZodSchema = z.object({
  name: z.string().min(1, 'Organisation name is required'),
  slug: z
    .string()
    .optional()
    .refine((val) => !val || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(val), {
      message: 'Slug must be URL-friendly (lowercase, dash-separated)',
    }),
  domain: z
    .string()
    .optional()
    .refine((val) => !val || /^[a-z0-9.-]+\.[a-z]{2,}$/.test(val), {
      message: 'Domain must be a valid format (e.g., example.com)',
    }),
  established: z.date().optional(),
  description: z.string().optional(),
  organisationType: OrganisationTypeEnum,
  boardType: BoardTypeEnum,
  isActive: z.boolean().default(false),
});
export type IOrganisationZS = z.infer<typeof OrganisationZodSchema>;
export default OrganisationZodSchema;
