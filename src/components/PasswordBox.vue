<script setup lang="ts">
import { ref, computed } from 'vue'
import DynInput from '@/components/DynInput.vue'
import DynInputPasswordToggle from '@/components/DynInputPasswordToggle.vue'
import DynButton from '@/components/DynButton.vue'
import DynTitle from '@/components/DynTitle.vue'
import { usePasswordChange, validatePassword } from '@/composables/usePasswordChange'

const step = ref(1)

const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

const currentRef = ref<typeof DynInput>()
const newRef = ref<typeof DynInput>()
const confirmRef = ref<typeof DynInput>()

// const test = ref('')

const { changePassword, loading, error, success } = usePasswordChange()

const passwordRules = computed(() => validatePassword(newPassword.value, confirmPassword.value))

const canSubmit = computed(() => {
  return (
    Object.values(passwordRules.value).every(Boolean) && newPassword.value === confirmPassword.value
  )
})

function handleSubmit() {
  changePassword(currentPassword.value, newPassword.value).then(() => {
    if (success.value) step.value = 3
  })
}

function resetForm() {
  currentPassword.value = ''
  newPassword.value = ''
  confirmPassword.value = ''
  step.value = 1
}
</script>

<template>
  <div class="flex justify-center items-center h-full">
    <div class="max-w-lg p-6 rounded space-y-4 bg-white/25 w-full min-w-2xl text-white">
      <div v-if="step === 1" class="">
        <DynTitle level="h2" class="mb-6">Passwort</DynTitle>
        <DynButton @click="step = 2">Ändern</DynButton>
      </div>

      <div v-if="step === 2">
        <DynTitle level="h2" class="mb-4">Passwort ändern</DynTitle>
        <div class="flex space-x-2">
          <DynInput
            v-model="currentPassword"
            label="Aktuelles Passwort"
            name="currentPassword"
            type="password"
            ref="currentRef"
            class="flex-1"
          >
            <template #append>
              <DynInputPasswordToggle :targetRef="currentRef" />
            </template>
          </DynInput>

          <!-- <DynInput v-model="test" name="test" label="Test Input" /> -->

          <div class="flex-1 mt-2 flex items-center">
            <DynButton @click="console.log('Passwort vergessen')" variant="ghost"
              >Passwort vergessen</DynButton
            >
          </div>
        </div>
        <div class="flex mt-4 space-x-2">
          <DynInput
            v-model="newPassword"
            label="Neues Passwort"
            name="newPassword"
            type="password"
            ref="newRef"
            class="flex-1"
          >
            <template #append>
              <DynInputPasswordToggle :targetRef="newRef" />
            </template>
          </DynInput>

          <DynInput
            v-model="confirmPassword"
            label="Neues Passwort bestätigen"
            name="confirmPassword"
            type="password"
            ref="confirmRef"
            class="flex-1"
          >
            <template #append>
              <DynInputPasswordToggle :targetRef="confirmRef" />
            </template>
          </DynInput>
        </div>

        <div class="text-sm my-2 text-blue-twilight">
          <p class="mb-2"><b>Muss enthalten:</b></p>
          <p :class="passwordRules.length ? 'text-green-success' : 'text-blue-twilight'">
            mindestens 12 Zeichen
          </p>
          <p :class="passwordRules.number ? 'text-green-success' : 'text-blue-twilight'">
            mindestens 1 Zahl
          </p>
          <p :class="passwordRules.special ? 'text-green-success' : 'text-blue-twilight'">
            mindestens 1 Sonderzeichen
          </p>
          <p :class="passwordRules.uppercase ? 'text-green-success' : 'text-blue-twilight'">
            mindestens 1 Großbuchstabe
          </p>
          <p :class="passwordRules.lowercase ? 'text-green-success' : 'text-blue-twilight'">
            mindestens 1 Kleinbuchstabe
          </p>
          <p :class="passwordRules.confirmation ? 'text-green-success' : 'text-blue-twilight'">
            Passwörter stimmen überein
          </p>
        </div>

        <div class="flex justify-between items-center mt-4 space-x-2">
          <DynButton @click="resetForm" variant="secondary" class="flex-1">Abbrechen</DynButton>
          <DynButton
            :disabled="!canSubmit || loading"
            @click="handleSubmit"
            variant="primary"
            class="flex-1"
          >
            <span v-if="loading">Speichern...</span>
            <span v-else>Änderungen speichern</span>
          </DynButton>
        </div>

        <p v-if="error" class="text-red-500 mt-2" aria-live="polite">{{ error }}</p>
      </div>

      <div v-if="step === 3" class="text-center">
        <h2 class="text-xl font-bold mb-2">Passwort ändern</h2>
        <p class="text-green-success flex items-center justify-center space-x-2">
          <svg class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M12 0a12 12 0 1 0 12 12A12.014 12.014 0 0 0 12 0zm-1 17l-5-5 1.414-1.414L11 14.172l7.586-7.586L20 8l-9 9z"
            />
          </svg>
          <span>Code versendet!</span>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
