import { UserFinderByEmailRepository } from '@/application/contracts/repositories/user-finder-by-email-repository'
import { UserFinderByIdRepository } from '@/application/contracts/repositories/user-finder-by-id-repository'
import { UserFinderByUsernameOrEmailRepository } from '@/application/contracts/repositories/user-finder-by-username-or-email-repository'
import { UserInserterRepository } from '@/application/contracts/repositories/user-inserter-repository'
import { BaseEntity } from '@/domain/entities/base-entity'
import { User } from '@/domain/entities/user'
import { dataSource } from '@/infra/libs/typeorm/config'
import { UserTypeorm } from '@/infra/libs/typeorm/entities/user-typeorm'

export class TypeormUserRepository
  implements UserFinderByUsernameOrEmailRepository, UserFinderByEmailRepository, UserFinderByIdRepository, UserInserterRepository
{
  private get repository() {
    return dataSource.getRepository(UserTypeorm)
  }

  async insert(values: Omit<User, keyof BaseEntity>): Promise<User> {
    return this.repository.save(this.repository.create(values))
  }

  async findByUsernameOrEmail(input: UserFinderByUsernameOrEmailRepository.Input): Promise<User | undefined> {
    const user = await this.repository.findOne({ where: [{ username: input.username }, { email: input.email }] })

    return user || undefined
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.repository.findOneBy({ email })

    return user || undefined
  }

  async findById(id: string): Promise<User | undefined> {
    const user = await this.repository.findOneBy({ id })

    return user || undefined
  }
}
