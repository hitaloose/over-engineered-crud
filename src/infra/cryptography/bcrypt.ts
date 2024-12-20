import { genSalt, hash } from 'bcrypt'

import { Hasher } from '@/application/contracts/cryptography/hasher'

export class Bcrypt implements Hasher {
  constructor(private readonly salts: number) {}

  async hash(plainValue: string): Promise<string> {
    const salt = await genSalt(this.salts)
    return hash(plainValue, salt)
  }
}
