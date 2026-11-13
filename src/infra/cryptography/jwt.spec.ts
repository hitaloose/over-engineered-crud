import { faker } from '@faker-js/faker'
import { describe, expect, it, vitest } from 'vitest'

import { Jwt } from '@/infra/cryptography/jwt'

describe('Jwt', () => {
  it('should decode a token it encoded', async () => {
    const sut = new Jwt('secret')
    const sub = faker.string.uuid()

    const token = await sut.encode({ sub })
    const payload = await sut.decode(token)

    expect(payload?.sub).toBe(sub)
  })

  it('should return undefined for a token signed with another secret', async () => {
    const token = await new Jwt('other-secret').encode({ sub: faker.string.uuid() })

    const payload = await new Jwt('secret').decode(token)

    expect(payload).toBeUndefined()
  })

  it('should return undefined for garbage', async () => {
    expect(await new Jwt('secret').decode('not-a-token')).toBeUndefined()
  })

  it('should return undefined for an expired token', async () => {
    vitest.useFakeTimers()
    try {
      const sut = new Jwt('secret', '1h')
      const token = await sut.encode({ sub: faker.string.uuid() })

      vitest.advanceTimersByTime(2 * 60 * 60 * 1000)

      expect(await sut.decode(token)).toBeUndefined()
    } finally {
      vitest.useRealTimers()
    }
  })
})
