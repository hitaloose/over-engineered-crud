import { Encoder } from '@/application/contracts/cryptography/encoder'
import { Hasher } from '@/application/contracts/cryptography/hasher'
import { UserFinderByNameUsernameOrEmail } from '@/application/contracts/repositories/user-finder-by-name-username-or-email'
import { UserInserterRepository } from '@/application/contracts/repositories/user-inserter-repository'
import { DomainError } from '@/domain/errors/domain-error'
import { RegisterUserUsecase } from '@/domain/usecases/register-user-usecase'

export class RegisterUserUsecaseImpl implements RegisterUserUsecase {
  constructor(
    private readonly hasher: Hasher,
    private readonly encoder: Encoder,
    private readonly userFinderByNameUsernameOrEmail: UserFinderByNameUsernameOrEmail,
    private readonly userInserterRepository: UserInserterRepository
  ) {}
  async run(input: RegisterUserUsecase.Input): Promise<RegisterUserUsecase.Output> {
    if (input.password !== input.passwordConfirmation) {
      throw new DomainError('passwords not match')
    }

    const userAlreadyRegister = await this.userFinderByNameUsernameOrEmail.findByNameUsernameOrEmail(input)

    if (userAlreadyRegister) {
      throw new DomainError('user already register')
    }

    const hashedPassword = await this.hasher.hash(input.password)

    const user = await this.userInserterRepository.insert({ ...input, hashedPassword })

    const token = await this.encoder.encode({ sub: user.id })

    return { user, token }
  }
}
