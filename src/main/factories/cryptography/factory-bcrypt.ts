import { Bcrypt } from '@/infra/cryptography/bcrypt'
import { configs } from '@/main/configs'

export const factoryBcrypt = () => {
  return new Bcrypt(configs.BCRYPT_SALTS)
}
