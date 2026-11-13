import { User } from '@/domain/entities/user'

export interface UserFinderByIdRepository {
  findById(id: string): Promise<User | undefined>
}
