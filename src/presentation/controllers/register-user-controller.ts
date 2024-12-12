import { SchemaValidator } from '@/application/contracts/validators/schema-validator'
import { RegisterUserUsecase } from '@/domain/usecases/register-user-usecase'
import { Controller } from '@/presentation/contracts/controller'

export class RegisterUserController implements Controller {
  constructor(
    private readonly bodyValidator: SchemaValidator<RegisterUserUsecase.Input>,
    private readonly registerUserUsecase: RegisterUserUsecase
  ) {}

  async handle(request: Controller.Request): Promise<Controller.Response> {
    const body = await this.bodyValidator.validate(request.body)

    const output = await this.registerUserUsecase.run(body)

    return { statusCode: Controller.StatusCode.CREATED, body: output }
  }
}
