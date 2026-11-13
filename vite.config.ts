import path from 'path'

import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    env: {
      NODE_ENV: 'test',
      API_PORT: '0',
      BCRYPT_SALTS: '1',
      JWT_SECRET: 'test-secret',
      MCP_ENABLED: 'true',
    },
  },
})
