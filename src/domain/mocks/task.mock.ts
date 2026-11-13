import { faker } from '@faker-js/faker'

import { Task, TASK_STATUSES } from '@/domain/entities/task'

export const mockTask = (override?: Partial<Task>): Task => ({
  id: faker.string.uuid(),
  userId: faker.string.uuid(),
  title: faker.lorem.sentence(),
  description: faker.lorem.paragraph(),
  status: faker.helpers.arrayElement(TASK_STATUSES),
  dueDate: faker.date.future(),
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
  ...override,
})
