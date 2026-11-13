// PostToolUse hook: auto-fix lint/format on TypeScript files Claude edits under src/.
import { spawnSync } from 'node:child_process'

let input = ''
process.stdin.on('data', (chunk) => (input += chunk))
process.stdin.on('end', () => {
  const filePath = JSON.parse(input || '{}').tool_input?.file_path ?? ''

  if (/\/src\/.+\.ts$/.test(filePath)) {
    spawnSync('npx', ['eslint', '--fix', filePath], { stdio: 'ignore' })
  }
})
