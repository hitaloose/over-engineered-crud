import { User } from '@/domain/entities/user'

export type RegisterUserInput = {
  name: string
  username: string
  email: string
  password: string
  passwordConfirmation: string
}

export type RegisterUserOutput = {
  user: User
}

export interface RegisterUserUsecase {
  run(input: RegisterUserInput): Promise<RegisterUserOutput>
}
