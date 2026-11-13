import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { CallToolResult, ToolAnnotations } from '@modelcontextprotocol/sdk/types.js'
import { ZodRawShape } from 'zod'

import { McpAuthResolver, McpRequestExtra, mcpToolAdapter } from '@/main/adapters/mcp-tool-adapter'
import { McpTool, mcpTools } from '@/main/mcp/tools'

export type CreateMcpServerOptions = {
  resolveAuth: McpAuthResolver
  tools?: McpTool[]
}

type RegisterTool = (
  name: string,
  config: { title: string; description: string; inputSchema: ZodRawShape; annotations: ToolAnnotations },
  callback: (args: Record<string, unknown>, extra: McpRequestExtra) => Promise<CallToolResult>
) => void

export const createMcpServer = ({ resolveAuth, tools = mcpTools }: CreateMcpServerOptions) => {
  const server = new McpServer(
    { name: 'over-engineered-crud', version: '1.0.0' },
    { instructions: 'Manage the authenticated user tasks. Use list_tasks to discover task ids before get/update/complete/delete.' }
  )

  // The SDK's generic signature infers per-schema arg types; our catalog is heterogeneous, so we register through a plain signature.
  const registerTool = server.registerTool.bind(server) as unknown as RegisterTool

  for (const tool of tools) {
    registerTool(
      tool.name,
      { title: tool.title, description: tool.description, inputSchema: tool.inputSchema, annotations: tool.annotations },
      mcpToolAdapter(tool.controller(), resolveAuth, tool.mapArgs)
    )
  }

  return server
}
