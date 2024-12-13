import { UserFinderByNameUsernameOrEmail } from '@/application/contracts/repositories/user-finder-by-name-username-or-email'
import { UserInserterRepository } from '@/application/contracts/repositories/user-inserter-repository'
import { BaseEntity } from '@/domain/entities/base-entity'
import { User } from '@/domain/entities/user'
import { dataSource } from '@/infra/libs/typeorm/config'
import { UserTypeorm } from '@/infra/libs/typeorm/entities/user-typeorm'

export class TypeormUserRepository implements UserFinderByNameUsernameOrEmail, UserInserterRepository {
  async insert(values: Omit<User, keyof BaseEntity>): Promise<User> {
    const createdUser = new UserTypeorm()

    Object.assign(createdUser, values)

    await dataSource.manager.save(createdUser)

    return createdUser
  }

  async findByNameUsernameOrEmail(input: UserFinderByNameUsernameOrEmail.Input): Promise<User | undefined> {
    const userRepository = dataSource.getRepository(UserTypeorm)
    const user = await userRepository.findOne({ where: { email: input.email } })

    return user || undefined
  }
}
