import { ref } from 'vue'

export function usePasswordChange() {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const success = ref(false)

  async function changePassword(currentPassword: string, newPassword: string) {
    loading.value = true
    error.value = null
    success.value = false

    const payload = { currentPassword, newPassword }

    try {
      const res = await fetch('/mock/password.json', {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await res.json()

      // waiting imitation
      await new Promise((r) => setTimeout(r, 1000))

      success.value = data.success
    } catch (err: any) {
      error.value = err.message || 'Fehler beim Ändern des Passworts'
      success.value = false
    } finally {
      loading.value = false
    }
  }

  return { changePassword, loading, error, success }
}

export function validatePassword(newPassword: string) {
  return {
    length: newPassword.length >= 12,
    number: /\d/.test(newPassword),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
    uppercase: /[A-Z]/.test(newPassword),
    lowercase: /[a-z]/.test(newPassword),
  }
}
