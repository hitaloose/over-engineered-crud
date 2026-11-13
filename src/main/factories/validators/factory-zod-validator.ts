import { ZodType, ZodTypeDef } from 'zod'

import { ZodValidator } from '@/infra/validators/zod-validator'

export const factoryZodValidator = <T>(schema: ZodType<T, ZodTypeDef, unknown>) => {
  return new ZodValidator(schema)
}
