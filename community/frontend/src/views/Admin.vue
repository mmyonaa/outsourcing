<script lang="ts">
import ApocImageSet from '@/components/common/ApocImageSet.vue';
import { defineComponent, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'admin',
  components: { ApocImageSet, },
  setup() {
    const router=useRouter();

    return {
    };
  },
});
</script>

<template>
  <div class="page-common">
    <div class="admin-main-wrapper">
      <img class="admin-icon" src="/assets/images/admin/admin.png"/>
      관리자 페이지 홈입니다.
    </div>
  </div>
</template>
