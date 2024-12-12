import { Hasher } from '@/application/cryptography/hasher'

export class HasherMock implements Hasher {
  async hash(plainValue: string): Promise<string> {
    return `${plainValue}-hashed`
  }
}
