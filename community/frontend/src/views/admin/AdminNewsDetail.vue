<script lang="ts">
import { defineComponent } from 'vue';
import AdminBoardEditPage from './shared/AdminBoardEditPage.vue';

export default defineComponent({
  name: 'adminNewsDetail',
  components: { AdminBoardEditPage },
});
</script>

<template>
  <admin-board-edit-page
    list-path="/admin/news"
    title="보도자료 수정"
    checkbox-label="중요 보도자료 여부"
    msg-label="보도자료" />
</template>
