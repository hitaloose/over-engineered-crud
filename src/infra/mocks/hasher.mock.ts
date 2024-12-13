import { faker } from '@faker-js/faker'

import { Hasher } from '@/application/contracts/cryptography/hasher'

export class HasherMock implements Hasher {
  async hash(): Promise<string> {
    return faker.string.uuid()
  }
}
