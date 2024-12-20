import { Jwt } from '@/infra/cryptography/jwt'
import { configs } from '@/main/configs'

export const factoryJwt = () => {
  return new Jwt(configs.JWT_SECRET)
}
