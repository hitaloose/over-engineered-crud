import { User } from '@/domain/entities/user'

export interface UserFinderByUsernameOrEmailRepository {
  findByUsernameOrEmail(input: UserFinderByUsernameOrEmailRepository.Input): Promise<User | undefined>
}

export namespace UserFinderByUsernameOrEmailRepository {
  export type Input = {
    username: string
    email: string
  }
}
