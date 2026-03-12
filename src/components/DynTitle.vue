<script lang="ts">
import { computed, defineComponent } from 'vue'
import type { PropType } from 'vue'

export default defineComponent({
  name: 'DynTitle',

  props: {
    level: {
      type: String as PropType<'h1' | 'h2' | 'h3' | 'h4'>,
      default: 'h2',
    },
    center: {
      type: Boolean,
      default: false,
    },
  },

  setup(props) {
    const tag = computed(() => props.level)

    const classes = computed(() => {
      const base = 'tracking-wide text-white font-oswald uppercase'

      const styles = {
        h1: 'text-5xl',
        h2: 'text-4xl',
        h3: 'text-3xl',
        h4: 'text-2xl',
      }

      return [base, styles[props.level], props.center ? 'text-center' : '']
    })

    return { tag, classes }
  },
})
</script>

<template>
  <component :is="tag" :class="classes">
    <slot />
  </component>
</template>
