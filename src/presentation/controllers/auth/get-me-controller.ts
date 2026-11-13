import { GetMeUsecase } from '@/domain/usecases/auth/get-me-usecase'
import { Controller } from '@/presentation/contracts/controller'
import { replyOk } from '@/presentation/helpers/http'
import { requireAuth } from '@/presentation/helpers/request'

export class GetMeController implements Controller {
  constructor(private readonly getMeUsecase: GetMeUsecase) {}

  async handle(request: Controller.Request): Promise<Controller.Response> {
    const output = await this.getMeUsecase.run(requireAuth(request))

    return replyOk(output)
  }
}
