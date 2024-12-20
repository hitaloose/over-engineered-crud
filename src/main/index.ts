import './boot'

import { dataSource } from '@/infra/libs/typeorm/config'
import { configs } from '@/main/configs'
import { server } from '@/main/http/server'

const main = async () => {
  await dataSource.initialize()

  server.listen(configs.API_PORT, () => {
    console.log(`server running on ${configs.API_PORT}`)
  })
}

main()
