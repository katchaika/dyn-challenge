import { computed, getCurrentInstance, ref } from 'vue'

/**
 * @internal
 *
 * `useInternalDynInputPasswordToggle` is an internal composable for toggling
 * the visibility of a password in a `DynInput` of `type="password"`.
 *
 * You can make us of it like this in your app:
 *
 * @example
 * ```
 * <template>
 *   <DynInput
 *     ref="passwordRef"
 *     type="password"
 *     …
 *   >
 *     <template #append>
 *       <DynInputPasswordToggle :targetRef="passwordRef" />
 *     </template>
 *   </DynInput>
 * </template>
 *
 * <script setup>
 *   const passwordRef = ref<typeof DynInput>()
 * </script>
 * ```
 *
 * To call the `focus` method from outside of your component, do this:
 *
 */
export const useInputPasswordToggle = () => {
  const instance = getCurrentInstance()
  const isPasswordShown = ref(false)

  const internalPasswordType = computed(() => {
    if (instance) {
      return instance.props.type === 'password'
        ? isPasswordShown.value
          ? 'text'
          : instance.props.type
        : instance.props.type
    }

    return undefined
  })

  const onTogglePassword = () => {
    isPasswordShown.value = !isPasswordShown.value
  }

  return { internalPasswordType, isPasswordShown, onTogglePassword }
}
