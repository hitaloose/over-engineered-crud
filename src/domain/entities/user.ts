import { BaseEntity } from '@/domain/entities/base-entity'

export type User = BaseEntity & {
  name: string
  username: string
  email: string
  hashedPassword: string
}
