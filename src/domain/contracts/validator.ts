export interface Validator<T> {
  run(values: unknown): Promise<T>
}
