import { UserFinderByEmailRepository } from '@/application/contracts/repositories/user-finder-by-email-repository'
import { UserFinderByIdRepository } from '@/application/contracts/repositories/user-finder-by-id-repository'
import { UserFinderByUsernameOrEmailRepository } from '@/application/contracts/repositories/user-finder-by-username-or-email-repository'
import { UserInserterRepository } from '@/application/contracts/repositories/user-inserter-repository'
import { User } from '@/domain/entities/user'
import { mockUser } from '@/domain/mocks/user.mock'

export class UserRepositoryMock
  implements UserFinderByUsernameOrEmailRepository, UserFinderByEmailRepository, UserFinderByIdRepository, UserInserterRepository
{
  async insert(): Promise<User> {
    return mockUser()
  }

  async findByUsernameOrEmail(): Promise<User | undefined> {
    return mockUser()
  }

  async findByEmail(): Promise<User | undefined> {
    return mockUser()
  }

  async findById(): Promise<User | undefined> {
    return mockUser()
  }
}
