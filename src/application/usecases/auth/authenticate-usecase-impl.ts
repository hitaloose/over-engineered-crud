import { Decoder } from '@/application/contracts/cryptography/decoder'
import { UnauthorizedError } from '@/domain/errors/unauthorized-error'
import { AuthenticateUsecase } from '@/domain/usecases/auth/authenticate-usecase'

export class AuthenticateUsecaseImpl implements AuthenticateUsecase {
  constructor(private readonly decoder: Decoder) {}

  async run(input: AuthenticateUsecase.Input): Promise<AuthenticateUsecase.Output> {
    const payload = await this.decoder.decode(input.token)

    if (!payload || typeof payload.sub !== 'string') {
      throw new UnauthorizedError('invalid token')
    }

    return { userId: payload.sub }
  }
}
