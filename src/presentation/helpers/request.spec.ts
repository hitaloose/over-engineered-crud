import { describe, expect, it } from 'vitest'

import { UnauthorizedError } from '@/domain/errors/unauthorized-error'
import { requestInput, requireAuth } from '@/presentation/helpers/request'

describe('requestInput', () => {
  it('should merge query, body and params with precedence params > body > query', () => {
    const input = requestInput({
      query: { id: 'query', page: '2' },
      body: { id: 'body', title: 't' },
      params: { id: 'params' },
    })

    expect(input).toEqual({ id: 'params', page: '2', title: 't' })
  })

  it('should work with only a body', () => {
    expect(requestInput({ body: { a: 1 } })).toEqual({ a: 1 })
  })
})

describe('requireAuth', () => {
  it('should return the auth when present', () => {
    expect(requireAuth({ body: {}, auth: { userId: 'u1' } })).toEqual({ userId: 'u1' })
  })

  it('should throw UnauthorizedError when missing', () => {
    expect(() => requireAuth({ body: {} })).toThrow(UnauthorizedError)
  })
})
