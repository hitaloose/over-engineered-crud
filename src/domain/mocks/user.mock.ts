import { faker } from '@faker-js/faker'

import { User } from '@/domain/entities/user'

export const mockUser = (override?: Partial<User>): User => ({
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  email: faker.internet.email(),
  hashedPassword: faker.string.uuid(),
  username: faker.internet.username(),
  ...override,
})
