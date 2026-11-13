import { faker } from '@faker-js/faker'

import { HashComparer } from '@/application/contracts/cryptography/hash-comparer'
import { Hasher } from '@/application/contracts/cryptography/hasher'

export class HasherMock implements Hasher, HashComparer {
  async hash(): Promise<string> {
    return faker.string.uuid()
  }

  async compare(): Promise<boolean> {
    return true
  }
}
