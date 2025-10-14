<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'EmptyState',
  props: {
    message: {
      type: String,
      default: '결과가 없습니다',
    },
  },
});
</script>

<template>
  <div class="empty-state">
    <div class="empty-icon">📭</div>
    <p class="empty-message">{{ message }}</p>
  </div>
</template>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5rem 2rem;
  min-height: 300px;
}

.empty-icon {
  font-size: 6rem;
  margin-bottom: 2rem;
  opacity: 0.5;
}

.empty-message {
  font-size: 1.8rem;
  color: #999;
  font-family: 'Pretendard', sans-serif;
  font-weight: 500;
  text-align: center;
}

@media (max-width: 768px) {
  .empty-state {
    padding: 4rem 1.5rem;
    min-height: 250px;
  }

  .empty-icon {
    font-size: 5rem;
    margin-bottom: 1.5rem;
  }

  .empty-message {
    font-size: 1.6rem;
  }
}

@media (max-width: 480px) {
  .empty-state {
    padding: 3rem 1rem;
    min-height: 200px;
  }

  .empty-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
  }

  .empty-message {
    font-size: 1.4rem;
  }
}
</style>
