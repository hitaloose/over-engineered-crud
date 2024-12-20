import { resolve } from 'path'

import { addAliases } from 'module-alias'

addAliases({
  '@': resolve(__dirname, '..', '..'),
})
