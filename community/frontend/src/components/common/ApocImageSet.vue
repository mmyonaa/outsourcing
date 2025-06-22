<script lang="ts">
import { computed, defineComponent } from 'vue';
import type { PropType } from 'vue';

export default defineComponent({
  name: 'ApocImageSet',
  props: {
    src: {
      type: String as PropType<string>,
      required: true,
      default: '/assets/images/common/default-img.webp',
    },
    originSrc: {
      type: String as PropType<string>,
    },
    imgSets: {
      type: Number as PropType<number>,
      default: 1,
      required: false,
    },
    errorImg: {
      type: String as PropType<string>,
      required: false,
      default: '/assets/images/common/default-img.webp',
    },
    alt: {
      type: String as PropType<string>,
      required: false,
    },
  },
  setup(props) {
    const srcSet = computed(() => {
      let imgSrcSet = '';
      if (props.imgSets > 1) {
        const lastDotIndex = props.src.lastIndexOf('.');
        const fileName = props.src.substring(0, lastDotIndex);
        const ext = props.src.substring(lastDotIndex);
        imgSrcSet += `${fileName}@2x${ext} 2x`;
        if (props.imgSets > 2) {
          imgSrcSet += ` , ${fileName}@3x${ext} 3x`;
        }
      }
      return imgSrcSet;
    });
    const onError = (e: Event) => {
      if (e.currentTarget) {
        let currentTarget = e.currentTarget as HTMLImageElement;
        currentTarget.onerror = null;
        if (props.originSrc) currentTarget.src = props.originSrc;
        else currentTarget.src = props.errorImg;
      }
    };
    return {
      srcSet,
      onError,
    };
  },
});
</script>

<template>
  <img v-if="src" :src="src" :srcset="srcSet" :alt="alt" :onerror="onError" draggable="false"/>
</template>

<style scoped></style>
