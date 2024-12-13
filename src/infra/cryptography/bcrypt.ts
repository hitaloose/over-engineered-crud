import { hash } from 'bcrypt'

import { Hasher } from '@/application/contracts/cryptography/hasher'

export class Bcrypt implements Hasher {
  constructor(private readonly salts: number) {}

  hash(plainValue: string): Promise<string> {
    return hash(plainValue, this.salts)
  }
}
