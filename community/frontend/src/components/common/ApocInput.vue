<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import type { PropType } from 'vue';

export default defineComponent({
  name: 'ApocInput',
  props: {
    placeholder: {
      type: String as PropType<string>,
    },
    modelValue: {
      type: (String || Number) as PropType<string | number>,
      required: true,
      default: null,
    },
    readOnly: {
      type: Boolean as PropType<boolean>,
      required: false,
      default: false,
    },
    disabled: {
      type: Boolean as PropType<boolean>,
      required: false,
      default: false,
    },
    type: {
      type: String as PropType<string>,
      required: false,
      default: 'text',
    },
    //enter 후 값 초기화에 대대한 props
    init: {
      type: Boolean as PropType<boolean>,
      required: false,
      default: false,
    },
    //enter 후 focus 사용 여부에 대한 props
    focus: {
      type: Boolean as PropType<boolean>,
      required: false,
      default: false,
    },
  },
  emits: ['update', 'enter', 'blur'],
  setup(props, ctx) {
    // const inputValue = ref<string>((props.modelValue as string) || '');
    const inputValue = computed(() => props.modelValue as string);
    const inputElement = ref<HTMLInputElement | undefined>();
    const handleKeyup = (e: KeyboardEvent) => {
      ctx.emit('update', (e.target as HTMLInputElement).value);
      if (e.code === 'Enter') {
        e.preventDefault();
        (e.target as HTMLInputElement).blur();
        ctx.emit('enter', (e.target as HTMLInputElement).value);
        if (props.init) {
          (e.target as HTMLInputElement).value = '';
        }
        if (props.focus && inputElement.value) {
          (inputElement.value as HTMLInputElement).focus();
        }
      }
    };

    const handleBlur = (e: FocusEvent) => {
      ctx.emit('blur', (e.target as HTMLInputElement).value);
    };
    return {
      inputValue,
      inputElement,
      handleKeyup,
      handleBlur,
    };
  },
});
</script>

<template>
  <div class="apoc-input">
    <input
      ref="inputElement"
      v-model="inputValue"
      :type="type"
      :readonly="readOnly"
      :placeholder="placeholder"
      :disabled="disabled"
      @keyup="handleKeyup"
      @blur="handleBlur" />
  </div>
</template>

<style scoped></style>
