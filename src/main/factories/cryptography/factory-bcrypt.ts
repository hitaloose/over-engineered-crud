import { Bcrypt } from '@/infra/cryptography/bcrypt'

export const factoryBcrypt = () => {
  return new Bcrypt(10)
}
