import { SignOptions } from 'jsonwebtoken'

import { Jwt } from '@/infra/cryptography/jwt'
import { configs } from '@/main/configs'

export const factoryJwt = () => {
  return new Jwt(configs.JWT_SECRET, configs.JWT_EXPIRES_IN as SignOptions['expiresIn'])
}
