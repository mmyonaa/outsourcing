<script lang="ts">
import { defineComponent } from 'vue';
import BoardDetailPage from './shared/BoardDetailPage.vue';
import { TYPE_BOARD } from '@/types';

export default defineComponent({
  name: 'newsDetail',
  components: { BoardDetailPage },
  setup() {
    return { TYPE_BOARD };
  },
});
</script>

<template>
  <board-detail-page :board-type="TYPE_BOARD.NEWS" list-path="/news" title="보도자료 상세" />
</template>
