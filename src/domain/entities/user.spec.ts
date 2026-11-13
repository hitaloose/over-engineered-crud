import { describe, expect, it } from 'vitest'

import { toPublicUser } from '@/domain/entities/user'
import { mockUser } from '@/domain/mocks/user.mock'

describe('toPublicUser', () => {
  it('should drop the password hash and keep everything else', () => {
    const { hashedPassword, ...rest } = mockUser()

    expect(toPublicUser({ ...rest, hashedPassword })).toEqual(rest)
  })

  it('should not leak extra properties an ORM entity may carry', () => {
    const entity = Object.assign(mockUser(), { internalFlag: true })

    expect(toPublicUser(entity)).not.toHaveProperty('internalFlag')
  })
})
