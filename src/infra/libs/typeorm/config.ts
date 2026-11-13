import { DataSource, DataSourceOptions } from 'typeorm'

import { TaskTypeorm } from '@/infra/libs/typeorm/entities/task-typeorm'
import { UserTypeorm } from '@/infra/libs/typeorm/entities/user-typeorm'
import { CreateUser1731456000000 } from '@/infra/libs/typeorm/migrations/1731456000000-create-user'
import { CreateTask1731456000001 } from '@/infra/libs/typeorm/migrations/1731456000001-create-task'
import { configs } from '@/main/configs'

const common = {
  entities: [UserTypeorm, TaskTypeorm],
  migrations: [CreateUser1731456000000, CreateTask1731456000001],
  migrationsRun: true,
  logging: false,
} satisfies Partial<DataSourceOptions>

const postgres: DataSourceOptions = {
  type: 'postgres',
  host: configs.DB_HOST,
  port: configs.DB_PORT,
  database: configs.DB_NAME,
  username: configs.DB_USER,
  password: configs.DB_PASSWORD,
}

const envs: Record<string, DataSourceOptions> = {
  development: postgres,
  production: postgres,
  test: {
    type: 'better-sqlite3',
    database: ':memory:',
  },
}

const getEnvs = () => envs[process.env.NODE_ENV || 'development'] || envs['development']

export const dataSource = new DataSource({
  ...common,
  ...getEnvs(),
} as DataSourceOptions)
