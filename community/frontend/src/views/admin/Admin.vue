<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'admin',
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
      <img class="admin-icon" src="/assets/images/admin/admin.png" alt="관리자" />
      <h1>관리자 페이지 홈입니다.</h1>
    </div>
    <button class="back-button" @click="goBack">사이트 홈으로 돌아가기</button>
  </div>
</template>
