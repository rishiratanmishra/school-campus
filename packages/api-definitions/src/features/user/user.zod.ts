import { z } from 'zod';

export const UserZodSchema = z.object({
  name: z.object({
    first: z.string().min(1, 'First name is required'),
    middle: z.string().optional(),
    last: z.string().min(1, 'Last name is required'),
  }),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  isActive: z.boolean().optional(),
});

export type IUserZS = z.infer<typeof UserZodSchema>;
export default UserZodSchema