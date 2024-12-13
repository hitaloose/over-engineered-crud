import { z } from 'zod'

export const registerUserSchema = z.object({
  name: z.string(),
  username: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
  passwordConfirmation: z.string().min(6),
})
