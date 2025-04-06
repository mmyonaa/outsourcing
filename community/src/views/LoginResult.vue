<script lang="ts">
import AppConfig from '@/constants';
import { initStore } from '@/stores/store-manager';
import { STATE_YN } from '@/types';
import { setApiToken } from '@/utils/apiClient';
import { saveLocalData } from '@/utils/common-util';
import { computed, defineComponent, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export default defineComponent({
  name: 'LoginResult',
  setup() {
    const storeManager = initStore();
    const route = useRoute();
    const router = useRouter();
    const token = computed(() => {
      const rawToken = route.query.token as string;
      return rawToken ? decodeURIComponent(rawToken) : '';
    });
    const userInfo = computed(() => {
      const userInfo = route.query.userInfo as string;
      return userInfo ? userInfo : '';
    });
    const isError = computed(() => route.query.error === STATE_YN.Y);
    onMounted(() => {
      if (isError.value) {
        // alert('아폭 계정이 없거나, 로그인 정보가 틀렸습니다');
      } else if (token.value) {
        saveLocalData(AppConfig.KEYS.LOGIN_TOKEN, token.value);
        saveLocalData(AppConfig.KEYS.LOGIN_USER, userInfo.value);
        setApiToken(token.value);
        storeManager.dataStore.setAuthToken(token.value);
      }
      router.push('/');
    });
    return {};
  },
});
</script>
<template>
  <div></div>
</template>

<style scoped></style>
