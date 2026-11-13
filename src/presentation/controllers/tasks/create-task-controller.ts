import { Validator } from '@/domain/contracts/validator'
import { CreateTaskUsecase } from '@/domain/usecases/tasks/create-task-usecase'
import { Controller } from '@/presentation/contracts/controller'
import { replyCreated } from '@/presentation/helpers/http'
import { requestInput, requireAuth } from '@/presentation/helpers/request'

export class CreateTaskController implements Controller {
  constructor(
    private readonly inputValidator: Validator<Omit<CreateTaskUsecase.Input, 'userId'>>,
    private readonly usecase: CreateTaskUsecase
  ) {}

  async handle(request: Controller.Request): Promise<Controller.Response> {
    const auth = requireAuth(request)
    const input = await this.inputValidator.run(requestInput(request))

    const output = await this.usecase.run({ ...input, ...auth })

    return replyCreated(output)
  }
}
