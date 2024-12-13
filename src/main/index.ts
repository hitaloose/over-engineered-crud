import 'reflect-metadata'
// eslint-disable-next-line no-restricted-imports
import './setup-alias'

import { dataSource } from '@/infra/libs/typeorm/config'
import { server } from '@/main/http/server'

const main = async () => {
  await dataSource.initialize()

  server.listen(3333, () => {
    console.log('server running on 3333')
  })
}

main()
