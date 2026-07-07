<script lang="ts">
import { defineComponent } from 'vue';

// 게시판 목록(공지/보도) 로딩 스켈레톤 — 데스크탑 행 / 모바일 카드 자동 전환
export default defineComponent({
  name: 'ListRowSkeleton',
});
</script>

<template>
  <div class="list-row-skeleton">
    <!-- 데스크탑: 한 줄 -->
    <div class="sk-desktop">
      <span class="skeleton sk-title"></span>
      <span class="skeleton sk-meta"></span>
    </div>
    <!-- 모바일: 카드 -->
    <div class="sk-mobile">
      <div class="skeleton sk-line-title"></div>
      <div class="skeleton sk-line-meta"></div>
    </div>
  </div>
</template>

<style scoped>
.sk-desktop {
  display: flex;
  align-items: center;
  gap: 2rem;
  padding: 1.7rem 2.5rem;
  border-bottom: 1px solid #eee;
}

.sk-desktop .sk-title {
  flex: 1;
  height: 16px;
  border-radius: 4px;
}

.sk-desktop .sk-meta {
  width: 220px;
  height: 14px;
  border-radius: 4px;
  flex-shrink: 0;
}

.sk-mobile {
  display: none;
  flex-direction: column;
  gap: 0.9rem;
  border: 1px solid #e1e1e1;
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 1rem;
}

.sk-line-title {
  width: 70%;
  height: 17px;
  border-radius: 4px;
}

.sk-line-meta {
  width: 45%;
  height: 13px;
  border-radius: 4px;
}

@media (max-width: 768px) {
  .sk-desktop {
    display: none;
  }
  .sk-mobile {
    display: flex;
  }
}
</style>
