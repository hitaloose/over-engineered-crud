// eslint-disable-next-line no-restricted-imports -- the `@` alias only exists after boot runs
import '../boot'

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'

import { dataSource } from '@/infra/libs/typeorm/config'
import { configs } from '@/main/configs'
import { factoryAuthenticateUsecase } from '@/main/factories/usecases/factory-auth-usecases'
import { createMcpServer } from '@/main/mcp/server'

// stdout is the MCP channel: anything else must go to stderr.
const main = async () => {
  if (!configs.MCP_ACCESS_TOKEN) {
    throw new Error('MCP_ACCESS_TOKEN is required for the stdio server (generate one with `npm run mcp:token`)')
  }

  const auth = await factoryAuthenticateUsecase().run({ token: configs.MCP_ACCESS_TOKEN })

  await dataSource.initialize()

  const server = createMcpServer({ resolveAuth: () => auth })
  await server.connect(new StdioServerTransport())

  console.error(`[mcp] stdio server ready for user ${auth.userId}`)
}

main().catch((error) => {
  console.error('[mcp] failed to start:', error instanceof Error ? error.message : error)
  process.exit(1)
})
