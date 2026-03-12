import { ref } from 'vue'

export function usePasswordChange() {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const success = ref(false)

  async function changePassword(current: string, next: string) {
    loading.value = true
    error.value = null
    success.value = false

    const payload = { current, next }

    try {
      const res = await fetch('/mock/password.json', {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await res.json()
      success.value = data.success
    } catch (err: any) {
      error.value = err.message || 'Fehler beim Ändern des Passworts'
      success.value = false
    }
  }

  return { changePassword, loading, error, success }
}

export function validatePassword(password: string, confirmPassword: string) {
  return {
    length: password.length >= 12,
    number: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    confirmation:
      password.length >= 12 && confirmPassword.length >= 12 && password === confirmPassword,
  }
}
