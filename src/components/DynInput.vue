<template>
  <div class="relative">
    <div class="relative mt-2 flex w-full shrink-0 flex-col-reverse text-left">
      <input
        v-model="computedModelValue"
        v-bind="computedProps"
        class="peer max-h-12 w-full appearance-none rounded-lg border bg-blue-xxx-24 px-4 pt-[15px] pb-3.5 leading-none outline-none placeholder:text-gray placeholder:opacity-0 placeholder:transition-opacity enabled:focus:ring-0 enabled:focus:placeholder:opacity-100"
        :class="[
          invalid
            ? 'border-red-alert text-red-alert enabled:border-red-alert enabled:hover:border-red-alert enabled:hover:ring-1 enabled:hover:ring-red-alert enabled:focus:border-red-alert enabled:focus:ring-1 enabled:focus:ring-red-alert'
            : disabled
              ? 'text-gray'
              : 'text-white enabled:hover:text-blue-active enabled:[&:not(readonly)]:border-transparent  enabled:[&:not(readonly)]:focus:border-blue-active',
          $slots.append ? 'pr-12' : '',
        ]"
        :id="computedId"
        ref="inputRef"
        @blur="$emit('blur', $event)"
        @focus="$emit('focus', $event)"
        @keydown="$emit('keydown', $event)"
        @keypress="$emit('keypress', $event)"
        @keyup="$emit('keyup', $event)"
      />
      <label
        class="absolute origin-top-left translate-x-4 -translate-y-3.5 leading-5 transition-transform duration-200 ease-out peer-hover:text-blue-active peer-disabled:text-gray motion-reduce:transition-none"
        :class="[invalid ? 'text-red-alert' : disabled ? 'text-gray' : 'text-gray-90']"
        :for="computedId"
      >
        {{ label }}
      </label>
      <span v-if="$slots.append" class="absolute top-0 bottom-0 right-0 z-10 w-14">
        <slot name="append" :disabled="disabled" :invalid="invalid" :readonly="readonly" />
      </span>
    </div>
    <p v-if="invalid" class="text-red-alert text-sm mt-1">
      {{ errorText }}
    </p>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import type { PropType } from 'vue'
import { useFocus } from '@/composables/useInputFocus'
import { useInputPasswordToggle } from '@/composables/useInputPasswordToggle'

export default defineComponent({
  name: 'DynInput',
  props: {
    autocomplete: {
      type: String,
      default: undefined,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    id: {
      type: String,
      default: undefined,
    },
    inputmode: {
      type: String as PropType<'none' | 'text' | undefined>,
      default: undefined,
      validator: (value: string) => ['none', 'text', undefined].includes(value),
    },
    invalid: {
      type: Boolean,
      default: false,
    },
    errorText: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      required: true,
    },
    maxlength: {
      type: Number,
      default: undefined,
    },
    minlength: {
      type: Number,
      default: undefined,
    },
    modelValue: {
      type: [String, Number],
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    placeholder: {
      type: String,
      default: '\u200B',
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    required: {
      type: Boolean,
      default: false,
    },
    tabindex: {
      type: Number,
      default: undefined,
    },
    type: {
      type: String,
      default: 'text',
      validator: (value: string) => ['password', 'text'].includes(value),
    },
  },
  setup(props, { emit }) {
    const { elementRef: inputRef, focus } = useFocus<HTMLInputElement>()
    const { internalPasswordType, isPasswordShown, onTogglePassword } = useInputPasswordToggle()

    const internalType = computed(() =>
      typeof internalPasswordType.value === 'string' ? internalPasswordType.value : props.type,
    )

    const computedId = computed(() => props.id || props.name)

    const computedModelValue = computed({
      get() {
        return props.modelValue
      },
      set(value: string | number) {
        emit('update:modelValue', value)
      },
    })

    // NOTE: computedProps returns dynamic attributes to attach
    // to the HTMLInputElement.
    // For example, input[type="number"] can have max and min attributes,
    // but for input[type="text"] those are not valid.
    // So we use the type prop to distinguish which props to bind.
    const computedProps = computed(() => {
      // defaults refers to a set of attributes which are valid
      // _for all_ input types.
      const defaults = {
        autocomplete: props.autocomplete,
        disabled: props.disabled,
        id: computedId.value,
        inputmode: props.inputmode,
        maxlength: props.maxlength,
        minlength: props.minlength,
        name: props.name,
        placeholder: props.placeholder,
        readonly: props.readonly,
        required: props.required,
        tabindex: props.tabindex,
        type: internalType.value,
      }

      switch (props.type) {
        case 'password':
        case 'text':
        default:
          return defaults
      }
    })

    return {
      computedId,
      computedModelValue,
      computedProps,
      focus,
      inputRef,
      isPasswordShown,
      onTogglePassword,
    }
  },
  emits: ['blur', 'focus', 'input', 'keydown', 'keypress', 'keyup', 'update:modelValue'],
})
</script>

<style scoped>
@reference "@/assets/main.css";
label,
input {
  @apply touch-manipulation;
}

input:placeholder-shown ~ label {
  @apply pointer-events-none cursor-text text-ellipsis whitespace-nowrap;
  max-width: 66.66%;
}

::placeholder {
  opacity: 0;
  transition: inherit;
}

input:focus::placeholder {
  opacity: 1;
}

input:not(:placeholder-shown) ~ label,
input:focus ~ label {
  @apply pointer-events-none translate-x-3 -translate-y-9 scale-75 cursor-pointer rounded-t bg-blue-xxx-24 px-2 pt-0.5;
}

input:hover ~ label,
input:focus ~ label {
  @apply rounded-t bg-blue-xxx-24 pt-0.5;
}
</style>
