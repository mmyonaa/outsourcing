<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from 'vue';

// 아래로 스크롤하면 나타나는 '맨 위로' 버튼 (전역)
export default defineComponent({
  name: 'ScrollToTop',
  setup() {
    const visible = ref(false);

    const onScroll = () => {
      visible.value = window.scrollY > 400;
    };

    const toTop = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    onMounted(() => {
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    });

    onUnmounted(() => {
      window.removeEventListener('scroll', onScroll);
    });

    return { visible, toTop };
  },
});
</script>

<template>
  <transition name="stt">
    <button v-show="visible" class="scroll-to-top" type="button" aria-label="맨 위로 이동" @click="toTop">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 15l-6-6-6 6" />
      </svg>
    </button>
  </transition>
</template>

<style scoped>
.scroll-to-top {
  position: fixed;
  right: 2rem;
  bottom: 2rem;
  z-index: 90;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 50%;
  background: #e34363;
  color: #fff;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.18);
  cursor: pointer;
  transition: background 0.18s ease, transform 0.18s ease;
}

.scroll-to-top:hover {
  background: #c22a4a;
  transform: translateY(-2px);
}

.scroll-to-top:active {
  transform: translateY(0);
}

.stt-enter-active,
.stt-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.stt-enter-from,
.stt-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

@media (max-width: 600px) {
  .scroll-to-top {
    right: 1.2rem;
    bottom: 1.2rem;
    width: 44px;
    height: 44px;
  }
}
</style>
