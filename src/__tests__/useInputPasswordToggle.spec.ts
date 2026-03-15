import { it, expect } from 'vitest'

import { useInputPasswordToggle } from '@/composables/useInputPasswordToggle'

it('toggles password visibility', () => {
  const { isPasswordShown, onTogglePassword } = useInputPasswordToggle()
  expect(isPasswordShown.value).toBe(false)
  onTogglePassword()
  expect(isPasswordShown.value).toBe(true)
})
