import { ZodType, ZodTypeDef } from 'zod'

import { ZodValidator } from '@/infra/validators/zod-validator'

export class ZodValidatorMock<T> extends ZodValidator<T> {
  constructor() {
    super(undefined as unknown as ZodType<T, ZodTypeDef, unknown>)
  }

  async run(values: unknown): Promise<T> {
    return values as T
  }
}
