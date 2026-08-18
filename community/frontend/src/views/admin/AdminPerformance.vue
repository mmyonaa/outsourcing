<script lang="ts">
import { defineComponent } from 'vue';
import AdminPerfoListPage from './shared/AdminPerfoListPage.vue';
import { TYPE_PERFO } from '@/types';

export default defineComponent({
  name: 'adminPerformance',
  components: { AdminPerfoListPage },
  setup() {
    return { TYPE_PERFO };
  },
});
</script>

<template>
  <admin-perfo-list-page
    :per-type="TYPE_PERFO.NORMAL"
    base-path="/admin/performance"
    title="자체 프로그램 관리" />
</template>
