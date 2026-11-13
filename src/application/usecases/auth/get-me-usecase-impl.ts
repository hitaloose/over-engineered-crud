import { UserFinderByIdRepository } from '@/application/contracts/repositories/user-finder-by-id-repository'
import { toPublicUser } from '@/domain/entities/user'
import { NotFoundError } from '@/domain/errors/not-found-error'
import { GetMeUsecase } from '@/domain/usecases/auth/get-me-usecase'

export class GetMeUsecaseImpl implements GetMeUsecase {
  constructor(private readonly userFinderByIdRepository: UserFinderByIdRepository) {}

  async run(input: GetMeUsecase.Input): Promise<GetMeUsecase.Output> {
    const user = await this.userFinderByIdRepository.findById(input.userId)

    if (!user) {
      throw new NotFoundError('user not found')
    }

    return { user: toPublicUser(user) }
  }
}
