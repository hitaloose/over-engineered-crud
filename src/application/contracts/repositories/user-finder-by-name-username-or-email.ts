import { User } from '@/domain/entities/user'

export interface UserFinderByNameUsernameOrEmail {
  findByNameUsernameOrEmail(input: UserFinderByNameUsernameOrEmail.Input): Promise<User | undefined>
}

export namespace UserFinderByNameUsernameOrEmail {
  export type Input = {
    name: string
    username: string
    email: string
  }
}
