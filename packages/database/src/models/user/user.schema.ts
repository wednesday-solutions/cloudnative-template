import { z } from 'zod';

export const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  password: z.string(),
});

export type UserAttributes = z.infer<typeof UserSchema>;
export default UserSchema;
