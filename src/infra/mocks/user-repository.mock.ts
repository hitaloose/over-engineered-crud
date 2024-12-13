import { UserFinderByNameUsernameOrEmail } from '@/application/contracts/repositories/user-finder-by-name-username-or-email'
import { UserInserterRepository } from '@/application/contracts/repositories/user-inserter-repository'
import { User } from '@/domain/entities/user'
import { mockUser } from '@/domain/mocks/user.mock'

export class UserRepositoryMock implements UserFinderByNameUsernameOrEmail, UserInserterRepository {
  async insert(): Promise<User> {
    return mockUser()
  }

  async findByNameUsernameOrEmail(): Promise<User | undefined> {
    return mockUser()
  }
}
