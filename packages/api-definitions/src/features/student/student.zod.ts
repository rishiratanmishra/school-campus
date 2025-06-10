import { z } from 'zod';

export const NameZodSchema = z.object({
  first: z.string().min(1, 'First name is required'),
  middle: z.string().optional().nullable(),
  last: z.string().min(1, 'Last name is required'),
});

export const StudentZodSchema = z.object({
  name: NameZodSchema,
  email: z.string().email('Invalid email address'),
  age: z
    .number({
      invalid_type_error: 'Age must be a number',
      required_error: 'Age is required',
    })
    .min(3, 'Age must be at least 3')
    .max(100, 'Age must be less than 100'),
  isActive: z.boolean().default(true),
});

export type IStudentZS = z.infer<typeof StudentZodSchema>;
export default StudentZodSchema;
