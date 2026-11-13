import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js'
import { Request, Response, Router } from 'express'

import { expressMiddlewareAdapter } from '@/main/adapters/express-middleware-adapter'
import { McpAuthResolver } from '@/main/adapters/mcp-tool-adapter'
import { factoryAuthMiddleware } from '@/main/factories/middlewares/factory-auth-middleware'
import { createMcpServer } from '@/main/mcp/server'

/** The bearer token is validated by the same AuthMiddleware the REST API uses; the resulting userId travels in authInfo. */
const resolveAuthFromAuthInfo: McpAuthResolver = (extra) => {
  const userId = extra.authInfo?.extra?.userId

  return typeof userId === 'string' ? { userId } : undefined
}

const handleMcpRequest = async (request: Request, response: Response) => {
  const server = createMcpServer({ resolveAuth: resolveAuthFromAuthInfo })
  // Stateless mode: one transport per request, no session to keep around.
  const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined, enableJsonResponse: true })

  response.on('close', () => {
    transport.close()
    server.close()
  })

  const { userId } = response.locals.auth
  const authorizedRequest = Object.assign(request, {
    auth: { token: request.headers.authorization?.split(' ')[1] ?? '', clientId: userId, scopes: [], extra: { userId } },
  })

  await server.connect(transport)
  await transport.handleRequest(authorizedRequest, response, request.body)
}

const methodNotAllowed = (_request: Request, response: Response) => {
  response.status(405).json({ jsonrpc: '2.0', error: { code: -32000, message: 'Method not allowed.' }, id: null })
}

export const mcpRouter = Router()

mcpRouter.post('/mcp', expressMiddlewareAdapter(factoryAuthMiddleware()), handleMcpRequest)
mcpRouter.get('/mcp', methodNotAllowed)
mcpRouter.delete('/mcp', methodNotAllowed)
