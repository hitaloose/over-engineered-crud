import { z } from 'zod'

const schema = z.object({
  API_PORT: z.coerce.number().int(),
  BCRYPT_SALTS: z.coerce.number().int().min(1).max(20),
  JWT_SECRET: z.string().min(1),
})

export const configs = schema.parse(process.env)
