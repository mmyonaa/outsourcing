<script lang="ts">
import { defineComponent } from 'vue';
import AdminBoardListPage from './shared/AdminBoardListPage.vue';
import { TYPE_BOARD } from '@/types';

export default defineComponent({
  name: 'adminNews',
  components: { AdminBoardListPage },
  setup() {
    return { TYPE_BOARD };
  },
});
</script>

<template>
  <admin-board-list-page
    :board-type="TYPE_BOARD.NEWS"
    base-path="/admin/news"
    title="보도자료"
    register-label="보도자료 등록"
    empty-message="등록된 보도자료가 없습니다" />
</template>
