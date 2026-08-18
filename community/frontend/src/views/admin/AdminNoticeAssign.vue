<script lang="ts">
import { defineComponent } from 'vue';
import AdminBoardAssignPage from './shared/AdminBoardAssignPage.vue';
import { TYPE_BOARD } from '@/types';

export default defineComponent({
  name: 'adminNoticeAssign',
  components: { AdminBoardAssignPage },
  setup() {
    return { TYPE_BOARD };
  },
});
</script>

<template>
  <admin-board-assign-page
    :board-type="TYPE_BOARD.NORMAL"
    list-path="/admin/notice"
    title="공지사항 등록"
    checkbox-label="중요 공지 여부"
    msg-label="공지" />
</template>
