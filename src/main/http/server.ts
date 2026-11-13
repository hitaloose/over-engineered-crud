import cors from 'cors'
import express, { json } from 'express'

import { configs } from '@/main/configs'
import { routes } from '@/main/http/routes'
import { mcpRouter } from '@/main/mcp/http'

export const server = express()

server.use(json())
server.use(cors({ exposedHeaders: ['Mcp-Session-Id'] }))

server.use(routes)

if (configs.MCP_ENABLED) {
  server.use(mcpRouter)
}
