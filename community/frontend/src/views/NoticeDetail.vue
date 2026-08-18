<script lang="ts">
import { defineComponent } from 'vue';
import BoardDetailPage from './shared/BoardDetailPage.vue';
import { TYPE_BOARD } from '@/types';

export default defineComponent({
  name: 'noticeDetail',
  components: { BoardDetailPage },
  setup() {
    return { TYPE_BOARD };
  },
});
</script>

<template>
  <board-detail-page :board-type="TYPE_BOARD.NORMAL" list-path="/notice" title="공지사항 상세" />
</template>
