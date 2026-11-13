import { Task } from '@/domain/entities/task'

export interface TaskFinderByIdRepository {
  findById(input: TaskFinderByIdRepository.Input): Promise<Task | undefined>
}

export namespace TaskFinderByIdRepository {
  export type Input = { id: string; userId: string }
}
