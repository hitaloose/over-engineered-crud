import { faker } from '@faker-js/faker'

import { Decoder } from '@/application/contracts/cryptography/decoder'

export class DecoderMock implements Decoder {
  async decode(): Promise<Record<string, unknown> | undefined> {
    return { sub: faker.string.uuid() }
  }
}
