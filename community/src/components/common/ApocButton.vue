<script lang="ts">
import { defineComponent, ref } from 'vue';
import type { PropType } from 'vue';

export default defineComponent({
  name: 'ApocButton',
  props: {
    disabled: {
      type: Boolean as PropType<boolean>,
      required: false,
      default: false,
    },
    type: {
      type: String as PropType<'button' | 'submit' | 'reset' | undefined>,
      default: 'button',
    },
  },
  setup(props) {
    const isDisabled = ref<boolean>(props.disabled);

    return {
      isDisabled,
    };
  },
});
</script>

<template>
  <div class="apoc-button">
    <button :type="type" :disabled="isDisabled"><slot></slot></button>
  </div>
</template>

<style scoped></style>
