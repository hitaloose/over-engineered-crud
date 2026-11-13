import { sign, SignOptions, verify } from 'jsonwebtoken'

import { Decoder } from '@/application/contracts/cryptography/decoder'
import { Encoder } from '@/application/contracts/cryptography/encoder'

export class Jwt implements Encoder, Decoder {
  constructor(
    private readonly secret: string,
    private readonly expiresIn: SignOptions['expiresIn'] = '24h'
  ) {}

  async encode(data: Record<string, unknown>): Promise<string> {
    return sign(data, this.secret, { expiresIn: this.expiresIn })
  }

  async decode(token: string): Promise<Record<string, unknown> | undefined> {
    try {
      const payload = verify(token, this.secret)

      return typeof payload === 'string' ? undefined : payload
    } catch {
      return undefined
    }
  }
}
