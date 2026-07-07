<script lang="ts">
import BaseImageSet from '@/components/common/BaseImageSet.vue';
import { defineComponent, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'admin',
  components: { BaseImageSet, },
  setup() {
    const router=useRouter();

    const goBack = () =>{
      router.push('/')
    }

    return {
      goBack
    };
  },
});
</script>

<template>
  <div class="page-common admin-main">
    <div class="admin-main-wrapper">
      <img class="admin-icon" src="/assets/images/admin/admin.png"/>
      <h1>관리자 페이지 홈입니다.</h1>
    </div>
    <button class="back-button" @click="goBack">사이트 홈으로 돌아가기</button>
  </div>
</template>
