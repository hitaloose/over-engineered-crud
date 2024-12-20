import { DataSource, DataSourceOptions } from 'typeorm'

import { UserTypeorm } from '@/infra/libs/typeorm/entities/user-typeorm'
import { configs } from '@/main/configs'

const common: Partial<DataSourceOptions> = {
  entities: [UserTypeorm],
  logging: false,
}

const envs: Record<string, DataSourceOptions> = {
  development: {
    type: 'postgres',
    host: configs.DB_HOST,
    port: configs.DB_PORT,
    database: configs.DB_NAME,
    username: configs.DB_USER,
    password: configs.DB_PASSWORD,
  },
  test: {
    type: 'sqlite',
    database: './test.db',
    synchronize: true,
  },
  production: {
    type: 'postgres',
    host: configs.DB_HOST,
    port: configs.DB_PORT,
    database: configs.DB_NAME,
    username: configs.DB_USER,
    password: configs.DB_PASSWORD,
  },
}

const getEnvs = () => {
  if (!process.env.NODE_ENV) {
    return envs['development']
  }

  return envs[process.env.NODE_ENV] || envs['development']
}

export const dataSource = new DataSource({
  ...common,
  ...getEnvs(),
} as DataSourceOptions)
