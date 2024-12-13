import cors from 'cors'
import express, { json } from 'express'

import { routes } from '@/main/http/routes'

export const server = express()

server.use(json())
server.use(cors())

server.use(routes)
