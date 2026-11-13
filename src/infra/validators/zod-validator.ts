import { ZodType, ZodTypeDef } from 'zod'

import { Validator } from '@/domain/contracts/validator'
import { ZodValidatorError } from '@/infra/errors/zod-validator-error'

export class ZodValidator<T> implements Validator<T> {
  constructor(private readonly schema: ZodType<T, ZodTypeDef, unknown>) {}

  async run(values: unknown): Promise<T> {
    const result = this.schema.safeParse(values)

    if (!result.success) {
      const { fieldErrors } = result.error.flatten()

      throw new ZodValidatorError(fieldErrors as Record<string, string[]>)
    }

    return result.data
  }
}
