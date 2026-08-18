<script lang="ts">
import { defineComponent } from 'vue';
import BoardListPage from './shared/BoardListPage.vue';
import { TYPE_BOARD } from '@/types';

export default defineComponent({
  name: 'news',
  components: { BoardListPage },
  setup() {
    return { TYPE_BOARD };
  },
});
</script>

<template>
  <board-list-page
    :board-type="TYPE_BOARD.NEWS"
    route-name="news"
    detail-path-prefix="/news"
    title="보도자료"
    item-label="보도자료가" />
</template>
