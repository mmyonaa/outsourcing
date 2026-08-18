<script lang="ts">
import { defineComponent } from 'vue';
import AdminPerfoAssignPage from './shared/AdminPerfoAssignPage.vue';
import { TYPE_PERFO } from '@/types';

export default defineComponent({
  name: 'adminPerformanceNextAssign',
  components: { AdminPerfoAssignPage },
  setup() {
    return { TYPE_PERFO };
  },
});
</script>

<template>
  <admin-perfo-assign-page
    :per-type="TYPE_PERFO.NEXT"
    list-path="/admin/performance/next"
    title="대관 프로그램 등록" />
</template>
