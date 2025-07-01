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
  // slug: z
  //   .string()
  //   .optional(),
  domain: z
    .string()
    .optional(),
  established: z.date().optional(),
  description: z.string().optional(),
  organisationType: OrganisationTypeEnum,
  boardType: BoardTypeEnum,
  isActive: z.boolean().default(false),
});
export type IOrganisationZS = z.infer<typeof OrganisationZodSchema>;
export default OrganisationZodSchema;
