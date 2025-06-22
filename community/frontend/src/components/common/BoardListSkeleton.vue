<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import { VIEW_MODE_TYPE } from '@/types';

export default defineComponent({
  name: 'BoardListSkeleton',
  props: {
    viewMode: {
      type: String as PropType<VIEW_MODE_TYPE>,
      default: VIEW_MODE_TYPE.LIST,
    },
    viewCount: {
      type: Number as PropType<number>,
      default: 10,
    },
  },
  setup() {
    return {
      VIEW_MODE_TYPE,
    };
  },
});
</script>

<template>
  <div class="board-list-skeleton-wrapper">
    <div v-if="viewMode === VIEW_MODE_TYPE.LIST" class="board-list-skeleton-default">
      <div class="list-skeleton-item" v-for="i in viewCount" :key="i">
        <div class="board-tag"></div>
        <div class="board-body"></div>
        <div class="board-info"></div>
      </div>
    </div>
    <div v-else-if="viewMode === VIEW_MODE_TYPE.CARD" class="board-list-skeleton-card">
      <div class="list-skeleton-item" v-for="i in viewCount" :key="i"></div>
    </div>
  </div>
</template>
