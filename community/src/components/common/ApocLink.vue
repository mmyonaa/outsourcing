<script lang="ts">
import { defineComponent } from 'vue';
import type { PropType } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'ApocLink',
  props: {
    href: {
      type: String as PropType<string>,
      required: false,
      default: '#',
    },
    title: {
      type: String as PropType<string>,
    },
    onClick: {
      type: Function as PropType<() => void>,
      required: false,
    },
    disabled: {
      type: Boolean as PropType<boolean>,
      required: false,
      default: false,
    },
  },
  setup(props) {
    const router = useRouter();

    const handleClick = (e: Event) => {
      e.stopPropagation();
      if (props.onClick) {
        if (props.disabled) return;
        props.onClick();
      } else {
        router.push(props.href);
      }
    };
    return {
      handleClick,
    };
  },
});
</script>

<template>
  <a class="apoc-link" :href="href" v-on:click.prevent.stop="handleClick" :title="title"><slot></slot></a>
</template>

<style scoped></style>
