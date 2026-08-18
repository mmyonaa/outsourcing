<script lang="ts">
import { defineComponent } from 'vue';
import AdminPerfoEditPage from './shared/AdminPerfoEditPage.vue';

export default defineComponent({
  name: 'adminPerformanceNextDetail',
  components: { AdminPerfoEditPage },
});
</script>

<template>
  <admin-perfo-edit-page list-path="/admin/performance/next" title="대관 프로그램 수정" />
</template>
