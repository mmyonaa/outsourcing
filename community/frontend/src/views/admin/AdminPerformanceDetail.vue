<script lang="ts">
import { defineComponent } from 'vue';
import AdminPerfoEditPage from './shared/AdminPerfoEditPage.vue';

export default defineComponent({
  name: 'adminPerformanceDetail',
  components: { AdminPerfoEditPage },
});
</script>

<template>
  <admin-perfo-edit-page list-path="/admin/performance" title="자체 프로그램 수정" />
</template>
