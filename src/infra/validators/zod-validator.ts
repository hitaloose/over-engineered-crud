import { ZodSchema } from 'zod'

import { Validator } from '@/domain/contracts/validator'
import { ZodValidatorError } from '@/infra/errors/zod-validator-error'

export class ZodValidator<T> implements Validator<T> {
  constructor(private readonly schema: ZodSchema<T>) {}

  async run(values: unknown): Promise<T> {
    const { success, data } = this.schema.safeParse(values)

    if (!success) {
      throw new ZodValidatorError()
    }

    return data
  }
}
