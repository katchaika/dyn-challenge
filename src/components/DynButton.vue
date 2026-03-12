<script lang="ts">
import { computed, defineComponent } from 'vue'
import type { PropType } from 'vue'

export default defineComponent({
  name: 'DynButton',

  props: {
    variant: {
      type: String as PropType<'primary' | 'secondary' | 'ghost'>,
      default: 'primary',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String as PropType<'button' | 'submit' | 'reset'>,
      default: 'button',
    },
  },

  setup(props) {
    const classes = computed(() => {
      const base =
        'inline-flex items-center justify-center rounded py-2 text-md font-semibold transition focus:outline-none cursor-pointer font-bebas uppercase tracking-widest'

      const variants = {
        primary:
          'bg-blue-highlight text-blue-basic h-12 px-4 hover:bg-blue-active disabled:bg-blue-highlight disabled:opacity-25 disabled:cursor-default',
        secondary:
          'border border-blue-highlight h-12 px-4 text-blue-highlight hover:bg-blue-highlight hover:text-blue-basic',
        ghost: 'text-blue-highlight hover:underline hover:text-blue-active',
      }

      return [base, variants[props.variant]]
    })

    return { classes }
  },
})
</script>

<template>
  <button :type="type" :disabled="disabled || loading" :class="classes">
    <span v-if="loading" class="animate-pulse"> Speichern... </span>

    <slot v-else />
  </button>
</template>
