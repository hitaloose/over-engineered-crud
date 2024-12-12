import { UserFinderByNameUsernameOrEmail } from '@/application/repositories/user-finder-by-name-username-or-email'
import { UserInserterRepository } from '@/application/repositories/user-inserter-repository'
import { User } from '@/domain/entities/user'

export class UserRepositoryMock implements UserFinderByNameUsernameOrEmail, UserInserterRepository {
  static DATA: Record<string, User> = {}

  async insert(values: Omit<User, 'id'>): Promise<User> {
    const newId = crypto.randomUUID()

    const createdUser: User = { id: newId, ...values }

    UserRepositoryMock.DATA[newId] = createdUser

    return createdUser
  }

  async findByNameUsernameOrEmail(input: UserFinderByNameUsernameOrEmail.Input): Promise<User | undefined> {
    const users = Object.values(UserRepositoryMock.DATA)

    const user = users.find((item) => item.name === input.name || item.username === input.username || item.email === input.email)

    return user
  }
}
