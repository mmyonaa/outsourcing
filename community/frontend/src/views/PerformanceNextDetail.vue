<script lang="ts">
import { defineComponent } from 'vue';
import PerfoDetailPage from './shared/PerfoDetailPage.vue';
import { TYPE_PERFO } from '@/types';

export default defineComponent({
  name: 'performanceNextDetail',
  components: { PerfoDetailPage },
  setup() {
    return { TYPE_PERFO };
  },
});
</script>

<template>
  <perfo-detail-page :per-type="TYPE_PERFO.NEXT" list-path="/performance/next" title="대관 프로그램 상세" />
</template>
