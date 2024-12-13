export class ZodValidatorError extends Error {
  constructor(readonly details: Record<string, string[]>) {
    super('Validation error')
  }
}
