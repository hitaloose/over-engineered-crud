import { User } from '@/domain/entities/user'

export interface UserInserterRepository {
  insert(values: Omit<User, 'id'>): Promise<User>
}
