import { Validator } from '@/domain/contracts/validator'
import { UpdateTaskUsecase } from '@/domain/usecases/tasks/update-task-usecase'
import { Controller } from '@/presentation/contracts/controller'
import { replyOk } from '@/presentation/helpers/http'
import { requestInput, requireAuth } from '@/presentation/helpers/request'

export class UpdateTaskController implements Controller {
  constructor(
    private readonly inputValidator: Validator<Omit<UpdateTaskUsecase.Input, 'userId'>>,
    private readonly usecase: UpdateTaskUsecase
  ) {}

  async handle(request: Controller.Request): Promise<Controller.Response> {
    const auth = requireAuth(request)
    const input = await this.inputValidator.run(requestInput(request))

    const output = await this.usecase.run({ ...input, ...auth })

    return replyOk(output)
  }
}
