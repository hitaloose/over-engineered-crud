import { faker } from '@faker-js/faker'

import { Encoder } from '@/application/contracts/cryptography/encoder'

export class EncoderMock implements Encoder {
  async encode(): Promise<string> {
    return faker.string.uuid()
  }
}
