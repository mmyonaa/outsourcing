<script lang="ts">
import { defineComponent } from 'vue';
import BoardListPage from './shared/BoardListPage.vue';
import { TYPE_BOARD } from '@/types';

export default defineComponent({
  name: 'notice',
  components: { BoardListPage },
  setup() {
    return { TYPE_BOARD };
  },
});
</script>

<template>
  <board-list-page
    :board-type="TYPE_BOARD.NORMAL"
    route-name="notice"
    detail-path-prefix="/notice"
    title="공지사항"
    item-label="공지사항이" />
</template>
