import { ZodSchema } from 'zod'

import { Validator } from '@/domain/contracts/validator'
import { ZodValidatorError } from '@/infra/errors/zod-validator-error'

export class ZodValidator<T> implements Validator<T> {
  constructor(private readonly schema: ZodSchema<T>) {}

  async run(values: unknown): Promise<T> {
    const { success, data, error } = this.schema.safeParse(values)

    if (!success) {
      const details: Record<string, string[]> = {}

      Object.entries(error.format()).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          return
        }

        if (key === '_errors') {
          return
        }

        details[key] = value?._errors || []
      })

      throw new ZodValidatorError(details)
    }

    return data
  }
}
