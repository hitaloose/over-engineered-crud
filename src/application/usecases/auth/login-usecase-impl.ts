import { Encoder } from '@/application/contracts/cryptography/encoder'
import { HashComparer } from '@/application/contracts/cryptography/hash-comparer'
import { UserFinderByEmailRepository } from '@/application/contracts/repositories/user-finder-by-email-repository'
import { toPublicUser } from '@/domain/entities/user'
import { UnauthorizedError } from '@/domain/errors/unauthorized-error'
import { LoginUsecase } from '@/domain/usecases/auth/login-usecase'

export class LoginUsecaseImpl implements LoginUsecase {
  constructor(
    private readonly hashComparer: HashComparer,
    private readonly encoder: Encoder,
    private readonly userFinderByEmailRepository: UserFinderByEmailRepository
  ) {}

  async run(input: LoginUsecase.Input): Promise<LoginUsecase.Output> {
    const user = await this.userFinderByEmailRepository.findByEmail(input.email)

    if (!user) {
      throw new UnauthorizedError('invalid credentials')
    }

    const passwordMatches = await this.hashComparer.compare(input.password, user.hashedPassword)

    if (!passwordMatches) {
      throw new UnauthorizedError('invalid credentials')
    }

    const token = await this.encoder.encode({ sub: user.id })

    return { user: toPublicUser(user), token }
  }
}
