<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'BoardDetailSkeleton',
});
</script>

<template>
  <div class="board-header-skeleton-area">
    <div class="board-header">
      <div class="back-btn"></div>
      <div class="board-title"></div>
      <div class="board-info"></div>
    </div>
  </div>
  <div class="board-body"></div>
</template>

<style scoped></style>
