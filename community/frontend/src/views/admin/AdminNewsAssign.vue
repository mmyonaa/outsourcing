<script lang="ts">
import { defineComponent } from 'vue';
import AdminBoardAssignPage from './shared/AdminBoardAssignPage.vue';
import { TYPE_BOARD } from '@/types';

export default defineComponent({
  name: 'adminNewsAssign',
  components: { AdminBoardAssignPage },
  setup() {
    return { TYPE_BOARD };
  },
});
</script>

<template>
  <admin-board-assign-page
    :board-type="TYPE_BOARD.NEWS"
    list-path="/admin/news"
    title="보도자료 등록"
    checkbox-label="중요 보도자료 여부"
    msg-label="보도자료" />
</template>
