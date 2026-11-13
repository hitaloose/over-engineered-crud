import { compare, genSalt, hash } from 'bcrypt'

import { HashComparer } from '@/application/contracts/cryptography/hash-comparer'
import { Hasher } from '@/application/contracts/cryptography/hasher'

export class Bcrypt implements Hasher, HashComparer {
  constructor(private readonly salts: number) {}

  async hash(plainValue: string): Promise<string> {
    const salt = await genSalt(this.salts)
    return hash(plainValue, salt)
  }

  async compare(plainValue: string, hashedValue: string): Promise<boolean> {
    return compare(plainValue, hashedValue)
  }
}
