import { Validator } from '@/domain/contracts/validator'
import { LoginUsecase } from '@/domain/usecases/auth/login-usecase'
import { Controller } from '@/presentation/contracts/controller'
import { replyOk } from '@/presentation/helpers/http'

export class LoginController implements Controller {
  constructor(
    private readonly bodyValidator: Validator<LoginUsecase.Input>,
    private readonly loginUsecase: LoginUsecase
  ) {}

  async handle(request: Controller.Request): Promise<Controller.Response> {
    const body = await this.bodyValidator.run(request.body)

    const output = await this.loginUsecase.run(body)

    return replyOk(output)
  }
}
