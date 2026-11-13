import { TypeormTaskRepository } from '@/infra/repositories/typeorm-task-repository'

export const factoryTaskRepository = () => {
  return new TypeormTaskRepository()
}
