import { BaseEntity } from '@/domain/entities/base-entity'
import { User } from '@/domain/entities/user'

export interface UserInserterRepository {
  insert(values: Omit<User, keyof BaseEntity>): Promise<User>
}
