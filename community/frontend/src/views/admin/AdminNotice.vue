<script lang="ts">
import { defineComponent } from 'vue';
import AdminBoardListPage from './shared/AdminBoardListPage.vue';
import { TYPE_BOARD } from '@/types';

export default defineComponent({
  name: 'adminNotice',
  components: { AdminBoardListPage },
  setup() {
    return { TYPE_BOARD };
  },
});
</script>

<template>
  <admin-board-list-page
    :board-type="TYPE_BOARD.NORMAL"
    base-path="/admin/notice"
    title="공지사항"
    register-label="공지사항 등록"
    empty-message="등록된 공지사항이 없습니다" />
</template>
