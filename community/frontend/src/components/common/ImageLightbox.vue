<script lang="ts">
import { defineComponent, onUnmounted, ref, watch } from 'vue';
import type { PropType } from 'vue';

/**
 * 클릭하면 원본 이미지를 전체 화면 오버레이로 크게 보여주는 래퍼.
 * 슬롯 안의 이미지(썸네일)를 그대로 렌더링하고, 클릭/엔터 시 라이트박스를 연다.
 * src가 없으면 아무 동작도 하지 않는다.
 */
export default defineComponent({
  name: 'ImageLightbox',
  props: {
    src: {
      type: String as PropType<string | undefined>,
      default: undefined,
    },
    alt: {
      type: String as PropType<string | undefined>,
      default: '',
    },
  },
  setup(props) {
    const isOpen = ref(false);

    const open = () => {
      if (props.src) isOpen.value = true;
    };
    const close = () => {
      isOpen.value = false;
    };

    const onKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };

    // 열려 있는 동안 배경 스크롤 잠금 + ESC 닫기
    watch(isOpen, opened => {
      document.body.style.overflow = opened ? 'hidden' : '';
      if (opened) document.addEventListener('keydown', onKeydown);
      else document.removeEventListener('keydown', onKeydown);
    });

    onUnmounted(() => {
      if (isOpen.value) document.body.style.overflow = '';
      document.removeEventListener('keydown', onKeydown);
    });

    return { isOpen, open, close };
  },
});
</script>

<template>
  <div
    class="lightbox-trigger"
    :class="{ zoomable: !!src }"
    :role="src ? 'button' : undefined"
    :tabindex="src ? 0 : undefined"
    :aria-label="src ? '이미지 크게 보기' : undefined"
    @click="open"
    @keydown.enter="open">
    <slot />
  </div>
  <teleport to="body">
    <transition name="lightbox-fade">
      <div v-if="isOpen" class="lightbox-overlay" @click="close">
        <img :src="src" :alt="alt" class="lightbox-image" @click.stop />
        <button type="button" class="lightbox-close" aria-label="닫기" @click="close">&times;</button>
      </div>
    </transition>
  </teleport>
</template>

<style scoped>
/* 기본은 흐름 높이(auto). 부모가 stretch되는 그리드/플렉스에서 height:100%를 쓰면
   래퍼가 부풀어 뒤 요소를 밀어내므로, 꽉 채움이 필요한 곳에서만 :deep으로 지정한다. */
.lightbox-trigger {
  display: block;
  width: 100%;
}

.lightbox-trigger.zoomable {
  cursor: zoom-in;
}

.lightbox-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.88);
  cursor: zoom-out;
  padding: 2rem;
}

.lightbox-image {
  max-width: min(92vw, 1000px);
  max-height: 92vh;
  object-fit: contain;
  border-radius: 8px;
  cursor: default;
}

.lightbox-close {
  position: absolute;
  top: 1.6rem;
  right: 2rem;
  width: 4.4rem;
  height: 4.4rem;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
  font-size: 2.6rem;
  line-height: 1;
  cursor: pointer;
  transition: background 0.18s ease;
}

.lightbox-close:hover {
  background: rgba(255, 255, 255, 0.25);
}

.lightbox-fade-enter-active,
.lightbox-fade-leave-active {
  transition: opacity 0.2s ease;
}

.lightbox-fade-enter-from,
.lightbox-fade-leave-to {
  opacity: 0;
}
</style>
