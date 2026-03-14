<template>
  <button
    v-if="isVisible"
    class="flex h-full w-full flex-col items-center justify-center text-white outline-none hover:text-blue-light focus:text-blue-light disabled:text-gray cursor-pointer"
    :disabled="isDisabled"
    type="button"
    @click="toggle"
  >
    <IconEyeClosed v-if="isPasswordShown" class="w-6" aria-hidden="true" />
    <IconEyeOpen v-else class="w-6" aria-hidden="true" />
  </button>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import type { PropType } from 'vue'
import { IconEyeOpen, IconEyeClosed } from '@/components/icons'
import DynInput from './DynInput.vue'

/**
 * Usage:
 *
 * <DynInput
 *   …
 *   ref="inputRef"
 * >
 *   <template #append>
 *     <DynInputPasswordToggle :targetRef="inputRef" />
 *   </template>
 * </DynInput>
 */
export default defineComponent({
  name: 'DynInputPasswordToggle',
  components: {
    IconEyeOpen,
    IconEyeClosed,
  },
  props: {
    targetRef: {
      type: Object as PropType<typeof DynInput>,
      default: undefined,
    },
  },
  setup(props) {
    const isDisabled = computed(() => props.targetRef && props.targetRef.disabled)

    const isPasswordShown = computed(() => props.targetRef && props.targetRef.isPasswordShown)

    const isVisible = computed(
      () => props.targetRef && props.targetRef.type === 'password' && !props.targetRef.readonly,
    )

    const toggle = () => {
      if (props.targetRef) {
        props.targetRef.onTogglePassword()
        props.targetRef.focus()
      }
    }

    return { isDisabled, isVisible, isPasswordShown, toggle }
  },
})
</script>
