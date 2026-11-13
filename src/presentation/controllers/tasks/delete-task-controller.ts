import { Validator } from '@/domain/contracts/validator'
import { DeleteTaskUsecase } from '@/domain/usecases/tasks/delete-task-usecase'
import { Controller } from '@/presentation/contracts/controller'
import { replyNoContent } from '@/presentation/helpers/http'
import { requestInput, requireAuth } from '@/presentation/helpers/request'

export class DeleteTaskController implements Controller {
  constructor(
    private readonly inputValidator: Validator<Omit<DeleteTaskUsecase.Input, 'userId'>>,
    private readonly usecase: DeleteTaskUsecase
  ) {}

  async handle(request: Controller.Request): Promise<Controller.Response> {
    const auth = requireAuth(request)
    const input = await this.inputValidator.run(requestInput(request))

    await this.usecase.run({ ...input, ...auth })

    return replyNoContent()
  }
}
