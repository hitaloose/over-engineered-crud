import { sign } from 'jsonwebtoken'

import { Encoder } from '@/application/contracts/cryptography/encoder'

export class Jwt implements Encoder {
  constructor(private readonly secret: string) {}

  async encode(data: Record<string, unknown>): Promise<string> {
    return sign(data, this.secret, { expiresIn: '24h' })
  }
}
