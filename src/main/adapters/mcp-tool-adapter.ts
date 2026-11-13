import { RequestHandlerExtra } from '@modelcontextprotocol/sdk/shared/protocol.js'
import { CallToolResult, ServerNotification, ServerRequest } from '@modelcontextprotocol/sdk/types.js'

import { Auth } from '@/domain/contracts/auth'
import { Controller } from '@/presentation/contracts/controller'
import { ControllerErrorHandlerDecorator } from '@/presentation/decorators/controller-error-handler-decorator'

export type McpRequestExtra = RequestHandlerExtra<ServerRequest, ServerNotification>

export type McpAuthResolver = (extra: McpRequestExtra) => Auth | undefined

export type McpArgsMapper<Args> = (args: Args) => Pick<Controller.Request, 'body' | 'params' | 'query'>

const defaultArgsMapper = <Args>(args: Args) => ({ body: (args ?? {}) as Record<string, unknown> })

/** Dates and other non-JSON values become plain JSON, which is what MCP clients receive anyway. */
const toJson = (value: Record<string, unknown>) => JSON.parse(JSON.stringify(value)) as Record<string, unknown>

export const controllerResponseToToolResult = ({ statusCode, body }: Controller.Response): CallToolResult => {
  const payload = toJson(body ?? { success: true })

  return {
    content: [{ type: 'text', text: JSON.stringify(payload, null, 2) }],
    structuredContent: payload,
    isError: statusCode >= 400,
  }
}

/**
 * Same role as `expressControllerAdapter`, for a different driver:
 * turns a presentation-layer Controller into an MCP tool callback.
 */
export const mcpToolAdapter = <Args>(controller: Controller, resolveAuth: McpAuthResolver, mapArgs: McpArgsMapper<Args> = defaultArgsMapper) => {
  const decoratedController = new ControllerErrorHandlerDecorator(controller)

  return async (args: Args, extra: McpRequestExtra): Promise<CallToolResult> => {
    const response = await decoratedController.handle({ ...mapArgs(args), auth: resolveAuth(extra) })

    return controllerResponseToToolResult(response)
  }
}
