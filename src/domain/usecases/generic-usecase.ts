export interface GenericUsecase<Input, Output> {
  run(input: Input): Promise<Output>
}
