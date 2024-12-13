import { DataSource } from 'typeorm'

import { UserTypeorm } from '@/infra/libs/typeorm/entities/user-typeorm'

export const dataSource = new DataSource({
  type: 'sqlite',
  database: 'test',
  entities: [UserTypeorm],
  synchronize: true,
  logging: false,
})
