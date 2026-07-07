<script lang="ts">
import { defineComponent } from 'vue';

// 포스터형 카드(공연/홈 갤러리) 로딩 스켈레톤
export default defineComponent({
  name: 'PosterCardSkeleton',
});
</script>

<template>
  <div class="poster-card-skeleton">
    <div class="skeleton sk-image"></div>
    <div class="sk-content">
      <div class="sk-row">
        <div class="skeleton sk-tag"></div>
        <div class="skeleton sk-title"></div>
      </div>
      <div class="skeleton sk-sub"></div>
    </div>
  </div>
</template>

<style scoped>
.poster-card-skeleton {
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}

.sk-image {
  width: 100%;
  aspect-ratio: 3 / 4;
  border-radius: 0;
}

.sk-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.sk-row {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.sk-tag {
  width: 46px;
  height: 26px;
  border-radius: 999px;
  flex-shrink: 0;
}

.sk-title {
  flex: 1;
  height: 18px;
  border-radius: 6px;
}

.sk-sub {
  width: 65%;
  height: 14px;
  border-radius: 6px;
}

@media (max-width: 600px) {
  .sk-content {
    padding: 1rem;
  }
}
</style>
