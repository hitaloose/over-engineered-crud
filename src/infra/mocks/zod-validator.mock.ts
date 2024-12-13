import { ZodSchema } from 'zod'

import { ZodValidator } from '@/infra/validators/zod-validator'

export class ZodValidatorMock<T> extends ZodValidator<T> {
  constructor() {
    super(undefined as unknown as ZodSchema<T>)
  }

  async run(values: unknown): Promise<T> {
    return values as T
  }
}
