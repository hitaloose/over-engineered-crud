import { Validator } from '@/domain/contracts/validator'
import { ListTasksUsecase } from '@/domain/usecases/tasks/list-tasks-usecase'
import { Controller } from '@/presentation/contracts/controller'
import { replyOk } from '@/presentation/helpers/http'
import { requestInput, requireAuth } from '@/presentation/helpers/request'

export class ListTasksController implements Controller {
  constructor(
    private readonly inputValidator: Validator<Omit<ListTasksUsecase.Input, 'userId'>>,
    private readonly usecase: ListTasksUsecase
  ) {}

  async handle(request: Controller.Request): Promise<Controller.Response> {
    const auth = requireAuth(request)
    const input = await this.inputValidator.run(requestInput(request))

    const output = await this.usecase.run({ ...input, ...auth })

    return replyOk(output)
  }
}
