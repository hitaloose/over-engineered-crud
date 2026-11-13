import { Validator } from '@/domain/contracts/validator'
import { GetTaskUsecase } from '@/domain/usecases/tasks/get-task-usecase'
import { Controller } from '@/presentation/contracts/controller'
import { replyOk } from '@/presentation/helpers/http'
import { requestInput, requireAuth } from '@/presentation/helpers/request'

export class GetTaskController implements Controller {
  constructor(
    private readonly inputValidator: Validator<Omit<GetTaskUsecase.Input, 'userId'>>,
    private readonly usecase: GetTaskUsecase
  ) {}

  async handle(request: Controller.Request): Promise<Controller.Response> {
    const auth = requireAuth(request)
    const input = await this.inputValidator.run(requestInput(request))

    const output = await this.usecase.run({ ...input, ...auth })

    return replyOk(output)
  }
}
