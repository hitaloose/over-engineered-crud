import { describe, expect, it } from 'vitest'
import { z } from 'zod'

import { ZodValidatorError } from '@/infra/errors/zod-validator-error'
import { ZodValidator } from '@/infra/validators/zod-validator'

const sut = new ZodValidator(z.object({ name: z.string().min(2), age: z.coerce.number().int() }))

describe('ZodValidator', () => {
  it('should return the parsed (coerced) data', async () => {
    expect(await sut.run({ name: 'Ada', age: '36', extra: 'stripped' })).toEqual({ name: 'Ada', age: 36 })
  })

  it('should throw ZodValidatorError with per-field details', async () => {
    const error = await sut.run({ name: 'A', age: 'x' }).catch((e) => e)

    expect(error).toBeInstanceOf(ZodValidatorError)
    expect(Object.keys(error.details).sort()).toEqual(['age', 'name'])
    expect(error.details.name[0]).toMatch(/at least 2/)
  })

  it('should reject non-object input', async () => {
    await expect(sut.run(undefined)).rejects.toBeInstanceOf(ZodValidatorError)
  })
})
