import { ZodSchema } from 'zod'

import { ZodValidator } from '@/infra/validators/zod-validator'

export const factoryZodValidator = <T>(schema: ZodSchema<T>) => {
  return new ZodValidator(schema)
}
