<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ErrorState',
  props: {
    message: {
      type: String,
      default: '내용을 불러오지 못했습니다.',
    },
  },
  emits: ['retry'],
});
</script>

<template>
  <div class="error-state">
    <div class="error-icon">⚠️</div>
    <p class="error-message">{{ message }}</p>
    <button type="button" class="error-retry" @click="$emit('retry')">다시 시도</button>
  </div>
</template>

<style scoped>
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5rem 2rem;
  min-height: 300px;
}

.error-icon {
  font-size: 5rem;
  margin-bottom: 1.5rem;
  opacity: 0.6;
}

.error-message {
  font-size: 1.7rem;
  color: #888;
  font-family: 'Pretendard', sans-serif;
  font-weight: 500;
  text-align: center;
  margin-bottom: 2rem;
}

.error-retry {
  font-family: 'Pretendard', sans-serif;
  font-size: 1.5rem;
  font-weight: 600;
  color: #fff;
  background: #e34363;
  border: none;
  border-radius: 999px;
  padding: 0.9rem 2.2rem;
  cursor: pointer;
  transition: background 0.18s ease, transform 0.18s ease;
}

.error-retry:hover {
  background: #c22a4a;
  transform: translateY(-1px);
}

.error-retry:active {
  transform: translateY(0);
}

@media (max-width: 768px) {
  .error-state {
    padding: 4rem 1.5rem;
    min-height: 250px;
  }
  .error-icon {
    font-size: 4rem;
  }
  .error-message {
    font-size: 1.5rem;
  }
}
</style>
