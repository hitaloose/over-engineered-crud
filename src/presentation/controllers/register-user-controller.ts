import { Validator } from '@/domain/contracts/validator'
import { RegisterUserUsecase } from '@/domain/usecases/register-user-usecase'
import { Controller } from '@/presentation/contracts/controller'
import { replyCreated } from '@/presentation/helpers/http'

export class RegisterUserController implements Controller {
  constructor(
    private readonly bodyValidator: Validator<RegisterUserUsecase.Input>,
    private readonly registerUserUsecase: RegisterUserUsecase
  ) {}

  async handle(request: Controller.Request): Promise<Controller.Response> {
    const body = await this.bodyValidator.run(request.body)

    const output = await this.registerUserUsecase.run(body)

    return replyCreated(output)
  }
}
