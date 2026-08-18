<script lang="ts">
import { defineComponent } from 'vue';
import AdminBoardEditPage from './shared/AdminBoardEditPage.vue';

export default defineComponent({
  name: 'adminNoticeDetail',
  components: { AdminBoardEditPage },
});
</script>

<template>
  <admin-board-edit-page
    list-path="/admin/notice"
    title="공지사항 수정"
    checkbox-label="중요 공지 여부"
    msg-label="공지" />
</template>
