import { z } from 'zod'

const refineDbConfig = (value: unknown) => !(!value && process.env.NODE_ENV !== 'test')
const refineDbConfigMessage = 'Input required if NODE_ENV !== test'

const booleanString = z
  .enum(['true', 'false'])
  .default('true')
  .transform((value) => value === 'true')

const schema = z.object({
  API_PORT: z.coerce.number().int(),
  BCRYPT_SALTS: z.coerce.number().int().min(1).max(20),
  JWT_SECRET: z.string().min(1),
  JWT_EXPIRES_IN: z.string().default('24h'),

  MCP_ENABLED: booleanString,
  MCP_ACCESS_TOKEN: z.string().optional(),

  DB_HOST: z.string().optional().refine(refineDbConfig, refineDbConfigMessage),
  DB_PORT: z.coerce.number().int().optional().refine(refineDbConfig, refineDbConfigMessage),
  DB_NAME: z.string().optional().refine(refineDbConfig, refineDbConfigMessage),
  DB_USER: z.string().optional().refine(refineDbConfig, refineDbConfigMessage),
  DB_PASSWORD: z.string().optional().refine(refineDbConfig, refineDbConfigMessage),
})

export const configs = schema.parse(process.env)
