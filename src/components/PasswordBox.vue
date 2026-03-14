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

// const test = ref('')

const goToSecondStep = async () => {
  step.value = 2
  await nextTick()
  currentRef.value?.focus()
}

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
        <DynButton @click="goToSecondStep">Ändern</DynButton>
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

        <!-- inline validation with “Change password” -->
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

      <div v-if="step === 3">
        <DynTitle level="h2" class="mb-4">Passwort ändern</DynTitle>
        <div class="flex space-x-4">
          <div>
            <IconMailing class="w-18" />
          </div>
          <div>
            <p class="mt-1 mb-4 tracking-wider font-oswald font-thin text-xl">Code versendet!</p>
            <p>
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

<style scoped></style>
