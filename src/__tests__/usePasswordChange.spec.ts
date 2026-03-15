import { describe, it, expect, vi, beforeEach } from 'vitest'

import { usePasswordChange, validatePassword } from '../composables/usePasswordChange'

describe('usePasswordChange', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('sets success when API returns success', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ success: true }),
      }),
    ) as any

    const { changePassword, success, error } = usePasswordChange()

    await changePassword('currentPassword', 'NewPassword123!')

    expect(success.value).toBe(true)
    expect(error.value).toBe(null)
  })

  it('sets error when request fails', async () => {
    global.fetch = vi.fn(() => Promise.reject(new Error('Network error'))) as any

    const { changePassword, success, error } = usePasswordChange()

    await changePassword('currentPassword', 'NewPassword123!')

    expect(success.value).toBe(false)
    expect(error.value).toBe('Network error')
  })
})

describe('validatePassword', () => {
  it('validates correct password', () => {
    const result = validatePassword('Passwordpassword!1')
    expect(result.length).toBe(true)
    expect(result.number).toBe(true)
    expect(result.special).toBe(true)
    expect(result.uppercase).toBe(true)
    expect(result.lowercase).toBe(true)
  })

  it('missing numbers', () => {
    const result = validatePassword('Passwordpassword!')
    expect(result.number).toBe(false)
  })

  it('missing special symbol', () => {
    const result = validatePassword('Passwordpassword1')
    expect(result.special).toBe(false)
  })

  it('missing uppercase', () => {
    const result = validatePassword('passwordpassword!1')
    expect(result.uppercase).toBe(false)
  })

  it('missing lowercase', () => {
    const result = validatePassword('PASWORDPASSWORD!1')
    expect(result.lowercase).toBe(false)
  })

  it('short password', () => {
    const result = validatePassword('Password!1')
    expect(result.length).toBe(false)
  })
})
