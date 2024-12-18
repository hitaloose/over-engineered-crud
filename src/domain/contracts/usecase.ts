export interface Usecase<Input, Output> {
  run(input: Input): Promise<Output>
}
