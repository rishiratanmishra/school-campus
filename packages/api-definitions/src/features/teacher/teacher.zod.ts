import { z } from 'zod';

export const NameZodSchema = z.object({
  first: z.string().min(1, 'First name is required'),
  middle: z.string().optional().nullable(),
  last: z.string().min(1, 'Last name is required'),
});
export const TeacherZodSchema = z.object({
  name: NameZodSchema,
  email: z.string().email('Invalid email'),
  phoneNumber: z.string().min(10, 'Phone must be at least 10 digits').max(15, 'Phone must be at most 15 digits').optional(),
  qualification: z.string().optional(),
  department: z.string().optional(),
  subjects: z.array(z.string()).optional(),
  isActive: z.boolean().default(true),
});

export type ITeacherZS = z.infer<typeof TeacherZodSchema>;
export default TeacherZodSchema;