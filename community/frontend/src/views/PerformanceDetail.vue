<script lang="ts">
import { defineComponent } from 'vue';
import PerfoDetailPage from './shared/PerfoDetailPage.vue';
import { TYPE_PERFO } from '@/types';

export default defineComponent({
  name: 'performanceDetail',
  components: { PerfoDetailPage },
  setup() {
    return { TYPE_PERFO };
  },
});
</script>

<template>
  <perfo-detail-page :per-type="TYPE_PERFO.NORMAL" list-path="/performance" title="자체 프로그램 상세" />
</template>
