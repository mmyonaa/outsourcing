<script lang="ts">
import { defineComponent } from 'vue';
import PerfoListPage from './shared/PerfoListPage.vue';
import { TYPE_PERFO } from '@/types';

export default defineComponent({
  name: 'performance',
  components: { PerfoListPage },
  setup() {
    return { TYPE_PERFO };
  },
});
</script>

<template>
  <perfo-list-page
    :per-type="TYPE_PERFO.NORMAL"
    route-name="performance"
    detail-path-prefix="/performance"
    title="자체 프로그램" />
</template>
