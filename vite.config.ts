import path from 'path'

import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      // contracts/types have no runtime code; entrypoints are exercised by the e2e runs, not unit tests
      exclude: [
        'src/**/*.spec.ts',
        'src/**/mocks/**',
        'src/**/contracts/**',
        'src/domain/usecases/**',
        'src/main/boot/**',
        'src/main/index.ts',
        'src/main/mcp/stdio.ts',
        'src/main/mcp/token.ts',
      ],
      thresholds: { lines: 95, functions: 95, branches: 85, statements: 95 },
    },
    env: {
      NODE_ENV: 'test',
      API_PORT: '0',
      BCRYPT_SALTS: '1',
      JWT_SECRET: 'test-secret',
      MCP_ENABLED: 'true',
    },
  },
})
