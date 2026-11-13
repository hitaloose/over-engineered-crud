import { Encoder } from '@/application/contracts/cryptography/encoder'
import { Hasher } from '@/application/contracts/cryptography/hasher'
import { UserFinderByUsernameOrEmailRepository } from '@/application/contracts/repositories/user-finder-by-username-or-email-repository'
import { UserInserterRepository } from '@/application/contracts/repositories/user-inserter-repository'
import { toPublicUser } from '@/domain/entities/user'
import { DomainError } from '@/domain/errors/domain-error'
import { RegisterUserUsecase } from '@/domain/usecases/auth/register-user-usecase'

export class RegisterUserUsecaseImpl implements RegisterUserUsecase {
  constructor(
    private readonly hasher: Hasher,
    private readonly encoder: Encoder,
    private readonly userFinderByUsernameOrEmailRepository: UserFinderByUsernameOrEmailRepository,
    private readonly userInserterRepository: UserInserterRepository
  ) {}

  async run(input: RegisterUserUsecase.Input): Promise<RegisterUserUsecase.Output> {
    if (input.password !== input.passwordConfirmation) {
      throw new DomainError('passwords not match')
    }

    const userAlreadyRegister = await this.userFinderByUsernameOrEmailRepository.findByUsernameOrEmail({
      username: input.username,
      email: input.email,
    })

    if (userAlreadyRegister) {
      throw new DomainError('user already register')
    }

    const hashedPassword = await this.hasher.hash(input.password)

    const user = await this.userInserterRepository.insert({ name: input.name, username: input.username, email: input.email, hashedPassword })

    const token = await this.encoder.encode({ sub: user.id })

    return { user: toPublicUser(user), token }
  }
}
