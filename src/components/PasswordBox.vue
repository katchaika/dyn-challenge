<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'

import DynInput from '@/components/DynInput.vue'
import DynInputPasswordToggle from '@/components/DynInputPasswordToggle.vue'
import DynButton from '@/components/DynButton.vue'
import DynTitle from '@/components/DynTitle.vue'
import { usePasswordChange, validatePassword } from '@/composables/usePasswordChange'
import { IconMailing } from '@/components/icons'

const step = ref(1)

const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

const currentRef = ref<typeof DynInput>()
const newRef = ref<typeof DynInput>()
const confirmRef = ref<typeof DynInput>()

const currentError = ref('')
const confirmError = ref('')

const goToSecondStep = async () => {
  step.value = 2
  await nextTick()
  currentRef.value?.focus()
}

const { changePassword, loading, error, success } = usePasswordChange()

const passwordRules = computed(() => validatePassword(newPassword.value))

const canSubmit = computed(() => {
  return Object.values(passwordRules.value).every(Boolean)
})

function handleSubmit() {
  currentError.value = ''
  confirmError.value = ''

  let hasError = false

  if (!currentPassword.value) {
    currentError.value = 'Bitte aktuelles Passwort eingeben'
    hasError = true
  }

  if (newPassword.value !== confirmPassword.value) {
    confirmError.value = 'Passwörter stimmen nicht überein'
    hasError = true
  }

  if (hasError) return

  changePassword(currentPassword.value, newPassword.value).then(() => {
    if (success.value) step.value = 3
  })
}

function resetForm() {
  currentPassword.value = ''
  newPassword.value = ''
  confirmPassword.value = ''
  currentError.value = ''
  confirmError.value = ''
  step.value = 1
}
</script>

<template>
  <div class="flex justify-center items-center h-full w-full">
    <div class="max-w-lg p-6 rounded-sm gap-y-4 bg-white/25 w-full sm:min-w-2xl text-white">
      <div v-if="step === 1">
        <DynTitle level="h2" class="mb-6">Passwort</DynTitle>
        <button @click="goToSecondStep" class="bt bt-primary w-20" type="button">Ändern</button>
      </div>

      <div v-if="step === 2">
        <DynTitle level="h2" class="mb-4">Passwort ändern</DynTitle>
        <div class="flex sm:gap-x-2 flex-col sm:flex-row">
          <DynInput
            v-model="currentPassword"
            label="Aktuelles Passwort"
            name="currentPassword"
            type="password"
            ref="currentRef"
            class="flex-1"
            :invalid="!!currentError"
            :errorText="currentError"
          >
            <template #append>
              <DynInputPasswordToggle :targetRef="currentRef" />
            </template>
          </DynInput>

          <div class="flex-1 mt-4" :disabled="true">
            <!-- my commponent -->
            <DynButton @click="console.log('Passwort vergessen')" variant="ghost"
              >Passwort vergessen</DynButton
            >
          </div>
        </div>

        <div class="flex mt-4 sm:gap-2 flex-col sm:flex-row">
          <div class="flex-1">
            <DynInput
              v-model="newPassword"
              label="Neues Passwort"
              name="newPassword"
              type="password"
              ref="newRef"
            >
              <template #append>
                <DynInputPasswordToggle :targetRef="newRef" />
              </template>
            </DynInput>

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
            </div>
          </div>
          <div class="flex-1">
            <DynInput
              v-model="confirmPassword"
              label="Neues Passwort bestätigen"
              name="confirmPassword"
              type="password"
              ref="confirmRef"
              :invalid="!!confirmError"
              :errorText="confirmError"
            >
              <template #append>
                <DynInputPasswordToggle :targetRef="confirmRef" />
              </template>
            </DynInput>
          </div>
        </div>

        <div class="flex justify-between items-center mt-6 gap-x-2">
          <button @click="resetForm" class="bt bt-secondary flex-1" type="button">Abbrechen</button>
          <button
            class="bt bt-primary flex-1"
            type="button"
            :disabled="!canSubmit || loading"
            @click="handleSubmit"
          >
            <span v-if="loading">Speichern...</span>
            <span v-else>Änderungen speichern</span>
          </button>
        </div>

        <p v-if="error" class="text-red-500 mt-2" aria-live="polite">{{ error }}</p>
      </div>

      <div v-if="step === 3">
        <DynTitle level="h2" class="mb-4">Passwort ändern</DynTitle>
        <div class="flex gap-4">
          <div>
            <IconMailing class="w-16 sm:w-18" />
          </div>
          <div>
            <p class="mt-1 mb-4 tracking-wider font-oswald font-thin text-xl">Code versendet!</p>
            <p class="text-sm sm:text-base">
              <span class="text-white/50"
                >Wir haben dir eine E-mail zum Zurüccksetzen deines Passwortes an
              </span>
              <b>Max.Mustermann@hotline.de </b><span class="text-white/50">geschickt.</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
