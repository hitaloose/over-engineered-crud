export interface SchemaValidator<T> {
  validate(values: Record<string, unknown>): Promise<T>
}
