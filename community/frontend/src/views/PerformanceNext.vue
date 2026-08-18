<script lang="ts">
import { defineComponent } from 'vue';
import PerfoListPage from './shared/PerfoListPage.vue';
import { TYPE_PERFO } from '@/types';

export default defineComponent({
  name: 'performanceNext',
  components: { PerfoListPage },
  setup() {
    return { TYPE_PERFO };
  },
});
</script>

<template>
  <perfo-list-page
    :per-type="TYPE_PERFO.NEXT"
    route-name="performanceNext"
    detail-path-prefix="/performance/next"
    title="대관 프로그램" />
</template>
