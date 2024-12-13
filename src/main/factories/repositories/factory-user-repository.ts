import { TypeormUserRepository } from '@/infra/repositories/typeorm-user-repository'

export const factoryUserRepository = () => {
  return new TypeormUserRepository()
}
