<script lang="ts">
import { defineComponent, ref } from 'vue';
import type { PropType } from 'vue';
import copy from 'copy-to-clipboard';

export default defineComponent({
  name: 'BaseShareButton',
  props: {
    // 공유 제목 (Web Share 시트에 표시)
    title: {
      type: String as PropType<string>,
      default: '',
    },
    // 공유 설명 (선택)
    text: {
      type: String as PropType<string>,
      default: '',
    },
  },
  setup(props) {
    const copied = ref<boolean>(false);

    const onShare = async () => {
      const url = window.location.href;

      // 1순위: 모바일 네이티브 공유 시트 (카톡/메시지 등) — HTTPS에서만 동작
      if (typeof navigator !== 'undefined' && navigator.share) {
        try {
          await navigator.share({
            title: props.title,
            text: props.text || props.title,
            url,
          });
          return;
        } catch (e) {
          // 사용자가 취소했거나 미지원 — 복사 폴백으로 진행
        }
      }

      // 2순위: 링크 복사 (HTTP 포함 모든 환경)
      copy(url);
      copied.value = true;
      setTimeout(() => {
        copied.value = false;
      }, 2000);
    };

    return { copied, onShare };
  },
});
</script>

<template>
  <button type="button" class="base-share-button" :class="{ copied }" @click="onShare" aria-label="공유하기">
    <svg
      v-if="!copied"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
    <svg
      v-else
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
    <span class="label">{{ copied ? '복사됨' : '공유' }}</span>
  </button>
</template>

<style scoped>
.base-share-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 1.25rem;
  border: 1px solid #e0e0e0;
  border-radius: 999px;
  background: #fff;
  color: #555;
  font-size: 15px;
  font-weight: 600;
  line-height: 1;
  cursor: pointer;
  transition: border-color 0.18s ease, color 0.18s ease, background 0.18s ease;
  white-space: nowrap;
}

.base-share-button:hover {
  border-color: #e34363;
  color: #e34363;
}

.base-share-button.copied {
  border-color: #2e9e5b;
  color: #2e9e5b;
  background: rgba(46, 158, 91, 0.08);
}

.base-share-button svg {
  flex-shrink: 0;
}
</style>
