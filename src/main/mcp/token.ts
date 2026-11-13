// eslint-disable-next-line no-restricted-imports -- the `@` alias only exists after boot runs
import '../boot'

import { parseArgs } from 'node:util'

import { dataSource } from '@/infra/libs/typeorm/config'
import { factoryLoginUsecase } from '@/main/factories/usecases/factory-auth-usecases'

/** Logs in with an existing account and prints a JWT to use as MCP_ACCESS_TOKEN. */
const main = async () => {
  const { values } = parseArgs({ options: { email: { type: 'string' }, password: { type: 'string' } } })

  if (!values.email || !values.password) {
    throw new Error('usage: npm run mcp:token -- --email <email> --password <password>')
  }

  await dataSource.initialize()

  const { token } = await factoryLoginUsecase().run({ email: values.email, password: values.password })

  console.log(token)

  await dataSource.destroy()
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
