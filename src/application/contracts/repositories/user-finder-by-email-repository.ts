import { User } from '@/domain/entities/user'

export interface UserFinderByEmailRepository {
  findByEmail(email: string): Promise<User | undefined>
}
