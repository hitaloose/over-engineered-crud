import { BaseEntity } from '@/domain/entities/base-entity'

export type User = BaseEntity & {
  name: string
  username: string
  email: string
  hashedPassword: string
}

export type PublicUser = Omit<User, 'hashedPassword'>

export const toPublicUser = (user: User): PublicUser => {
  const { id, name, username, email, createdAt, updatedAt } = user

  return { id, name, username, email, createdAt, updatedAt }
}
