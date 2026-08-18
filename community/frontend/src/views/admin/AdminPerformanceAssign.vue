<script lang="ts">
import { defineComponent } from 'vue';
import AdminPerfoAssignPage from './shared/AdminPerfoAssignPage.vue';
import { TYPE_PERFO } from '@/types';

export default defineComponent({
  name: 'adminPerformanceAssign',
  components: { AdminPerfoAssignPage },
  setup() {
    return { TYPE_PERFO };
  },
});
</script>

<template>
  <admin-perfo-assign-page
    :per-type="TYPE_PERFO.NORMAL"
    list-path="/admin/performance"
    title="자체 프로그램 등록" />
</template>
